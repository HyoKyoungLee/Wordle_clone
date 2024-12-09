let index = 0;
let attemps = 0;
let timer = null;
let elapsedTime = 0;
let isStart = false;
let answer = null;
let letterArray = [];
let isLoading = false;
let isGameStopped = false;
const keyBlocks = document.querySelector("footer");
const toast = document.querySelector(".toast");

const API_URL = "https://wordsapiv1.p.rapidapi.com/words/";
const API_OPTION = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
    "x-rapidapi-key": "c0f74f441cmsh567cad65aabece8p1aad19jsn4142e09a557d",
  },
};
const apiRequest = async (callback) => {
  const loadingScreen = document.querySelector("#loading-screen");
  isLoading = true;
  loadingScreen.style.visibility = "visible";

  const result = await callback();

  loadingScreen.style.visibility = "hidden";
  isLoading = false;

  return result;
};

const isValidWord = async (letter) => {
  const apiParams = `?letterPattern=%5E${letter.toLowerCase()}%24`;

  const response = await fetch(`${API_URL}${apiParams}`, API_OPTION);
  const responseJson = await response.json();

  return responseJson.results.total;
};

const getAnswer = async () => {
  const apiParams =
    "?random=true&letterPattern=%5E.{5}%24&lettersMin=5&lettersMax=5&partOfSpeech=verb";

  const response = await fetch(`${API_URL}${apiParams}`, API_OPTION);

  const responseJson = await response.json();
  let responseWord = responseJson.word;

  return responseWord.toUpperCase();
};

(async () => {
  answer = await apiRequest(getAnswer);
})();

const startTimer = () => {
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
  timer = setInterval(() => {
    if (!isLoading) {
      elapsedTime += 1;
      updateTimer();
    }
  }, 1000);
};

const handleBackspace = () => {
  if (index > 0) {
    const preBlock = document.querySelector(
      `.board-block[data-index='${attemps}${index - 1}']`
    );
    preBlock.innerText = "";
    letterArray.pop();
  }
  if (index !== 0) index -= 1;
};

const shakeInvalidInput = () => {
  const targetBlockRow = document.querySelector(
    `.board-row[data-index='${attemps}']`
  );

  targetBlockRow.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0px)" },
    ],
    {
      duration: 500,
      iterations: 1,
    }
  );
};

const nextLine = () => {
  letterArray = [];
  attemps += 1;
  if (attemps > 5) {
    onGameLoss();
  }
  index = 0;
};

function showToast(message) {
  const toastContents = document.querySelector(".toast-contents");
  toastContents.innerHTML = message;

  toast.style.visibility = "visible";
  setTimeout(() => {
    toast.style.visibility = "hidden";
  }, 2000);
}

const handleEnterKey = async () => {
  const isValidWord_response = await apiRequest(() =>
    isValidWord(letterArray.join(""))
  );
  if (isValidWord_response) {
    let correctAnswersCount = 0;
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attemps}${i}']`
      );
      const letter = block.innerText;
      const answerLetter = answer[i];
      if (letter === answerLetter) {
        correctAnswersCount += 1;
        block.style.background = "#76ef7a";
      } else if (answer.includes(letter)) block.style.background = "#ffdc46";
      else block.style.background = "#d4cfbe";
      block.style.color = "white";
    }
    if (correctAnswersCount === 5) {
      onGameWin();
    }
    nextLine();
  } else {
    showToast("<p>단어만 입력 가능합니다! 😢</p>");
    shakeInvalidInput();
  }
};

const handleTextinput = (keyCode) => {
  const thisBlock = document.querySelector(
    `.board-block[data-index='${attemps}${index}']`
  );

  if (keyCode === 8) handleBackspace();
  else if (keyCode === 13) {
    if (index === 5) {
      handleEnterKey();
    } else {
      showToast("<p>5글자를 입력해주세요! 😢</p>");
      shakeInvalidInput();
    }
  } else if (65 <= keyCode && keyCode <= 90) {
    if (index < 5) {
      charCode = String.fromCharCode(keyCode);
      thisBlock.innerText = charCode;
      letterArray.push(charCode);
      index += 1;
    }
  }
};

const handleKeydown = (event) => {
  if (isGameStopped) return;
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

const displayGameover = (toastValue) => {
  isGameStopped = true;

  const toastContents = document.querySelector(".toast-contents");

  const gameOverBtn = `<button id="reply-btn">게임 다시하기</button>`;
  const toastAnswerDiv = `<div id="toast-contents-answer">정답: ${answer}</div>`;
  const toastContentsValue = toastValue + toastAnswerDiv + gameOverBtn;

  toastContents.innerHTML = toastContentsValue;
  toast.style.visibility = "visible";
  clearInterval(timer);

  const replyBtn = document.querySelector("#reply-btn");
  replyBtn.addEventListener("click", gameStart);
};

const onGameLoss = () => {
  const toastHeaderHTML = `<header>6번의 기회를 모두 사용했습니다 😢</header>`;
  displayGameover(toastHeaderHTML);
};

const onGameWin = () => {
  const timer = document.querySelector("#timer");

  const setClearTime = () => {
    const clearTime = timer.innerText;
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

const gameStart = async () => {
  keyBlocks.addEventListener("click", handleKeydown);
  window.addEventListener("keydown", handleKeydown);
  const cleanAllBlock = () => {
    for (let i = 0; i < attemps; i++) {
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
  if (isStart) {
    cleanAllBlock();
    index = 0;
    attemps = 0;
    timer = null;
    elapsedTime = 0;
    isGameStopped = false;
    toast.style.visibility = "hidden";
    answer = await apiRequest(getAnswer);
  } else {
    isStart = true;
  }

  startTimer();
};

const handleModalOn = () => {
  if (isGameStopped) return;
  modal.style.visibility = "visible";
  clearInterval(timer);
};

const handleModalOff = () => {
  modal.style.visibility = "hidden";
  if (isStart) {
    startTimer();
  } else gameStart();
};

const modal = document.querySelector(".modal");
const modalOffButton = document.querySelector("#modal-offbutton");
modalOffButton.addEventListener("click", handleModalOff);

const modalOnButton = document.querySelector("#modal-onbutton");
modalOnButton.addEventListener("click", handleModalOn);
