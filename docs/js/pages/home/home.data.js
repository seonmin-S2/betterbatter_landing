/**
 * js/pages/home/home.data.js
 * ---------------------------------------------------------------------------
 * 홈 페이지의 글과 수치.
 *
 * 출처
 *   · 요약 수치      README.md (base_probabilities 8,550행 · half_inning_features 43,202행 ·
 *                    5초 폴링) · api/.../QuestionType.java (질문 유형 38종)
 *   · 히어로 질문    운영 서버 수집본 — 2026-09-30 컵스 대 파드리스(gamePk 849843)에서
 *                    실제로 생성된 하프이닝 질문 · 기저확률 · 판정 기준 문구
 *   · 참여 비율      예시 값이다. 이 경기의 실제 마켓은 참여자가 없어 모두 무효 처리됐다.
 */

/** 히어로 아래 요약 수치 */
export const HERO_FACTS = [
  { value: "38", suffix: "종", label: "질문 유형" },
  { value: "8550", suffix: "", label: "상황별 확률 조합" },
  { value: "43202", suffix: "", label: "집계한 하프이닝" },
  { value: "5", suffix: "초", label: "경기 추적 간격" },
];

/**
 * 히어로 무대에서 차례로 재생하는 실제 질문.
 * score 는 그 하프이닝이 시작될 때의 점수(원정 CHC : 홈 SD)다.
 * yesShare 는 투표 막대가 향하는 예시 참여 비율(%)이다.
 */
export const HERO_MARKETS = [
  {
    inning: "5회 초", context: "5회초", outcome: "득점권 주자가 나올까?",
    base: 0.3667, tone: "green", score: [0, 4], yesShare: 41,
    resolution: "이 하프이닝에 2루 또는 3루에 주자가 한 번이라도 서면 YES 입니다.",
  },
  {
    inning: "5회 말", context: "5회말", outcome: "두 명 이상 출루할까?",
    base: 0.3824, tone: "green", score: [0, 4], yesShare: 36,
    resolution: "이 하프이닝에 출루한 타자가 2명 이상이면 YES 입니다. 안타·볼넷·몸에 맞는 공·실책을 모두 포함합니다.",
  },
  {
    inning: "6회 초", context: "6회초", outcome: "이번 이닝에 투수가 바뀔까?",
    base: 0.2526, tone: "blue", score: [0, 7], yesShare: 27,
    resolution: "이 하프이닝에 투수가 한 번이라도 바뀌면 YES 입니다.",
  },
  {
    inning: "6회 말", context: "6회말", outcome: "삼진과 안타가 모두 나올까?",
    base: 0.381, tone: "green", score: [0, 7], yesShare: 44,
    resolution: "이 하프이닝에 삼진과 안타가 모두 나오면 YES 입니다.",
  },
  {
    inning: "7회 초", context: "7회초", outcome: "안타가 나올까?",
    base: 0.5038, tone: "coral", score: [0, 7], yesShare: 39,
    resolution: "이 하프이닝에 안타가 1개 이상 나오면 YES 입니다.",
  },
];

/** 무대 위 다섯 단계 — 서버의 마켓 생애주기와 같은 순서 */
export const HERO_PHASES = ["하프이닝 종료", "질문 선정", "60초 투표", "첫 투구 마감", "판정 · 정산"];

/**
 * 소개 영상 — 실제 앱을 수집 데이터로 재생해 녹화한 것.
 * 좁은 화면에서는 세로(모바일) 녹화본을 쓴다.
 */
export const FILMS = [
  { id: "live-flow", label: "라이브 참여", title: "공수 교대부터 마감까지, 한 번의 참여" },
  { id: "community", label: "커뮤니티", title: "경기 이야기를 나누는 커뮤니티" },
  { id: "rankings", label: "시즌 랭킹", title: "경험치가 쌓이는 시즌 랭킹" },
  { id: "mypage", label: "마이페이지", title: "활동 기록과 업적" },
];
