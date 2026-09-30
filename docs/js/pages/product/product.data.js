/**
 * js/pages/product/product.data.js
 * ---------------------------------------------------------------------------
 * 제품 페이지의 글과 수치.
 *
 * 출처
 *   · 사용 흐름 문구   ui/src/LandingPage.tsx (앱 소개 화면 /about 의 5장면 문구)
 *   · 포인트 규칙      api/src/main/resources/application.yml (app.market.*) ·
 *                      worker/SettlementService.java (잔액 소진 시 50P 보충)
 *   · 배당 공식        worker/Payout.java
 *   · 경험치           worker/ExperiencePolicy.java
 *   · 티어 기준        domain/user/Tier.java
 *   · 업적             운영 서버 GET /achievements 수집본 (조건 · 희귀도)
 */

/** 사용 흐름 5장면 — 화면은 assets/screens/<shot>-d.webp · -m.webp */
export const FLOW = [
  {
    label: "오늘 경기 선택",
    title: "오늘의 경기를 고릅니다.",
    body: "진행 중 · 예정 · 종료 경기가 한 목록에 있습니다. 고르는 순간 화면의 모든 데이터가 그 경기로 바뀝니다.",
    shot: "05-game-select",
    alt: "오늘의 경기 네 개가 펼쳐진 경기 선택 목록",
  },
  {
    label: "실시간 구장",
    title: "구장 화면에서 흐름을 읽습니다.",
    body: "점수와 주자, 볼카운트, 수비 위치가 하나의 구장 화면에서 이어집니다. 중계와 앱을 번갈아 볼 일이 없습니다.",
    shot: "01-live-field",
    alt: "수비 위치와 투구 궤적이 표시된 실시간 구장 화면",
  },
  {
    label: "예측 참여",
    title: "질문에 YES / NO로 참여합니다.",
    body: "참여 포인트와 적중 시 예상 포인트를 확인하고 한 번의 판단을 남깁니다. 참여가 몰릴수록 배당이 움직입니다.",
    shot: "04-vote",
    alt: "YES와 NO 비율, 참여 포인트, 적중 시 예상 포인트가 보이는 참여 화면",
  },
  {
    label: "응원톡",
    title: "같은 장면을 함께 이야기합니다.",
    body: "팬들의 선택과 메시지가 같은 흐름 안에 보입니다. 이름 옆의 선택 표시로 대화의 맥락이 바로 읽힙니다.",
    shot: "03-live-market",
    alt: "열린 예측 질문 카드와 YES · NO 선택 표시가 붙은 응원톡",
  },
  {
    label: "시즌 티어",
    title: "기록이 시즌 티어가 됩니다.",
    body: "경기마다 쌓인 점수가 티어 진행도와 시즌 · 경기 · 구단 랭킹으로 이어집니다. 한 경기가 시즌의 위치를 만듭니다.",
    shot: "07-rankings",
    alt: "시즌 티어와 랭크 점수, 다음 티어까지의 진행도가 보이는 랭킹 화면",
  },
];

/** 포인트 규칙 — application.yml · SettlementService.java */
export const POINT_RULES = [
  { value: "1,000P", label: "경기마다 지급", note: "경기에 입장할 때 받는 무료 가상 포인트" },
  { value: "10P", label: "최소 · 단위", note: "10P부터, 10P 단위로 참여" },
  { value: "60초", label: "투표 창", note: "공수 교대 후 60초 · 첫 투구에 조기 마감" },
  { value: "50P", label: "잔액 보충", note: "잔액이 0P가 되면 다음 질문을 위해 보충" },
];

/** 배당 공식 — Payout.java */
export const PAYOUT = {
  seed: 100,
  cap: 30,
  /** 예시 풀 (투표 화면 캡처와 같은 값) */
  example: { yes: 3900, no: 6200, stake: 250 },
};

/** 경험치 — ExperiencePolicy.java */
export const XP_RULES = [
  { value: "+2", label: "참여 1건" },
  { value: "+20", label: "적중 1건" },
  { value: "+8 × (배당 − 1)", label: "난이도 · 적중 1건당 최대 80" },
  { value: "+6 ~ +36", label: "경기 안 연속 적중 (2 · 3 · 4 · 5연속 이상)" },
];

/** 티어 — Tier.java. 경험치(랭크 점수) 기준 */
export const TIERS = [
  { code: "ROOKIE", min: 0 },
  { code: "BRONZE", min: 2000 },
  { code: "SILVER", min: 4000 },
  { code: "GOLD", min: 6000 },
  { code: "PLATINUM", min: 7000 },
  { code: "DIAMOND", min: 8000 },
  { code: "ALL-STAR", min: 9000 },
];

/** 업적 8종 — 운영 서버 수집본 */
export const ACHIEVEMENTS = [
  { id: "first-prediction", name: "첫 예측", detail: "라이브 예측에 처음 참여", goal: "1회", rarity: "커먼" },
  { id: "clutch-hitter", name: "클러치 히터", detail: "연속 예측 적중 기록", goal: "5회", rarity: "커먼" },
  { id: "dugout-leader", name: "덕아웃 리더", detail: "커뮤니티 공감 누적 기록", goal: "100개", rarity: "커먼" },
  { id: "comeback-call", name: "역전의 한 수", detail: "역전 상황 예측 적중", goal: "5회", rarity: "레어" },
  { id: "night-game", name: "야간 원정대", detail: "야간 경기 참여", goal: "10회", rarity: "레어" },
  { id: "ballpark-regular", name: "구장 단골", detail: "참여 구장 수", goal: "5곳", rarity: "레어" },
  { id: "hot-streak", name: "뜨거운 타석", detail: "연속 라이브 참여 기록", goal: "7일", rarity: "에픽" },
  { id: "season-challenger", name: "시즌 챌린저", detail: "한 시즌 예측 참여", goal: "250회", rarity: "레전더리" },
];

/**
 * 직접 해보기 — 실제로 생성된 질문 하나에 예시 참여량을 붙였다.
 * (2026-09-30 컵스 대 파드리스 7회 초 · 기저확률 50.38%)
 */
export const TRY_MARKET = {
  inning: "7회 초",
  context: "7회초",
  outcome: "안타가 나올까?",
  base: 0.5038,
  resolution: "이 하프이닝에 안타가 1개 이상 나오면 YES 입니다.",
  pool: { yes: 3900, no: 6200 },
  balance: 1000,
};
