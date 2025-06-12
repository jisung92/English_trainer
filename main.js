let data = [
  { Korean: "그 사람이 나한테 갑자기 말을 걸었어.", English: "The guy came up to me out of the blue." },
  { Korean: "나는 아침 일찍 일어났어.", English: "I got up early in the morning." },
  { Korean: "비가 와서 집에 있었어.", English: "I stayed home because it was raining." },
  { Korean: "너무 배가 고팠어.", English: "I was so hungry." },
  { Korean: "영화를 재미있게 봤어.", English: "I enjoyed the movie." }
];

let timer = null;
let voicesReady = false;

function getDelayByLength(text) {
  const baseDelay = 150;
  const maxDelay = 3000;
  return Math.min(text.length * baseDelay, maxDelay);
}

function getEnglishVoice() {
  const voices = speechSynthesis.getVoices();
  return voices.find(voice =>
    (voice.lang.startsWith('en-') && (
      voice.name.includes('Samantha') || 
      voice.name.includes('Daniel') || 
      voice.name.includes('Google') || 
      voice.name.includes('UK')
    ))
  );
}

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function playSentence() {
  // ✅ 이전 발성 및 타이머 초기화
  speechSynthesis.cancel();
  if (timer) clearTimeout(timer);

  const item = pickRandom();
  document.getElementById("sentence").innerText = `${item.Korean}\n`;

  // ✅ 음성엔진 초기화 안정화 (Safari 대응 핵심포인트)
  setTimeout(() => {
    const utterKor = new SpeechSynthesisUtterance(item.Korean);
    utterKor.lang = 'ko-KR';
    if (voicesReady) {
      speechSynthesis.speak(utterKor);
    }

    utterKor.onend = () => {
      const delay = getDelayByLength(item.Korean);
      timer = setTimeout(() => {
        const utterEng = new SpeechSynthesisUtterance(item.English);
        utterEng.lang = 'en-US';
        utterEng.rate = 0.9;
        if (voicesReady) {
          utterEng.voice = getEnglishVoice();
          speechSynthesis.speak(utterEng);
        }
        document.getElementById("sentence").innerText = `${item.Korean}\n${item.English}`;
      }, delay);
    };
  }, 150); // ✅ 이 딜레이가 사파리에서 핵심 안정화 역할
}

function playNext() {
  playSentence();
}

function prev() {
  playSentence();
}

speechSynthesis.onvoiceschanged = () => {
  voicesReady = true;
  console.log("음성엔진 준비 완료");
}

// ✅ 앱 첫 실행 시 바로 랜덤 시작
window.onload = () => {
  playSentence();
}
