// ✅ 스텁 데이터 (예시 문장)
let data = [
  {
    Korean: "그 사람이 나한테 갑자기 말을 걸었어.",
    English: "The guy came up to me out of the blue."
  }
];

// ✅ 구글시트 연동 (나중에 사용할 부분)
/*
async function fetchData() {
  const SHEET_ID = '여기에 시트ID입력';
  const SHEET_NAME = 'Sheet1';  // 시트 이름 (보통 기본값은 Sheet1)
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  
  try {
    const res = await fetch(url);
    data = await res.json();
    console.log("데이터 불러오기 성공:", data);
  } catch (e) {
    console.error("데이터 불러오기 실패:", e);
  }
}

// 페이지 로딩 시 데이터 불러오기 (구글시트 연동시 활성화)
// fetchData();
*/

function playNext() {
  const randomIndex = Math.floor(Math.random() * data.length);
  const item = data[randomIndex];

  document.getElementById("sentence").innerText = `${item.Korean}\n${item.English}`;

  const utterKor = new SpeechSynthesisUtterance(item.Korean);
  utterKor.lang = 'ko-KR';
  speechSynthesis.speak(utterKor);

  utterKor.onend = () => {
    const utterEng = new SpeechSynthesisUtterance(item.English);
    utterEng.lang = 'en-US';
    utterEng.rate = 0.9; // 속도 약간 조정 (iOS 호환)
    speechSynthesis.speak(utterEng);
  };
}
