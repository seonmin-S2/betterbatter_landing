/**
 * js/pages/proof/proof.data.js
 * ---------------------------------------------------------------------------
 * 검증 페이지의 수치와 목록.
 *
 * 출처
 *   · 선정 점수 · 제외 규칙      worker/QuestionSelector.java · application.yml (app.market.*)
 *   · 컨텍스트 폴백              worker/context/ContextDimension.java · ContextKeyBuilder.java ·
 *                                domain/market/QuestionType.java (MIN_SAMPLE_SIZE 100)
 *   · 튜닝 전후 지표             docs/rest-api-spec.md 부록 A.8 (2025 시즌 과거 경기 재생)
 *   · 9/30 실제 출제             운영 서버 수집본 4경기 61개 질문의 기준 확률
 *   · 교차검증 · 재검증          worker/oracle/Judges.java · OracleService.java ·
 *                                worker/PendingReviewScheduler.java
 *   · 원문 대조 검증             docs/rest-api-spec.md 부록 A.11.9 · A.15.3
 *   · 마감 · 무효 · 피드 상태    worker/MarketEngine.java · MarketCloser.java ·
 *                                MarketDeadlineScheduler.java · DataHealth.java · docs/market-deadline.md
 *   · 운영 검증                  docs/production-verification-20260914.md ·
 *                                docs/load-verification-20260918.md · docs/monitoring.md ·
 *                                .gitlab-ci.yml · 저장소 테스트 파일
 */

/** 선정 점수의 세 요소 — 가중치는 application.yml 의 weight-* */
export const SCORE_TERMS = [
  {
    key: "deviation",
    weight: 0.45,
    label: "상황 특이도",
    formula: "|p − p평균| ÷ max(p평균, 0.05), 최대 1",
    body: "지금 상황의 확률이 시즌 평균과 얼마나 다른가. 9회 1점 차와 2회 5점 차에서 같은 질문이 나오지 않게 하는 요소입니다.",
  },
  {
    key: "interest",
    weight: 0.35,
    label: "흥미도",
    formula: "결과에 따른 경기 양상 차이 (0~1)",
    body: "YES일 때와 NO일 때 경기 흐름이 얼마나 갈리는가. 절댓값이라 \"무득점으로 끝날까\" 같은 반대 질문도 살아남습니다.",
  },
  {
    key: "balance",
    weight: 0.2,
    label: "균형",
    formula: "1 − 2 × |p − 0.5|",
    body: "확률이 50%에서 멀수록 깎습니다. 답이 뻔한 질문은 참여할 이유가 없습니다.",
  },
];

/** 점수에 곱하는 감점 두 가지 */
export const PENALTIES = [
  { label: "재등장 감점", value: "× 0.5ⁿ", body: "이 경기에서 이미 n번 나온 유형은 그만큼 반감합니다. 후보를 없애지 않고 총량만 누릅니다." },
  { label: "저확률 감점", value: "× 0.5", body: "확률 20% 미만이면 절반으로 깎습니다. 특이도의 분모 구조 때문에 저확률 유형이 유리해지는 편향을 막습니다." },
];

/** 점수 전에 후보에서 빼는 규칙 */
export const EXCLUSIONS = [
  { rule: "최근 6개 유형", detail: "이 경기에서 최근 출제한 6개 유형과 그 반대 질문(득점 ↔ 무득점)" },
  { rule: "같은 계열 연속", detail: "직전 두 질문과 같은 계열(타격 · 투구 · 구조 · 전개 · 희소)" },
  { rule: "포함 관계 연속", detail: "직전 질문과 같은 서브계열(득점 1점 ↔ 2점 등)" },
  { rule: "답이 정해진 질문", detail: "지금 상황 확률 2% 미만 또는 98% 초과" },
  { rule: "이미 만든 하프이닝", detail: "경기 · 이닝 · 초말 조합마다 한 번만 — DB 유니크 제약" },
];

/** 컨텍스트 폴백 — 표본 100 미만이면 한 단계씩 넓힌다. 예시는 7회말 · 1점 차 · 2번 타순 선두 */
export const CONTEXT_CHAIN = [
  { level: 4, key: "I7|H|D0|B1", label: "이닝 · 공수 · 점수차 · 선두 타순" },
  { level: 3, key: "I7|H|D0", label: "타순 제외" },
  { level: 2, key: "I7|H", label: "점수차 제외" },
  { level: 0, key: "GLOBAL", label: "시즌 전체 평균" },
];

/** 튜닝 전후 — docs/rest-api-spec.md A.8.6 (과거 경기 재생) */
export const TUNING = [
  { label: "선택된 질문의 평균 확률", before: "0.340", after: "0.411" },
  { label: "출제된 유형 수", before: "25 / 34", after: "36 / 38" },
  { label: "한 경기 최다 반복", before: "—", after: "2회" },
  { label: "후보 고갈", before: "0건", after: "0건" },
];

/** 2026-09-30 운영 서버에서 실제로 출제된 61개 질문의 기준 확률 (오름차순) */
export const REAL_BASES = [
  0.1957, 0.2017, 0.2098, 0.2268, 0.248, 0.252, 0.2526, 0.2614, 0.2652, 0.2863, 0.2872,
  0.3026, 0.304, 0.3092, 0.3092, 0.3092, 0.3117, 0.3208, 0.3254, 0.337, 0.3537, 0.3559,
  0.3568, 0.3636, 0.3667, 0.3669, 0.373, 0.381, 0.3824, 0.3831, 0.3941, 0.3979, 0.4046,
  0.4046, 0.4052, 0.4115, 0.423, 0.4271, 0.4479, 0.4583, 0.4615, 0.4681, 0.4746, 0.4771,
  0.4865, 0.4877, 0.502, 0.5038, 0.5177, 0.5299, 0.531, 0.5604, 0.5618, 0.6075, 0.6158,
  0.6158, 0.6548, 0.6699, 0.6699, 0.6792, 0.7608,
];

/** linescore 로 교차검증되는 8종 — Judges.java 의 crossed(...) */
export const CROSS_CHECKED = ["HIT", "HIT2", "RUN", "RUN2", "NO_RUN", "LOB", "LOB2", "HIT_NO_RUN"];

/** 근거 JSON 에 담기는 항목 — OracleService#buildEvidence */
export const EVIDENCE_FIELDS = [
  "마켓 · 경기 · 이닝 · 초말",
  "질문 유형 · 문구 · 정책 버전",
  "출제 당시 기준 확률",
  "타석별 이벤트 · 투구 수 · 아웃",
  "안타 · 득점 · 삼진 · 볼넷 · 잔루 집계",
  "교차검증 결과와 linescore 값",
  "GUMBO timeStamp · 판정 결과",
];

/** 원문 대조 검증에서 찾은 결함 — docs/rest-api-spec.md A.11.9 · A.15.3 */
export const GROUND_TRUTH = {
  games: 3,
  halves: 53,
  pitches: 938,
  nonPitch: 167,
  inflation: "17.8%",
  defects: [
    {
      code: "DP",
      title: "병살의 14%를 놓치고 있었습니다",
      body: "grounded_into_double_play 하나만 세어 double_play · strikeout_double_play 등 520건을 놓쳤습니다. 확률 집계도 같은 정의라 서로 일관됐고, 그래서 함께 틀렸습니다. 판정 어휘를 한 곳으로 모으고 확률을 다시 집계했습니다.",
      from: "7.20%",
      to: "8.40%",
    },
    {
      code: "ERROR",
      title: "문구가 판정보다 넓었습니다",
      body: "판정은 실책으로 출루한 경우만 세는데 문구는 \"실책이 나올까\"였습니다. 주자 진루 중 실책과 어긋나므로 문구를 \"실책으로 출루할까\"로 좁혔습니다.",
    },
  ],
};

/** 정산하지 않고 원금을 돌려주는 경우 — VoidReason */
export const VOID_RULES = [
  { code: "ONE_SIDED_POOL", when: "이긴 쪽에 참여자가 없다", why: "배당을 계산할 수 없어 전원 환급" },
  { code: "STATE_ROLLBACK", when: "피드의 이닝 상태가 되돌아갔다", why: "일어나지 않을 이닝에 건 참여를 무효" },
  { code: "HALF_INNING_NOT_PLAYED", when: "경기가 끝나 그 하프이닝이 열리지 않았다", why: "9회말 미실시 등" },
  { code: "GAME_ENDED_UNSETTLED", when: "투표 중에 경기가 끝났다", why: "판정할 하프이닝이 없음" },
  { code: "DATA_UNVERIFIABLE", when: "교차검증이 30분 동안 맞지 않았다", why: "데이터로 판정할 수 없음" },
];

/** 피드 상태 — DataHealth.java */
export const FEED_HEALTH = [
  { state: "HEALTHY", limit: "25초 이내", effect: "정상" },
  { state: "DELAYED", limit: "25~60초", effect: "예측은 계속 받음" },
  { state: "UNAVAILABLE", limit: "60초 초과 · 연속 3회 실패", effect: "새 질문을 만들지 않음" },
];

/** 자동화된 검증 — 저장소 기준 개수 */
export const TEST_COUNTS = [
  { value: "463", label: "API 테스트", detail: "JUnit 테스트 메서드 · 파일 59개 · 격리된 PostgreSQL · Redis에서 실행" },
  { value: "52", label: "UI E2E", detail: "Playwright · 2026-09-18 CI 기준" },
  { value: "40", label: "컨트랙트 테스트", detail: "Hardhat · 봉인 · 재정산 차단 · 배당 · 권한 · 가스" },
  { value: "11", label: "CI 작업", detail: "검증 8 · 이미지 1 · 배포 1 · 배포 후 점검 1" },
];

/** CI 파이프라인 — .gitlab-ci.yml */
export const PIPELINE = [
  { stage: "verify", jobs: ["commit:lint", "infra:validate", "monitoring:rules", "privacy:erasure-test", "api:test", "ui:build", "ui:e2e", "contracts:test"] },
  { stage: "package", jobs: ["api:image"] },
  { stage: "deploy", jobs: ["deploy:production", "live:smoke"] },
];

/** 2026-09-18 운영 소규모 부하 검증 — 공개 읽기 API · 익명 STOMP 연결만 */
export const LOAD_STEPS = [
  { target: "1 RPS · WS 1", ok: "60 / 60", p95: "360ms", max: "469ms", ws: "1 / 1" },
  { target: "3 RPS · WS 5", ok: "180 / 180", p95: "266ms", max: "547ms", ws: "5 / 5" },
  { target: "5 RPS · WS 10", ok: "300 / 300", p95: "313ms", max: "1,015ms", ws: "10 / 10" },
];
