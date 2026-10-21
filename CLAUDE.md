# LUCASGOTCHI 작업 규칙
- 다마고치 웹앱(PWA). GitHub Pages로 배포. 응답은 한국어로.
- sprites.js는 base64 그림 데이터라 매우 큼. 그림을 추가/수정하는 작업이 아니면 절대 열거나 읽지 말 것.
- index.html이나 다른 파일을 수정하면 sw.js의 VERSION을 항상 하나 올릴 것.
- 오프라인에서도 동작해야 함. 인터넷/서버(Firebase)가 실패해도 게임이 멈추면 안 됨.
- 기존 저장 데이터(localStorage)는 절대 지우거나 초기화하지 말 것. 새 항목은 없을 때 기본값으로 처리.
- 요청받은 부분만 수정하고, 관련 없는 코드는 건드리지 말 것.
- 작업 다하고 나면 늘 branch에 push하고 pr 생성해 main에 merge해서 반영되게 알아서 하기.

## 작업별로 열 파일
- 일반 기능·UI 수정: index.html만
- 대사 추가/수정: index.html (아래 "대사 추가/수정 규칙" 따라 해당 const만 읽고 수정)
- 기존 그림을 같은 키로 교체: sprites.js만 (grep으로 해당 키 줄만 확인, 전체 읽기 금지)
- 새 그림 추가 / 그림 크기 변경: sprites.js + index.html
- 배경 수정: backgrounds.js + index.html
- 미니게임 수정: minigames.js + index.html
- 배포 시: sw.js (VERSION 올리기, 새 파일은 CORE에 추가)
- 위에 해당하지 않는 파일은 열지 말 것.

## 대사 추가/수정 규칙
- 대사 작업은 index.html 전체를 읽지 말고, 사용자가 말한 상수 이름(예: ELI_BUDDY, LEO, MEC_LINES)을 `grep -n '^const 상수명' index.html`로 찾아 그 선언문만 읽고 수정할 것.
- 선언이 여러 줄이면 grep으로 찾은 줄 번호부터 선언이 끝나는 `];`까지만 범위를 지정해서 읽을 것(파일 전체 읽기 금지).
- 기존 항목과 같은 형식(배열 구조·따옴표 스타일·화자 이름 표기)으로 추가할 것.
- 배열 구조가 바뀌거나 대사를 보여주는 로직 수정이 필요해 보이면 임의로 고치지 말고 먼저 사용자에게 알릴 것.
- 상수 이름을 말해주지 않았으면, 대사 내용으로 grep해서 위치를 찾고 어느 상수에 넣을지 한 줄로 확인할 것.
- 함수 안에 직접 박힌 대사(상수가 아닌 것)는 사용자가 알려준 문장 내용으로 grep해서 그 줄 근처만 읽고 수정할 것.
  
## 파일 구조
- `index.html`: 게임 전체 (코드·스타일·화면). 수정은 대부분 여기서.
- `sprites.js`: base64 스프라이트 데이터(`const SPR = {...}`, `SPR.xxx = "data:image/png;base64,..."`). 약 1.6MB — **새 그림을 넣거나 바꿀 때만 열 것.** 평소엔 읽지 말고 `grep -o '^SPR\.[A-Za-z.]*' sprites.js` 정도로 키 이름만 확인.
  - index.html이 `<script src="sprites.js">`로 먼저 불러오고, 본 스크립트에서 `load(key, SPR.key)`로 이미지를 등록함.
- `backgrounds.js`: 배경 그리기 코드 (방 그림 `makeRoom`/`recolorRoom`, 페이지 배경 프리셋 `PAGE_BG`). index.html이 본 스크립트 중간에 `<script src="backgrounds.js">`로 같은 순서로 불러옴. **배경 그림을 추가/수정하는 작업이 아니면 열지 말 것.**
- `minigames.js`: 미니게임 코드 (`MG` 형의 방 탈출 리듬, `MG3` 플레로마 잡기, `MG4` 기억 결투, `MG2` 이심전심, `MG5` 야바위 — 전역 const). index.html이 본 스크립트를 "미니게임" 구간에서 끊고 `<script src="minigames.js">`로 같은 순서로 불러옴. 결과/보상/대사 로직(`lgameEnd`, `plEnd`, `duelEnd`, `shellEnd`, `escapeStart` 등)은 index.html에 남아 있음. **미니게임 자체를 수정하는 작업이 아니면 열지 말 것.**
- `sw.js`: 오프라인 캐시. 배포할 때마다 `VERSION`을 올릴 것. 새 정적 파일이 생기면 `CORE` 목록에 추가.
- `firestore.rules`: 친구 편지 기능용 Firestore 보안 규칙 (Firebase 콘솔에 붙여넣기).
- 업데이트 알림: `index.html`의 `UPDATE_LOG` 맨 위에 `{id, t:'YY.MM.DD HH:MM', text}` 추가 (사용자가 "*알림주기"라고 할 때).
