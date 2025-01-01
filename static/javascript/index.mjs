import { getAnswer } from "./api.mjs";
import { GlobalState } from "./globals.mjs";

// 익명함수로 정답 불러오기 실행
(async () => {
  GlobalState.answer = await getAnswer();
})();
