# Wordle Clone

## ✨ 프로젝트 소개

- 바닐라 자바스크립트로 만든 **[Wordle Game](https://www.nytimes.com/games/wordle/index.html) 클론 코딩 프로젝트**입니다.
- Wordle 게임은 5글자의 단어를 유추하고 6번의 기회를 살려 정답을 맞혀야 하는 **단어 맞추기 게임**입니다.

- **`배포 주소`** : https://hyokyounglee.github.io/Wordle_clone/

## 🔨 기술스택

- **FrontEnd** : HTML, CSS, JavaScript
- **BackEnd** : [Words API](https://www.wordsapi.com/) 사용
  - 랜덤의 5글자 단어를 가져옴
  - 사용자가 입력한 5글자가 존재하는 단어인지 확인

## ⚙️ 기능

- 게임을 진행하는 동안 `타이머`로 시간을 잽니다.
- `게임 방법 모달창`을 제공합니다. 게임 방법을 볼 때는 타이머를 멈춥니다.
- 단어가 아닌 5글자를 입력하거나 5글자 미만으로 입력하지 않으면 `토스트 메시지`를 보여줍니다.
- 정답 단어를 추출 및 단어를 확인할 때 `로딩 화면`을 제공합니다.
- 게임이 종료되면 `모달창`으로 종료를 알리고 버튼을 통해 게임을 재시작할 수 있습니다.
