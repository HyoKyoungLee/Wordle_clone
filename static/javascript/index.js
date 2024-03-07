let index = 0;
let attemps = 0;
let timer = 0;

function appStart() {
  const displayGameover = () => {
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

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;
    //응답을 기다려서 answer에 넣는것
    const 응답 = await fetch("/answer");
    const 정답_객체 = await 응답.json();
    const 정답 = 정답_객체.answer;

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attemps}${i}']`
      );
      const letter = block.innerText;
      const 정답_글자 = 정답[i];
      if (letter === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(letter)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";
      block.style.color = "white";
    }
    if (맞은_갯수 === 5) gameover();
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
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      //팀장님 과제로 추가
      // const 연도 = 현재_시간.getFullYear().toString();
      // const 달 = (현재_시간.getMonth() + 1).toString().padStart(2, "0");
      // const 날짜 = 현재_시간.getDate().toString().padStart(2, "0");
      //팀장님 과제로 추가
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeH1 = document.querySelector("#timer");
      timeH1.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };
  startTimer();

  window.addEventListener("keydown", handleKeydown);
}

appStart();
