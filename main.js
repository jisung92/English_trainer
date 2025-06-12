let data = [
  { Korean: "그 사람이 나한테 갑자기 말을 걸었어.", English: "The guy came up to me out of the blue." },
  { Korean: "나는 아침 일찍 일어났어.", English: "I got up early in the morning." },
  { Korean: "비가 와서 집에 있었어.", English: "I stayed home because it was raining." },
  { Korean: "너무 배가 고팠어.", English: "I was so hungry." },
  { Korean: "영화를 재미있게 봤어.", English: "I enjoyed the movie." }
];

let timer = null;
let autoPlay = false;
let voicesLoaded = false;
let englishVoice = null;

function getDelayByLength(text) {
  const baseDelay = 150;
  const maxDelay = 3000;
  return Math.min(text.length * baseDelay, maxDelay);
}

function loadVoices() {
  let voices = speechSynthesis.getVoices();
  englishVoice = voices.find(voice =>
    (voice.lang.startsWith('en-') && (
      voice.name.includes('Samantha') || 
      voice.name.includes('Daniel') || 
      voice.name.includes('Google') || 
      voice.name.includes('UK')
    ))
  );
}

speechSynthesis.onvoiceschanged = () => {
  loadVoices();
  voicesLoaded = true;
  playSentence(); // 첫 실행 시 여기서 시작
}

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function playSentence() {
  if (!voicesLoaded) {
    console.log("음성 데이터 로드 중...");
    return;
  }

  speechSynthesis.cancel();
  if (timer) clearTimeout(timer);

  const item = pickRandom();
  document.getElementById("sentence").innerText = `${item.Korean}\n`;

  const utterKor = new SpeechSynthesisUtterance(item.Korean);
  utterKor.lang = 'ko-KR';
  speechSynthesis.speak(utterKor);

  utterKor.onend = () => {
    const delay = getDelayByLength(item.Korean);
    timer = setTimeout(() => {
      const utterEng = new SpeechSynthesisUtterance(item.English);
      utterEng.lang = 'en-US';
      utterEng.rate = 0.9;
      utterEng.voice = englishVoice;
      speechSynthesis.speak(utterEng);

      document.getElementById("sentence").innerText = `${item.Korean}\n${item.English}`;

      utterEng.onend = () => {
        if (autoPlay) {
          setTimeout(playSentence, 1000);
        }
      };
    }, delay);
  };
}

function playNext() {
  playSentence();
}

function toggleAutoPlay() {
  autoPlay = !autoPlay;
  const btn = document.getElementById("autoButton");

  if (autoPlay) {
    btn.textContent = "자동재생 중지";
    btn.style.backgroundColor = "green";
    btn.style.color = "white";
  } else {
    btn.textContent = "자동재생 시작";
    btn.style.backgroundColor = "";
    btn.style.color = "";
  }

  if (autoPlay) {
    playSentence();
  }
}
