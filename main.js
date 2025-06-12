// ✅ 예시 스텁 데이터 (이곳에 구글시트 연동도 쉽게 확장 가능)
let data = [
  { Korean: "그 사람이 나한테 갑자기 말을 걸었어.", English: "The guy came up to me out of the blue." },
  { Korean: "나는 아침 일찍 일어났어.", English: "I got up early in the morning." },
  { Korean: "비가 와서 집에 있었어.", English: "I stayed home because it was raining." },
  { Korean: "너무 배가 고팠어.", English: "I was so hungry." },
  { Korean: "영화를 재미있게 봤어.", English: "I enjoyed the movie." }
];

// ✅ 나중에 구글시트 연동시:
/*
async function fetchData() {
  const SHEET_ID = '구글시트ID';
  const SHEET_NAME = 'Sheet1';
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

  try {
    const res = await fetch(url);
    data = await res.json();
    console.log("데이터 불러오기 성공:", data);
  } catch (e) {
    console.error("데이터 불러오기 실패:", e);
  }
}
// fetchData();
*/

let index = 0;
let timer = null;

function getDelayByLength(text) {
  const baseDelay = 150;
  const maxDelay = 3000;
  return Math.min(text.length * baseDelay, maxDelay);
}

// ✅ 더 자연스러운 영어 음성 찾기
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

function playSentence() {
  if (index < 0) index = 0;
  if (index >= data.length) {
    document.getElementById("sentence").innerText = "모든 문장을 완료했습니다!";
    return;
  }

  speechSynthesis.cancel();
  if (timer) clearTimeout(timer);

  const item = data[index];
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
      utterEng.voice = getEnglishVoice();
      speechSynthesis.speak(utterEng);
      document.getElementById("sentence").innerText = `${item.Korean}\n${item.English}`;
    }, delay);
  };
}

function playNext() {
  index++;
  if (index >= data.length) {
    index = data.length - 1; 
  }
  playSentence();
}

function prev() {
  index--;
  if (index < 0) index = 0;
  playSentence();
}

// ✅ 브라우저 음성 로딩 후 첫 문장 출력
window.speechSynthesis.onvoiceschanged = () => {
  playSentence();
}
