const APP_VERSION = "v4.2";

// 구글 스프레드시트 정보
const SHEET_ID = '10a6fRoZKhtnZEvX6BgIUyNxp7LCFWd-D2nSKjqkMnNk';
const SHEET_NAME = 'Sheet1';

let data = [];
let timer = null;
let autoPlay = false;
let voicesLoaded = false;
let englishVoice = null;

async function fetchData() {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

  try {
    const res = await fetch(url);
    data = await res.json();
    console.log("데이터 불러오기 성공:", data);
  } catch (e) {
    console.error("데이터 불러오기 실패:", e);
    alert("데이터 로드 실패! 스프레드시트 공유설정 확인.");
  }
}

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
      voice.name.includes('US')
    ))
  );
  voicesLoaded = true;
}

speechSynthesis.onvoiceschanged = () => {
  loadVoices();
};

function ensureVoicesLoaded() {
  if (!voicesLoaded) {
    loadVoices();
  }
}

function pickRandom() {
  return data[Math.floor(Math.random() * data.length)];
}

function playSentence() {
  if (data.length === 0) {
    console.warn("아직 데이터가 준비되지 않았습니다.");
    return;
  }

  ensureVoicesLoaded();

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
  if (data.length === 0) {
    alert("데이터가 아직 로드되지 않았습니다.");
    return;
  }
  ensureVoicesLoaded();
  playSentence();
}

function toggleAutoPlay() {
  if (data.length === 0) {
    alert("데이터가 아직 로드되지 않았습니다.");
    return;
  }

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

// 최초 로딩 시 실행
window.onload = async () => {
  document.getElementById("version").innerText = APP_VERSION;

  await fetchData();
  if (data.length > 0) {
    document.getElementById("sentence").innerText = "데이터 로드 완료. 시작하려면 버튼을 누르세요.";
  } else {
    document.getElementById("sentence").innerText = "데이터 로드 실패.";
  }

  loadVoices();
};
