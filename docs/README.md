# BetterBatter 랜딩 페이지

실시간 야구 경기 데이터 기반 예측 마켓 **BetterBatter** 의 소개 사이트입니다.

**빌드 도구가 전혀 없습니다.** 순수 HTML + CSS + ES Module 로만 만들어져 있어서,
저장소 루트를 정적 호스팅에 그대로 올리면 바로 동작합니다. (npm install 없음, 번들러 없음)
사이트 파일은 모두 **저장소 루트**에 있고, 이 `docs/` 폴더에는 설명 문서만 둡니다.

> 이 문서는 **폴더 구조와 수정 방법**을 다룹니다.
> 배포 방법과 기능별 영상 목록은 저장소 루트의 [`../README.md`](../README.md) 를 보세요.
>
> 앱 화면 · 영상 · 브랜드 이미지는 팀 저장소(S15P21B203)의 앱을 띄워 캡처하거나 **복사**해 온 것이며,
> 팀 저장소의 원본(`api/`, `ui/`, `contracts/` …)은 건드리지 않았습니다.

---

## 1. 로컬에서 보기

`index.html` 을 **더블클릭해서 열면 안 됩니다.** `file://` 에서는 브라우저가 ES Module 을
CORS 정책으로 막기 때문에 상단바조차 그려지지 않습니다. (1.8초 뒤 안전장치가 본문만 보이게 합니다)

아무 간이 서버나 하나 띄우면 됩니다.

```bash
cd betterbatter_landing     # 저장소 루트

python -m http.server 5500     # Python
npx serve .                    # Node
```

→ http://localhost:5500

---

## 2. 여섯 페이지가 기준입니다

한 페이지에 전부 담지 않고 **여섯 주제로 나눴습니다.** 페이지마다 주소가 따로 있으니
"질문 선정 방식만 보세요" 하고 `proof.html#selection` 링크를 줄 수 있습니다.

**폴더도 이 여섯 개를 기준으로 나뉘어 있습니다.** 어떤 페이지를 고치려면
그 이름의 폴더 세 곳(`css/pages/<페이지>`, `js/pages/<페이지>`, 그리고 `<페이지>.html`)만 보면 됩니다.

| 페이지 | HTML | `data-page` | 스타일 | 동작 · 내용 |
| --- | --- | --- | --- | --- |
| 홈 | `index.html` | `home` | `css/pages/home/` | `js/pages/home/` |
| 제품 | `product.html` | `product` | `css/pages/product/` | `js/pages/product/` |
| 검증 | `proof.html` | `proof` | `css/pages/proof/` | `js/pages/proof/` |
| 기술 | `tech.html` | `tech` | `css/pages/tech/` | `js/pages/tech/` |
| 원칙 | `principles.html` | `principles` | `css/pages/principles/` | `js/pages/principles/` |
| 팀 | `team.html` | `team` | `css/pages/team/` | `js/pages/team/` |

각 페이지가 담는 내용은 이렇습니다.

| 페이지 | 담는 내용 |
| --- | --- |
| 홈 | 히어로(라이브 마켓 무대) · 요약 수치 · 기획 배경(자리표시) · 기능 요약 3장 · 실제 화면 영상 4편 |
| 제품 | 사용 흐름 5장면 · 질문 38종 · 파리뮤추얼 정산 · 시즌 · 티어 · 업적 · 직접 해보기 |
| 검증 | 질문 선정 점수(계산기 · 실제 출제 분포) · 결과 판정(교차검증 · 원문 대조) · 마감 처리 · 운영 검증 |
| 기술 | 시스템 아키텍처 · 배포 · 데이터 파이프라인 · 블록체인 설계(운영 비활성) · 기술 스택 |
| 원칙 | 무료 가상 포인트 · 법적 검토 · 개인정보 보호 |
| 팀 | 팀원 6명 (역할 · 소개 · 사진은 자리표시) |

`<body data-page="...">` 값이 **어떤 JS 모듈을 켤지** 정합니다 (`js/main.js` 의 `PAGE_MODULES`).
그래서 페이지를 늘리거나 섹션을 옮길 때 HTML 의 `<script>` 를 건드릴 필요가 없습니다.

### 상단바와 푸터는 HTML 에 없습니다

HTML 에는 빈 껍데기만 두고,

```html
<header class="site-nav"></header>
<footer class="site-footer"></footer>
```

`js/shared/chrome.js` 가 `js/data/site.js` 의 `NAV` 하나로 상단바 · 메가패널 · 모바일 시트 ·
푸터를 모두 만듭니다. **목차를 고칠 곳은 `js/data/site.js` 한 곳뿐입니다.**

---

## 3. 폴더 구조

규칙은 하나입니다. **여러 페이지가 함께 쓰면 `base` · `shared` · `data`,
한 페이지만 쓰면 `pages/<페이지>`.**

```
betterbatter_landing/          저장소 루트 = 사이트 루트
├── index.html                 홈
├── product.html               제품
├── proof.html                 검증
├── tech.html                  기술
├── principles.html            원칙
├── team.html                  팀
├── .nojekyll                  GitHub Pages 용 표식 (Jekyll 전처리 건너뜀)
├── README.md                  소개 · 배포 · 영상 목록
├── docs/
│   └── README.md              이 문서 (구조 · 수정 가이드) — 사이트에 쓰이지 않음
│
├── assets/
│   ├── og-image.png           카카오톡 · 슬랙 공유 카드 (1200×630)
│   ├── brand/                 워드마크 · 아이콘 · 파비콘 (앱 ui/public/brand 에서 복사)
│   ├── app/
│   │   ├── tiers/             티어 배지 7종 (앱 ui/public/tier-badges)
│   │   └── achievements/      업적 그림 8종 (앱 ui/public/achievements)
│   ├── screens/               앱 화면 캡처 10장 × 데스크톱(-d) · 모바일(-m) + 기능 요약 3장
│   └── videos/                녹화 영상 4편 × 데스크톱 · 모바일 (.mp4) + 포스터 (.webp)
│
├── css/
│   ├── base/                  ★ 여섯 페이지가 모두 불러옵니다
│   │   ├── 00-tokens.css      ★ 색 · 서체 · 간격 · 모션 · 레이아웃 토큰의 단일 출처
│   │   ├── 01-base.css        리셋 · 기본 타이포 · 눈썹 제목 · 숫자 · 형광펜
│   │   ├── 02-layout.css      셸 · 상단바 · 메가패널 · 모바일 시트 · 페이지 머리글 · 푸터 · 다음 페이지
│   │   ├── 03-motion.css      스크롤 등장 연출
│   │   ├── 04-components.css  ★ 버튼 · 칩 · 표면 · 패널 · 표 · 메모 카드 · 맨 위로 · 자리표시
│   │   └── 05-closing.css     마무리 블록
│   │
│   └── pages/
│       ├── home/              hero.css (라이브 마켓 무대) · glance.css (기능 요약) · film.css (영상)
│       ├── product/           flow.css (사용 흐름) · questions.css (질문 38종) · payout.css (정산 · 시즌 · 체험)
│       ├── proof/             selection.css (선정 · 계산기 · 분포) · oracle.css (판정 · 마감) · ops.css (운영)
│       ├── tech/              tech.css (아키텍처 · 배포 · 파이프라인 · 체인 · 스택)
│       ├── principles/        principles.css (포인트 흐름 · 규칙 · 법령 · 개인정보)
│       └── team/              team.css (팀원 카드)
│
└── js/
    ├── main.js                진입점 — data-page 를 보고 그 페이지 모듈만 켠다
    │
    ├── shared/
    │   ├── chrome.js          ★ 상단바 · 메가패널 · 모바일 시트 · 푸터 · 스크롤 진행바 · 맨 위로
    │   ├── reveal.js          스크롤 등장 연출 · 커서 글로우
    │   └── utils.js           DOM 헬퍼 · 카운트업 · 등장 관찰
    │
    ├── data/                  ★ 여러 페이지가 함께 쓰는 내용
    │   ├── site.js            ★ 목차(NAV) · 외부 링크(LINKS)
    │   ├── questions.js       ★ 질문 38종 · 5계열 · 평균 확률 · 흥미도 · 판정 기준 (제품 · 검증 공용)
    │   └── icons.js           lucide 아이콘 path 모음 + icon() 함수
    │
    └── pages/
        ├── home/
        │   ├── heroMarket.js      히어로 마켓 무대 (질문 5개를 5단계로 재생)
        │   ├── heroFacts.js       요약 수치 카운트업
        │   ├── film.js            영상 탭 · 플레이어
        │   └── home.data.js       ★ 요약 수치 · 히어로 질문 · 영상 목록
        ├── product/
        │   ├── flow.js            사용 흐름 탭
        │   ├── questionGrid.js    질문 카드 · 계열 필터 · 9/30 출제 스위치
        │   ├── payout.js          포인트 규칙 · 배당 계산 예시 · 경험치 규칙
        │   ├── payoutMath.js      ★ 배당 공식 (서버 Payout.java 와 같은 식)
        │   ├── season.js          티어 사다리 · 업적
        │   ├── tryVote.js         직접 해보기 카드
        │   └── product.data.js    ★ 사용 흐름 · 포인트 · 배당 · 경험치 · 티어 · 업적 · 체험 질문
        ├── proof/
        │   ├── selection.js       점수 요소 · 제외 규칙 · 폴백 · 튜닝 표 · 실제 출제 분포
        │   ├── scoreCalc.js       ★ 선정 점수 계산기 (서버 QuestionSelector 와 같은 식)
        │   ├── oracle.js          교차검증 · 근거 · 원문 대조 결과
        │   ├── deadline.js        무효 사유 · 피드 상태 표
        │   ├── ops.js             테스트 수 · CI · 부하 검증 표
        │   └── proof.data.js      ★ 검증 페이지의 수치와 목록 (출처 파일 명시)
        ├── tech/
        │   ├── architecture.js · pipeline.js · chain.js · stacks.js
        │   └── tech.data.js       ★ 패키지 · 파이프라인 · GUMBO 함정 · 컨트랙트 · 스택
        ├── principles/
        │   ├── principles.js
        │   └── principles.data.js ★ 포인트 규칙 · 법령별 대응 · 개인정보 원칙
        └── team/
            ├── members.js
            └── team.data.js       ★ 팀원 6명
```

**`.data.js` 로 끝나는 파일이 그 페이지의 글과 수치입니다.** 나머지는 동작입니다.
문구를 고칠 때는 `.data.js` 와 `js/data/` 만 열면 됩니다. 각 `.data.js` 머리에는
그 값을 가져온 팀 저장소의 파일을 적어 두었습니다.

### 설계 규칙 다섯 가지

1. **HTML 은 뼈대만.** 반복되는 내용(질문 38종, 규칙 카드, 표의 행, 팀원 6명 …)은
   `*.data.js` 에 두고 JS 가 렌더합니다. 섹션 제목과 긴 설명 문단만 HTML 에 있습니다.
2. **색은 토큰을 경유한다.** 색은 `var(--color-*)` · `var(--market-*)` · `var(--vote-*)` 로 씁니다.
   `css/base/00-tokens.css` 의 `[1] 원색` 블록이 원본이며, 앱(`ui/src/styles.css`)의 값과 같습니다.
   (배경 분위기 레이어의 반투명 그라데이션 몇 줄만 `02-layout.css` 에 값이 직접 있습니다)
3. **연출은 `[data-reveal]` 하나로 통일.** `js/shared/reveal.js` 가 관찰해서 `.is-in` 을 붙입니다.
   JS 로 나중에 만든 요소는 `window.__bbObserveReveal(부모)` 로 등록합니다.
4. **폰 목업을 쓰지 않는다.** 앱 화면은 폰 껍데기 없이 윤곽선 하나로만 감쌉니다.
   넓은 화면은 데스크톱 캡처, 좁은 화면은 모바일 캡처를 `<picture>` 로 바꿔 씁니다.
5. **두 페이지 이상이 쓰면 공용으로 올린다.** 검증 · 기술 페이지가 함께 쓰는 패널 · 표 ·
   메모 카드는 그래서 `css/base/04-components.css` 에 있습니다.

---

## 4. 자주 하는 수정

### 🙂 팀원 역할 · 소개 · 사진

`js/pages/team/team.data.js` 하나만 고칩니다.

```js
{ name: "이름", role: "역할", intro: "한 줄 소개", avatar: "assets/team/파일명.webp" },
```

`role` · `intro` 에 "OO 작성" 이 남아 있으면 점선 자리표시로 보입니다.
`avatar` 를 비워 두면 이름 첫 글자 원이 나옵니다.

### ✍️ 기획 배경

`index.html` 의 `<section id="why">` 안 자리표시 문구를 바꿉니다.

### 🔗 서비스 · 저장소 · 발표자료 링크

`js/data/site.js` 의 `LINKS` 를 채웁니다. 빈 문자열(`""`)이면 해당 버튼은 **자동으로 숨겨집니다.**
운영 서버가 종료되어 `service` 는 비워 두었습니다.

### 🧭 목차 · 페이지 구성

`js/data/site.js` 의 `NAV` 하나만 고칩니다. 상단바 · 메가패널 · 모바일 시트 · 푸터가 함께 바뀝니다.
`hash` 는 그 페이지 `<section>` 의 `id` 와 같아야 합니다.

### 🎬 영상 · 화면 교체

- 영상: `assets/videos/<id>-d.mp4`(1440×900) · `<id>-m.mp4`(세로) 와 같은 이름의 `.webp` 포스터를 덮어씁니다.
  목록은 `js/pages/home/home.data.js` 의 `FILMS`.
- 화면: `assets/screens/<번호>-<이름>-d.webp` · `-m.webp` 를 덮어씁니다.

영상은 `preload="none"` 이라 **재생을 누르기 전까지 내려받지 않습니다.**

### 🎨 스타일 · 모듈 파일 추가할 때

- **그 페이지에서만 쓰는 스타일**이면 `css/pages/<페이지>/` 에 만들고, 그 페이지 HTML 의 `<link>` 에만 넣습니다.
- **여러 페이지가 쓰는 스타일**이면 `css/base/` 에 만들고 **여섯 HTML 모두**에 넣습니다.
- JS 모듈을 추가하면 `js/main.js` 의 `PAGE_MODULES` 에 등록합니다. HTML 은 건드리지 않습니다.

---

## 5. 인터랙션 목록

| 위치 | 동작 |
| --- | --- |
| 전역 상단바 | 항목에 닿으면 화면 폭을 다 쓰는 메가패널이 내려옴 · 탭 키 · ↓ · Esc 지원 · 현재 섹션에 점 표시 |
| 모바일 (1080px 이하) | 햄버거 → 시트, 페이지마다 아코디언으로 상세 목차 |
| 홈 히어로 | 실제 질문 5개가 "하프이닝 종료 → 질문 선정 → 60초 투표 → 첫 투구 마감 → 판정 · 정산" 으로 재생 (화면 밖이면 멈춤) |
| 홈 실제 화면 | 영상 4편 탭 전환 · 좁은 화면은 세로 영상 |
| 제품 사용 흐름 | 단계 5개 탭 (마우스 · ← → Home End) |
| 제품 질문 38종 | 계열 필터 · "9/30 출제된 유형만" 스위치 · 카드를 누르면 판정 기준 펼침 |
| 제품 직접 해보기 | YES/NO · 포인트 조절 → 서버와 같은 공식의 배당 · 수령액 → 판정 결과 골라 보기 (서버로 보내지 않음) |
| 검증 점수 계산기 | 질문 유형 · 지금 확률 · 출제 횟수를 바꾸면 세 요소와 최종 점수가 다시 계산됨 |
| 전역 | 스크롤 진행바 · 우측 하단 맨 위로 버튼 · 등장 연출 |

---

## 6. 사실 표기 원칙

- **실제 값과 예시 값을 나눠 적었습니다.** 경기 · 질문 · 기준 확률 · 판정 기준은 2026-09-30 운영 서버에서 수집한 실제 값이고,
  참여 인원 · 포인트 분포 · 예시 계정 정보는 예시입니다. 화면 옆 설명에 그렇게 밝혀 두었습니다.
- **문서와 코드가 다르면 코드를 따랐습니다.** (예: 경기 추적 간격 3초, 교차검증 8종)
- **확인하지 못한 것은 확인했다고 쓰지 않았습니다.** 블록체인 기록은 운영에서 꺼져 있다고 적었고,
  원문 대조를 하지 않은 판정 유형, 운영에서 관측하지 못한 부하도 그대로 적었습니다.
- 법적 검토는 기획 단계의 팀 내부 검토이며, 법적 판단을 보증하지 않는다고 페이지에 밝혔습니다.

---

## 7. 접근성 · 성능

- `prefers-reduced-motion: reduce` 를 요청한 사용자에게는 애니메이션이 꺼지고 최종 상태만 보입니다.
- 탭은 `role="tablist"` 규약을 지키고 방향키로 이동합니다. 스위치는 `role="switch"` 로 상태를 알립니다.
- 그림으로만 전달하는 다이어그램과 분포 그래프에는 `role="img"` 와 설명(`aria-label`)을 붙였습니다.
- 흰 글씨를 얹는 버튼은 앱 네이비(`--color-action`)만 씁니다.
- 페이지마다 **자기 CSS 와 자기 JS 모듈만** 불러옵니다. 영상은 누르기 전까지 내려받지 않습니다.
- 서체는 Google Fonts 에서 불러오며, 실패해도 시스템 서체로 떨어집니다.

---

## 8. 브라우저 지원

Chrome / Edge / Safari / Firefox 최신 버전 기준입니다.
`color-mix()` · `aspect-ratio` · `mask` 를 쓰므로 2023년 이후 브라우저가 필요합니다.

---

## 9. 출처

아래 경로는 모두 **팀 저장소(S15P21B203) 기준**입니다.

- 아이콘: [lucide](https://lucide.dev) (ISC License) © Lucide Contributors
- 서체: Noto Sans KR · Archivo · Barlow Condensed · IBM Plex Mono (OFL, Google Fonts)
- 색 · 서체 값: 팀 저장소 `ui/src/styles.css` · `ui/src/landing.css`
- 질문 38종 · 판정 기준: `api/.../QuestionType.java` · `QuestionTextRenderer.java` · `V7__seed_base_probabilities.sql`
- 정산 · 경험치 · 티어: `worker/Payout.java` · `ExperiencePolicy.java` · `domain/user/Tier.java`
- 검증 수치: `docs/rest-api-spec.md` 부록 A · `docs/*-verification-*.md` · `docs/market-deadline.md`
- 블록체인: `contracts/README.md` · `contracts/contracts/BaseballPredictionMarket.sol`
- 개인정보: `ui/src/PrivacyPage.tsx` (개인정보처리방침 1.0) · `docs/privacy-logging-review.md`
- 법적 검토: `ui/프로젝트 개요.md` 「법적 대응 방안」
