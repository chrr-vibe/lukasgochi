# LUCASGOTCHI

- `index.html`: 게임 전체 (코드·스타일·화면). 수정은 대부분 여기서.
- `sprites.js`: base64 스프라이트 데이터(`const SPR = {...}`, `SPR.xxx = "data:image/png;base64,..."`). 약 1.6MB — **새 그림을 넣거나 바꿀 때만 열 것.** 평소엔 읽지 말고 `grep -o '^SPR\.[A-Za-z.]*' sprites.js` 정도로 키 이름만 확인.
  - index.html이 `<script src="sprites.js">`로 먼저 불러오고, 본 스크립트에서 `load(key, SPR.key)`로 이미지를 등록함.
- `sw.js`: 오프라인 캐시. 배포할 때마다 `VERSION`을 올릴 것. 새 정적 파일이 생기면 `CORE` 목록에 추가.
- `firestore.rules`: 친구 편지 기능용 Firestore 보안 규칙 (Firebase 콘솔에 붙여넣기).
- 업데이트 알림: `index.html`의 `UPDATE_LOG` 맨 위에 `{id, t:'YY.MM.DD HH:MM', text}` 추가 (사용자가 "*알림주기"라고 할 때).
