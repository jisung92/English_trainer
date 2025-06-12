let data = [
  { Korean: "그 사람이 나한테 갑자기 말을 걸었어.", English: "The guy came up to me out of the blue." },
  { Korean: "나는 아침 일찍 일어났어.", English: "I got up early in the morning." },
  { Korean: "비가 와서 집에 있었어.", English: "I stayed home because it was raining." },
  { Korean: "너무 배가 고팠어.", English: "I was so hungry." },
  { Korean: "영화를 재미있게 봤어.", English: "I enjoyed the movie." }
];

let index = 0;

function getDelayByLength(text) {
  const baseDelay = 150; // 글자당 150ms
  const maxDelay = 3000; // 최대 3초
  return Math.min(text.length * baseDelay, maxDelay);
}

function playNext() {
  if (index >= data.length) {
    document.getElementById("sentence").innerText = "모든 문장을 완료했습니다!";
    return;
  }

  const item = data[index];
  document.getElementById("sentence").innerText = `${item.Korean}\n`;

  const utterKor = new SpeechSynthesisUtterance(item.Korean);
  utterKor.lang = 'ko-KR';
  speechSynthesis.speak(utterKor);

  utterKor.onend = () => {
    const delay = getDelayByLength(item.Korean);
    setTimeout(() => {
      const utterEng = new SpeechSynthesisUtterance(item.English);
      utterEng.lang = 'en-US';
      utterEng.rate = 0.9;
      speechSynthesis.speak(utterEng);
      document.getElementById("sentence").innerText = `${item.Korean}\n${item.English}`;
    }, delay);
  };

  index++;
}
