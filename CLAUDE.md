# LUCASGOTCHI 작업 규칙
- 다마고치 웹앱(PWA). GitHub Pages로 배포. 응답은 한국어로.
- sprites.js는 base64 그림 데이터라 매우 큼. 그림을 추가/수정하는 작업이 아니면 절대 열거나 읽지 말 것.
- index.html이나 다른 파일을 수정하면 sw.js의 VERSION을 항상 하나 올릴 것.
- 오프라인에서도 동작해야 함. 인터넷/서버(Firebase)가 실패해도 게임이 멈추면 안 됨.
- 기존 저장 데이터(localStorage)는 절대 지우거나 초기화하지 말 것. 새 항목은 없을 때 기본값으로 처리.
- 요청받은 부분만 수정하고, 관련 없는 코드는 건드리지 말 것.
- 작업 다하고 나면 늘 branch에 push하고 pr 생성해 main에 merge해서 반영되게 알아서 하기.

## 파일 구조
- `index.html`: 게임 전체 (코드·스타일·화면). 수정은 대부분 여기서.
- `sprites.js`: base64 스프라이트 데이터(`const SPR = {...}`, `SPR.xxx = "data:image/png;base64,..."`). 약 1.6MB — **새 그림을 넣거나 바꿀 때만 열 것.** 평소엔 읽지 말고 `grep -o '^SPR\.[A-Za-z.]*' sprites.js` 정도로 키 이름만 확인.
  - index.html이 `<script src="sprites.js">`로 먼저 불러오고, 본 스크립트에서 `load(key, SPR.key)`로 이미지를 등록함.
- `backgrounds.js`: 배경 그리기 코드 (방 그림 `makeRoom`/`recolorRoom`, 페이지 배경 프리셋 `PAGE_BG`). index.html이 본 스크립트 중간에 `<script src="backgrounds.js">`로 같은 순서로 불러옴. **배경 그림을 추가/수정하는 작업이 아니면 열지 말 것.**
- `minigames.js`: 미니게임 코드 (`MG` 형의 방 탈출 리듬, `MG3` 플레로마 잡기, `MG4` 기억 결투, `MG2` 이심전심, `MG5` 야바위 — 전역 const). index.html이 본 스크립트를 "미니게임" 구간에서 끊고 `<script src="minigames.js">`로 같은 순서로 불러옴. 결과/보상/대사 로직(`lgameEnd`, `plEnd`, `duelEnd`, `shellEnd`, `escapeStart` 등)은 index.html에 남아 있음. **미니게임 자체를 수정하는 작업이 아니면 열지 말 것.**
- `sw.js`: 오프라인 캐시. 배포할 때마다 `VERSION`을 올릴 것. 새 정적 파일이 생기면 `CORE` 목록에 추가.
- `firestore.rules`: 친구 편지 기능용 Firestore 보안 규칙 (Firebase 콘솔에 붙여넣기).
- 업데이트 알림: `index.html`의 `UPDATE_LOG` 맨 위에 `{id, t:'YY.MM.DD HH:MM', text}` 추가 (사용자가 "*알림주기"라고 할 때).
