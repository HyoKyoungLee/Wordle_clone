import { isValidWord } from "./api.mjs";
import { GlobalState } from "./globals.mjs";
import { shakeInvalidInput } from "./animation.mjs";
import { onGameLoss, onGameWin } from "./end-game.mjs";
import { showToast } from "./toast.mjs";

// 다음 줄로 이동하는 코드
const nextLine = () => {
  GlobalState.letterArray = [];
  ++GlobalState.attemps;
  if (GlobalState.attemps > 5) {
    onGameLoss();
  }
  GlobalState.index = 0;
};

// 텍스트를 입력했을 때 메서드
const handleTextinput = (keyCode) => {
  const thisBlock = document.querySelector(
    `.board-block[data-index='${GlobalState.attemps}${GlobalState.index}']`
  );

  if (keyCode === 8) handleBackspace();
  else if (keyCode === 13) {
    if (GlobalState.index === 5) {
      handleEnterKey();
    } else {
      showToast("<p>5글자를 입력해주세요! 😢</p>");
      shakeInvalidInput();
    }
  } else if (65 <= keyCode && keyCode <= 90) {
    if (GlobalState.index < 5) {
      let charCode = String.fromCharCode(keyCode);
      thisBlock.innerText = charCode;
      GlobalState.letterArray.push(charCode);
      GlobalState.index += 1;
    }
  }
};

// 백스페이스 눌렀을 때 메서드
const handleBackspace = () => {
  if (GlobalState.index > 0) {
    const preBlock = document.querySelector(
      `.board-block[data-index='${GlobalState.attemps}${
        GlobalState.index - 1
      }']`
    );
    preBlock.innerText = "";
    GlobalState.letterArray.pop();
  }
  if (GlobalState.index !== 0) GlobalState.index -= 1;
};

// 엔터키를 눌렀을 때 메서드
const handleEnterKey = async () => {
  const isValidWord_response = await isValidWord(
    GlobalState.letterArray.join("")
  );
  if (isValidWord_response) {
    let correctAnswersCount = 0;
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${GlobalState.attemps}${i}']`
      );
      const letter = block.innerText;
      const answerLetter = GlobalState.answer[i];
      if (letter === answerLetter) {
        correctAnswersCount += 1;
        block.style.background = "#76ef7a";
      } else if (GlobalState.answer.includes(letter))
        block.style.background = "#ffdc46";
      else block.style.background = "#d4cfbe";
      block.style.color = "white";
    }
    if (correctAnswersCount === 5) {
      onGameWin();
    } else {
      nextLine();
    }
  } else {
    showToast("<p>단어만 입력 가능합니다! 😢</p>");
    shakeInvalidInput();
  }
};

export const handleKeydown = (event) => {
  if (GlobalState.isGameStopped) return;
  let keyCode;

  if (event instanceof PointerEvent) {
    keyCode = Number(event.target.dataset.index);
  } else {
    keyCode = event.keyCode;
  }

  const thisKeyblock = document.querySelector(
    `.key-block[data-index='${keyCode}']`
  );

  thisKeyblock.animate(
    [
      {
        backgroundColor: "#404040",
        borderColor: "#404040",
        transform: "scale(0.9)",
      },
      {
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        transform: "scale(1)",
      },
    ],
    {
      duration: 250,
      easing: "ease-out",
    }
  );

  handleTextinput(keyCode);
};
