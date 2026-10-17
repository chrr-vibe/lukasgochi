# LUCASGOTCHI

루카스 다마고치 웹앱 (PWA)

## 파일 구성
- `index.html` – 게임 본체 (이미지 전부 포함)
- `manifest.webmanifest` – 앱 이름, 아이콘, 홈 화면 설정
- `sw.js` – 오프라인 실행용 서비스워커
- `icons/` – 앱 아이콘 (5번 테마 도트 버전)

## GitHub Pages로 올리기
1. GitHub에서 새 저장소(repository)를 만든다.
2. 이 zip을 풀고, 안의 파일과 `icons` 폴더를 그대로 저장소에 업로드한다. (`index.html`이 저장소 맨 위에 있어야 함)
3. 저장소 **Settings → Pages** 에서 Branch를 `main` / `/ (root)` 로 고르고 Save.
4. 1~2분 뒤 `https://아이디.github.io/저장소이름/` 으로 접속.
5. 휴대폰 Chrome 메뉴 → **홈 화면에 추가 / 앱 설치** 를 누르면 앱처럼 설치된다.

## 업데이트할 때
`index.html`을 바꿔서 올린 뒤, `sw.js` 맨 위의 `VERSION` 을 `v2`, `v3` … 처럼 하나씩 올려주면 설치된 앱에도 새 버전이 반영된다.

## 저장 데이터
진행 상황(소지액, 옷, 테마, 배경, 타이머)은 접속한 브라우저 안에 저장된다.
주소가 바뀌면(예: 파일로 열던 것 → GitHub 주소) 저장 데이터는 새로 시작한다.
