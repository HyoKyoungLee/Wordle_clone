import { GlobalState } from "./globals.mjs";
import { toast } from "./toast.mjs";
import { startGame } from "./start-game.mjs";

// 게임이 종료됐을때
const displayGameover = (toastValue) => {
  GlobalState.isGameStopped = true;

  const toastContents = document.querySelector(".toast-contents");

  const gameOverBtn = `<button id="reply-btn">게임 다시하기</button>`;
  const toastAnswerDiv = `<div id="toast-contents-answer">정답: ${GlobalState.answer}</div>`;
  const toastContentsValue = toastValue + toastAnswerDiv + gameOverBtn;

  toastContents.innerHTML = toastContentsValue;
  toast.style.visibility = "visible";
  clearInterval(GlobalState.timer);

  const replyBtn = document.querySelector("#reply-btn");
  replyBtn.addEventListener("click", startGame);
};

// 게임이 졌을 때 실행행
export const onGameLoss = () => {
  const toastHeaderHTML = `<header>6번의 기회를 모두 사용했습니다 😢</header>`;
  displayGameover(toastHeaderHTML);
};

// 게임이 이겼을 때 실행
export const onGameWin = () => {
  GlobalState.attemps++;
  const timerVal = document.querySelector("#timer");

  const setClearTime = () => {
    const clearTime = timerVal.innerText;
    const [minutes, seconds] = clearTime.split(":");
    const formattedMinutes = parseInt(minutes, 10);
    const formattedSeconds = parseInt(seconds, 10);

    return formattedMinutes === 0
      ? `${formattedSeconds}초`
      : `${formattedMinutes}분 ${formattedSeconds}초`;
  };

  const toastHeaderHTML = `<header>🎉 정답을 맞췄습니다! 🎉</header>`;
  const toastClearTimeHTML = `<p>소요시간: ${setClearTime()}</p>`;
  const toastTotalContent = `<div id="toast-contents-clear">${toastHeaderHTML}${toastClearTimeHTML}</div>`;
  displayGameover(toastTotalContent);
};
