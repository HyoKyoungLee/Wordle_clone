import { GlobalState } from "./globals.mjs";

// 잘못된 입력값을 넣었을 때 애니메이션
export const shakeInvalidInput = () => {
  const targetBlockRow = document.querySelector(
    `.board-row[data-index='${GlobalState.attemps}']`
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
