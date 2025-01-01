//  아래는 게임 방법 모달 관련 메서드
import { GlobalState } from "./globals.mjs";
import { startGame, startTimer } from "./start-game.mjs";

const handleGameGuideModalOn = () => {
  if (GlobalState.isGameStopped) return;
  gameGuideModal.style.visibility = "visible";
  clearInterval(GlobalState.timer);
};

const handleGameGuideModalOff = () => {
  gameGuideModal.style.visibility = "hidden";
  if (GlobalState.isStart) {
    startTimer();
  } else startGame();
};

const gameGuideModal = document.querySelector(".modal-guide");
const gameGuideModalOffButton = document.querySelector(
  "#modal-guide-offbutton"
);
gameGuideModalOffButton.addEventListener("click", handleGameGuideModalOff);

const gameGuideModalOnButton = document.querySelector("#modal-guide-onbutton");
gameGuideModalOnButton.addEventListener("click", handleGameGuideModalOn);
