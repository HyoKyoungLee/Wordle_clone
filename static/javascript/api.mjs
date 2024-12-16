import { GlobalState } from "./globals.mjs";

const API_URL = "https://wordsapiv1.p.rapidapi.com/words/";
const API_OPTION = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
    "x-rapidapi-key": "c0f74f441cmsh567cad65aabece8p1aad19jsn4142e09a557d",
  },
};

// 로딩을 띄우는 함수
const toggleLoading = async (isLoading) => {
  const loadingScreen = document.querySelector("#loading-screen");
  GlobalState.isLoading = isLoading;
  loadingScreen.style.visibility = isLoading ? "visible" : "hidden";
};
// api 요청 처리를 일관되게 처리할 수 있도록 분리한 함수
export const fetchWithLoading = async (url, options) => {
  toggleLoading(true);
  const response = await fetch(url, options);
  toggleLoading(false);
  return await response.json();
};

// 단어가 맞는지 확인하는 메서드
const isValidWord = async (letter) => {
  const apiParams = `?letterPattern=%5E${letter.toLowerCase()}%24`;

  const response = await fetchWithLoading(`${API_URL}${apiParams}`, API_OPTION);

  return response.results.total;
};

// 정답 불러오기
const getAnswer = async () => {
  const apiParams =
    "?random=true&letterPattern=%5E.{5}%24&lettersMin=5&lettersMax=5&partOfSpeech=verb";

  const response = await fetchWithLoading(`${API_URL}${apiParams}`, API_OPTION);

  let responseWord = response.word;

  return responseWord.toUpperCase();
};

export { isValidWord, getAnswer };
