let index = 0;
let attemps = 0;
let timer = 0;

function appStart() {
  const displayGameover = (animateBlock) => {
    animateBlock.animate(
      [
        {
          transform: "scale(1.5)",
        },
      ],
      300
    );
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center;position:absoulte; top:40vh; left:45vw;";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    attemps += 1;
    index = 0;
  };

  const gameover = (animateBlock) => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover(animateBlock);
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let correctAnswersCount = 0;
    const response = await fetch("/answer");
    const responseJson = await response.json();
    const answer = responseJson.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attemps}${i}']`
      );
      const letter = block.innerText;
      const answerLetter = answer[i];
      if (letter === answerLetter) {
        correctAnswersCount += 1;
        block.style.background = "#6AAA64";
      } else if (answer.includes(letter)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";
      block.style.color = "white";
    }
    if (correctAnswersCount === 5) {
      const animateBlocks = document.querySelector(
        `.board-row[data-index='${attemps}']`
      );
      gameover(animateBlocks);
    }
    nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attemps}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleTextinput = (keyCode) => {
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attemps}${index}']`
    );

    if (keyCode === 8) handleBackspace();
    else if (index === 5) {
      if (keyCode === 13) handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = String.fromCharCode(keyCode);
      index += 1;
    }
  };

  const handleKeydown = (event) => {
    const keyCode = event.keyCode;
    console.log();

    const thisKeyblock = document.querySelector(
      `.key-block[data-index='${keyCode}']`
    );

    // 키보드 입력할 때 키보드 애니메이션 실행
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

  keyBlocks.onclick = function (event) {
    const keyBlock = event.target.dataset.index;
    handleTextinput(Number(keyBlock));
  };

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
}

appStart();
