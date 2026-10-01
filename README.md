# BetterBatter Landing

### 🔗 https://seonmin-s2.github.io/betterbatter_landing/

실시간 야구 경기 데이터 기반 예측 마켓 **BetterBatter** (SSAFY 15기 특화 프로젝트 B203) 의 소개 사이트 저장소입니다.

운영 서버 종료(2026-10-02) 이후에도 서비스를 설명할 수 있도록, 실제 앱 화면 · 녹화 영상 ·
수집한 경기 데이터 · 코드에서 확인한 수치를 정적으로 담아 둔 사이트입니다.

빌드 도구가 없습니다. 순수 HTML + CSS + ES Module 로만 되어 있어서
**저장소 루트를 그대로 정적 호스팅에 올리면 바로 동작합니다.** (루트의 `index.html` 이 첫 화면)

사이트는 **여섯 페이지(홈 · 제품 · 검증 · 기술 · 원칙 · 팀)를 기준으로** 나뉘어 있습니다.
어떤 페이지를 고치려면 그 이름의 HTML 과 `css/pages/<페이지>` · `js/pages/<페이지>` 만 보면 됩니다.

```
betterbatter_landing/
├── README.md         ← 지금 이 문서 (배포 · 영상 목록 · 출처)
├── index.html        홈
├── product.html      제품
├── proof.html        검증
├── tech.html         기술
├── principles.html   원칙
├── team.html         팀
│
├── assets/           브랜드 · 공유 카드 · 앱 화면 캡처 · 녹화 영상 · 티어/업적 이미지
├── css/
│   ├── base/         여섯 페이지가 함께 쓰는 토큰 · 레이아웃 · 부품
│   └── pages/        home · product · proof · tech · principles · team
├── js/
│   ├── main.js       진입점 — data-page 를 보고 그 페이지 모듈만 켠다
│   ├── shared/       상단바 · 푸터 · 등장 연출 · 헬퍼
│   ├── data/         여러 페이지가 함께 쓰는 내용 (목차 · 질문 38종 · 아이콘)
│   └── pages/        페이지별 동작 `*.js` + 그 페이지의 글과 수치 `*.data.js`
├── .nojekyll
│
└── docs/             ← 설명 문서만 둡니다 (사이트에 쓰이지 않음)
    └── README.md     폴더 구조 · 파일별 내용 · 설계 규칙 · 수정 가이드 (여기부터 읽으세요)
```

> README 가 두 개인 이유 — 루트 `README.md` 는 저장소 첫 화면에 보이는 **소개 · 배포 · 영상 목록**,
> `docs/README.md` 는 사이트를 고칠 사람을 위한 **구조 · 수정 가이드**입니다.

---

## 배포 — GitHub Pages

1. 저장소를 GitHub 에 푸시합니다. (저장소는 **Public** 이어야 합니다 —
   무료 계정은 Private 저장소에서 Pages 를 쓸 수 없습니다)

   ```bash
   git push -u origin main
   ```

2. GitHub 저장소에서 **Settings → Pages** 로 이동합니다.
3. **Source: Deploy from a branch** / **Branch: `main`** / **Folder: `/ (root)`** 를 선택하고 저장합니다.

1~2분 뒤 `https://seonmin-s2.github.io/betterbatter_landing/` 에서 열립니다.
이후 `main` 에 푸시하면 자동으로 다시 배포됩니다.

> 모든 경로가 상대 경로라 하위 경로(`/betterbatter_landing/`)에 배포해도 그대로 동작합니다.
> `.nojekyll` 은 Jekyll 전처리를 건너뛰게 하는 빈 표식 파일입니다. 지우지 마세요.
> 루트의 모든 파일이 사이트 주소로 공개되므로, 공개하면 안 되는 메모 · 파일은 저장소에 두지 마세요.

### 공유 카드

카카오톡 · 슬랙에 링크를 붙이면 `assets/og-image.png` (1200×630) 가 미리보기로 뜹니다.
`og:url` · `og:image` 는 위 GitHub Pages 기본 주소로 채워 두었습니다.
**주소가 바뀌면 6개 HTML** 의 `og:url` · `og:image` · `twitter:image` 를 함께 고쳐 주세요.

---

## 로컬에서 보기

`index.html` 을 더블클릭해서 열면 안 됩니다. `file://` 에서는 브라우저가 ES Module 을
CORS 정책으로 막아 상단바조차 그려지지 않습니다. 간이 서버로 여세요.

```bash
cd betterbatter_landing

python -m http.server 5500     # Python
npx serve .                    # Node
```

→ http://localhost:5500

VS Code 를 쓴다면 Live Server 확장을 설치하고 `index.html` 우클릭 → *Open with Live Server*.

---

## 무엇을 어디서 고치나

| 하고 싶은 일 | 고칠 파일 |
| --- | --- |
| 기획 배경 (홈) | 제목 · 도입문은 `index.html` 의 `#why`, 기준 카드 3장은 `js/pages/home/home.data.js` 의 `WHY` |
| 팀원 역할 · 소개 · 사진 | `js/pages/team/team.data.js` (사진은 `assets/team/` 에 두고 `avatar` 경로 입력) |
| 서비스 · 저장소 · 발표자료 링크 | `js/data/site.js` 의 `LINKS` (빈 값이면 버튼이 숨겨짐) |
| 상단바 목차 · 페이지 구성 | `js/data/site.js` 의 `NAV` (한 곳만 고치면 전 페이지 반영) |
| 질문 38종 · 판정 기준 | `js/data/questions.js` |
| 배당 · 경험치 · 티어 수치 | `js/pages/product/product.data.js` |
| 검증 수치 · 표 | `js/pages/proof/proof.data.js` |
| 아키텍처 · 파이프라인 · 체인 · 기술 스택 | `js/pages/tech/tech.data.js` |
| 포인트 원칙 · 법적 검토 · 개인정보 | `js/pages/principles/principles.data.js` |
| 브랜드 색 | `css/base/00-tokens.css` 의 `[1] 원색` 블록 |
| 섹션 제목 · 순서 | 해당 `*.html` |
| 영상 교체 | `assets/videos/<이름>-d.mp4` · `-m.mp4` 덮어쓰기 (포스터는 같은 이름의 `.webp`) |

자세한 폴더 구조와 설계 규칙은 **[`docs/README.md`](docs/README.md)** 에 있습니다.

---

## 기능별 영상

실제 앱 화면을 녹화한 영상입니다. 홈 페이지의 "실제 화면" 섹션에서 탭으로 바꿔 볼 수 있고,
화면 폭이 640px 이하이면 세로(모바일) 녹화본이 재생됩니다. 소리는 없습니다.

| 기능 | 내용 | 데스크톱 (1440×900) | 모바일 (780×1688) |
| --- | --- | --- | --- |
| 라이브 참여 | 공수 교대부터 마감까지, 한 번의 참여 | [영상 보기](assets/videos/live-flow-d.mp4) · 23초 | [영상 보기](assets/videos/live-flow-m.mp4) · 23초 |
| 커뮤니티 | 경기 이야기를 나누는 커뮤니티 | [영상 보기](assets/videos/community-d.mp4) · 13초 | [영상 보기](assets/videos/community-m.mp4) · 12초 |
| 시즌 랭킹 | 경험치가 쌓이는 시즌 랭킹 | [영상 보기](assets/videos/rankings-d.mp4) · 9초 | [영상 보기](assets/videos/rankings-m.mp4) · 9초 |
| 마이페이지 | 활동 기록과 업적 | [영상 보기](assets/videos/mypage-d.mp4) · 16초 | [영상 보기](assets/videos/mypage-m.mp4) · 14초 |

---

## 화면 · 영상 · 수치는 어디서 왔나

- **앱 화면과 영상** — 팀 저장소의 앱(`ui/`)을 로컬에서 띄우고, 2026-09-30 운영 서버에서 수집한
  API 응답을 그대로 주입해 Playwright 로 캡처 · 녹화했습니다.
  - 경기 · 질문 · 기준 확률 · 판정 기준은 **실제 값**입니다. (컵스 대 파드리스 등 4경기, 질문 61개)
  - 참여 인원 · 포인트 분포 · 예시 계정의 경험치와 등급은 **예시 값**입니다.
    이 날 실제 질문에는 참여자가 없었습니다.
  - 닉네임은 `팬01` … 처럼 익명화했습니다.
- **수치와 규칙** — 팀 저장소의 서버 코드와 설계 문서에서 옮겼습니다.
  문서와 코드가 다르면 코드를 따랐습니다. 각 `*.data.js` 파일 머리에 출처 파일을 적어 두었습니다.
- **블록체인** — 연동 코드와 컨트랙트는 구현했고 테스트넷(Polygon Amoy)에 배포했지만,
  운영 서버에서는 기록을 꺼 두었습니다(`CHAIN_ENABLED=false`). 사이트에도 그렇게 적었습니다.

---

## 출처

- 아이콘 [lucide](https://lucide.dev) (ISC License) © Lucide Contributors
- 서체 [Noto Sans KR](https://fonts.google.com/noto/specimen/Noto+Sans+KR) ·
  [Archivo](https://fonts.google.com/specimen/Archivo) ·
  [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) ·
  [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (모두 OFL, Google Fonts)
- 색 · 서체 · 워드마크 · 티어/업적 이미지는 BetterBatter 앱(`ui/src/styles.css` · `ui/public/`)과 맞췄습니다.
- MLB 와 각 구단의 명칭 · 경기 데이터에 대한 권리는 각 권리자에게 있으며,
  이 프로젝트는 MLB 및 구단과 제휴 관계가 없는 교육용 프로젝트입니다.

© 2026 BetterBatter · SSAFY 15기 특화 프로젝트 B203
