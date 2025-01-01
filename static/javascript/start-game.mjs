import { GlobalState } from "./globals.mjs";
import { handleKeydown } from "./handle-keyboard.mjs";
import { toast } from "./toast.mjs";
import { getAnswer } from "./api.mjs";

let elapsedTime = 0;
const keyBlocks = document.querySelector("footer");

// 게임시작
export const startGame = async () => {
  keyBlocks.addEventListener("click", handleKeydown);
  window.addEventListener("keydown", handleKeydown);
  const cleanAllBlock = () => {
    for (let i = 0; i < GlobalState.attemps; i++) {
      for (let x = 0; x < 5; x++) {
        const block = document.querySelector(
          `.board-block[data-index='${i}${x}']`
        );
        block.style.background = "#ffe49337";
        block.innerText = "";
        block.style.color = "#846300";
      }
    }
  };
  if (GlobalState.isStart) {
    cleanAllBlock();
    GlobalState.letterArray = [];
    GlobalState.index = 0;
    GlobalState.attemps = 0;
    GlobalState.timer = null;
    elapsedTime = 0;
    GlobalState.isGameStopped = false;
    toast.style.visibility = "hidden";
    GlobalState.answer = await getAnswer();
  } else {
    GlobalState.isStart = true;
  }

  startTimer();
};

// 타이머 시작
export const startTimer = () => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const updateTimer = () => {
    const timerDiv = document.querySelector("#timer");
    timerDiv.innerText = formatTime(elapsedTime);
  };
  GlobalState.timer = setInterval(() => {
    if (!GlobalState.isLoading) {
      elapsedTime += 1;
      updateTimer();
    }
  }, 1000);
};
