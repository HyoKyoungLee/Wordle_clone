let index = 0;
let attemps = 0;
let timer = 0;
let letterArray = [];

const appStart = async () => {
  const checkWord = async (letter) => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${letter}`
    );

    return response.ok;
  };

  const getAnswer = async () => {
    let isWordValid = false;
    while (!isWordValid) {
      let response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5"
      );
      let responseJson = await response.json();
      let responseString = responseJson[0];

      isWordValid = await checkWord(responseString);

      if (isWordValid) return responseString.toUpperCase();
    }
  };

  const answer = await getAnswer();

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

  function showToast(message) {
    const toast = document.querySelector(".toast");
    const toastContents = document.querySelector(".toast-contents");
    toastContents.innerHTML = message;

    toast.style.visibility = "visible";
    setTimeout(() => {
      toast.style.visibility = "hidden";
    }, 2000);
  }

  const displayGameover = (toastValue) => {
    window.removeEventListener("keydown", handleKeydown);
    keyBlocks.removeEventListener("click", handleKeydown);
    modalOnButton.removeEventListener("click", displayModal);

    const toast = document.querySelector(".toast");
    const toastContents = document.querySelector(".toast-contents");

    toastContents.innerHTML = toastValue;
    toast.style.visibility = "visible";
    clearInterval(timer);
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
    const toastAnswerHTML = `<p>정답: ${answer}</p>`;
    const toastClearTimeHTML = `<p>소요시간: ${setClearTime()}</p>`;
    const toastDivContent = `<div>${toastAnswerHTML}${toastClearTimeHTML}</div>`;
    const toastTotalContent = `<div id="toast-contents-clear">${toastHeaderHTML}${toastDivContent}</div>`;
    displayGameover(toastTotalContent);
  };

  const nextLine = () => {
    letterArray = [];
    attemps += 1;
    if (attemps > 5) {
      onGameLoss();
    }
    index = 0;
  };

  const handleEnterKey = async () => {
    const checkWord_response = await checkWord(letterArray.join(""));
    if (checkWord_response) {
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
        },
      ],
      500
    );

    handleTextinput(keyCode);
  };

  const keyBlocks = document.querySelector("footer");
  keyBlocks.addEventListener("click", handleKeydown);

  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const currentTime = new Date();
      const elapsedTime = new Date(currentTime - startTime);
      const minutes = elapsedTime.getMinutes().toString().padStart(2, "0");
      const seconds = elapsedTime.getSeconds().toString().padStart(2, "0");
      const timeH1 = document.querySelector("#timer");
      timeH1.innerText = `${minutes}:${seconds}`;
    }
    timer = setInterval(setTime, 1000);
  };
  startTimer();

  window.addEventListener("keydown", handleKeydown);
};

function displayModal() {
  if (modal.style.visibility === "hidden") {
    modal.style.visibility = "visible";
  } else {
    modal.style.visibility = "hidden";
  }
}

const modal = document.querySelector(".modal");
const modalOffButton = document.querySelector("#modal-offbutton");
modalOffButton.addEventListener("click", displayModal);

const modalOnButton = document.querySelector("#modal-onbutton");
modalOnButton.addEventListener("click", displayModal);

appStart();
