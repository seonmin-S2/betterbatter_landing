/**
 * js/pages/tech/tech.data.js
 * ---------------------------------------------------------------------------
 * 기술 페이지의 목록과 수치.
 *
 * 출처
 *   · 패키지 구조 · 의존 규칙     README.md (api 패키지 구조)
 *   · 과거 데이터 파이프라인      batch/HistoricalCollector · HalfInningExtractor · ProbabilityBuilder ·
 *                                 SnapshotImporter · README.md 데이터 표 · docs/rest-api-spec.md A.8
 *   · 실시간 경로                 worker/GameSchedulerService · GameTracker · MarketEngine ·
 *                                 SettlementTrigger · application.yml (app.gumbo.poll-interval-seconds: 3)
 *   · GUMBO 함정                  README.md 「GUMBO 파싱 함정」 · exec/external-services.md §2.1
 *   · 블록체인                    contracts/README.md · docs/rest-api-spec.md A.14 ·
 *                                 chain/* · exec/build-and-deploy.md §4.4
 *   · 기술 스택 · 배포            exec/build-and-deploy.md §1 · §4 · docs/monitoring.md
 */

/** 서버 패키지 — 아래 계층이 위 계층을 부르지 않는다 */
export const PACKAGES = [
  { name: "api", role: "REST 컨트롤러", note: "worker를 직접 부르지 않음 — DB와 WebSocket으로만 만난다" },
  { name: "worker", role: "경기 추적 · 마켓 엔진 · 질문 선정 · 판정 · 정산", note: "" },
  { name: "gumbo", role: "MLB Stats API 클라이언트 · 파서", note: "" },
  { name: "chain / ws", role: "web3j 컨트랙트 호출 · STOMP 브로드캐스트", note: "" },
  { name: "replay · batch", role: "녹화 재생 · 과거 시즌 수집과 확률 집계", note: "프로파일로만 켜진다" },
  { name: "domain · global", role: "엔티티 · 공통 설정 · 보안 · 오류 응답", note: "" },
];

/** 과거 데이터 → 확률 테이블 */
export const OFFLINE = [
  { value: "2,429", unit: "경기", label: "2025 시즌 전체 수집", detail: "요청 간격 1초 · 시즌당 약 41분" },
  { value: "43,202", unit: "하프이닝", label: "half_inning_features", detail: "득점 · 안타 · 잔루는 linescore, 나머지는 타석 이벤트에서" },
  { value: "4", unit: "단계", label: "상황 조합 집계", detail: "이닝·공수·점수차·타순 → 타순 제외 → 점수차 제외 → 전체" },
  { value: "8,550", unit: "행", label: "base_probabilities", detail: "Flyway 마이그레이션(V7)에 담아 클론 직후 바로 출제 가능" },
];

/** 실시간 경로 */
export const LIVE = [
  { title: "일정 적재", body: "기동 직후와 매일 00:10(KST)에 MLB 일정을 받아 경기 목록을 채웁니다." },
  { title: "추적기 맞추기", body: "1분마다 따라가야 할 경기 집합을 다시 계산해 추적기를 띄우고 내립니다. 신호를 놓쳐도 다음 1분에 제자리로 돌아옵니다." },
  { title: "3초 폴링", body: "경기 시작 10분 전부터 fields 파라미터로 필요한 값만 받아 옵니다. 없으면 응답이 5~15MB라 하루 수십 GB가 됩니다." },
  { title: "엔진 · 브로드캐스트", body: "상태를 파싱해 마감 · 생성을 처리하고, 경기 상태와 마켓 이벤트를 STOMP로 보냅니다." },
  { title: "하프이닝 끝 → 판정", body: "공수 교대를 감지한 순간에만 타석 기록이 담긴 전체 피드를 한 번 더 받아 판정 · 정산합니다." },
];

/** 실측에서 확인한 GUMBO 함정 */
export const PITFALLS = [
  { field: "timeStamp", trap: "단조증가하지 않고 되감긴다", fix: "변경 감지는 상태 키 비교로, 지연은 우리 쪽 응답 시각으로 잰다" },
  { field: "inningState", trap: "역행한다 (9회말 미실시 시 Middle → Top)", fix: "STATE_ROLLBACK 으로 앞선 하프이닝 마켓만 무효" },
  { field: "offense / defense", trap: "offense.first는 주자, defense.first는 야수", fix: "혼동하면 모든 이닝이 만루로 판정된다 — 파서 한 곳에 모음" },
  { field: "outs", trap: "경기가 끝난 뒤에도 3을 유지한다", fix: "트리거로 쓰지 않는다" },
  { field: "지연", trap: "실제 사건보다 약 12초 늦다", fix: "정상 기준을 25초로 둔다" },
];

/** 리플레이 */
export const REPLAY = [
  { value: "5,670", label: "녹화 스냅샷", detail: "실제 경기의 GUMBO 응답 원본" },
  { value: "5배속", label: "재생", detail: "3시간 경기가 약 36분 · 마감 타이머는 경기 시간 기준" },
  { value: "같은 경로", label: "GameTracker", detail: "피드 공급원만 바꾸고 파싱 · 생성 · 마감 · 정산은 라이브와 동일" },
];

/** 컨트랙트가 지키는 다섯 가지 — contracts/README.md */
export const GUARANTEES = [
  { title: "결과를 모르는 시점에 분포를 봉인", fn: "closeMarket", body: "마켓당 1회. 두 번째 호출은 되돌린다." },
  { title: "재정산 불가", fn: "resolveGame", body: "마감(CLOSED)된 마켓만 정산한다." },
  { title: "배당 규칙 조작 불가", fn: "payoutRatioBp", body: "배당률을 서버가 넘기지 않고 온체인에서 계산한다." },
  { title: "난이도 사후 변경 불가", fn: "baseProbabilityBp", body: "출제 당시 기준 확률을 마감과 함께 기록한다." },
  { title: "지정된 서버만 기록", fn: "onlyReporter", body: "기록 키가 유출되면 owner만 교체할 수 있다." },
];

/** 2026-09-01 Amoy 리플레이 완주 실측 — docs/rest-api-spec.md A.14.13 */
export const CHAIN_RUN = [
  { value: "17", label: "마켓", detail: "경기 824638 리플레이" },
  { value: "15 · 2", label: "정산 · 무효", detail: "체인 resolvedCount 15 = DB 정산 15" },
  { value: "15.8초", label: "기록 지연", detail: "DB 정산 완료 → resolveGame 확정" },
  { value: "0.1308", label: "POL / 경기", detail: "30 gwei 기준 가스 4,358,508" },
];

/** 체인 기록 순서 — ChainEventListener */
export const CHAIN_ORDER = [
  { step: "DB 저장 · 정산", mode: "동기 · 트랜잭션 안" },
  { step: "WebSocket 전송", mode: "동기 — 사용자 경험은 여기서 끝" },
  { step: "커밋", mode: "" },
  { step: "체인 기록", mode: "비동기 · 커밋 뒤 · 실패해도 위는 그대로" },
  { step: "기록 완료 알림", mode: "market.chain.recorded" },
];

/** 기술 스택 — exec/build-and-deploy.md §1 */
export const STACKS = [
  {
    group: "Backend",
    items: ["Java 21", "Spring Boot 3.3.13", "Spring Security · OAuth2 (Google)", "JWT (HttpOnly 쿠키)", "Spring WebSocket · STOMP", "WebClient (MLB 호출 전용)", "Spring Data JPA · Flyway", "springdoc-openapi"],
  },
  {
    group: "Data",
    items: ["PostgreSQL 16", "Redis 7", "MLB Stats API (GUMBO)"],
  },
  {
    group: "Frontend",
    items: ["React 19", "TypeScript 5.7", "Vite 6", "React Router 7", "@stomp/stompjs", "Playwright (E2E)"],
  },
  {
    group: "Blockchain",
    items: ["Solidity 0.8.24", "Hardhat 2.22", "web3j 4.12", "Polygon Amoy 테스트넷"],
  },
  {
    group: "Infra · CI/CD",
    items: ["AWS EC2 · ECR · S3 · CloudFront · SSM", "Docker Compose", "nginx 1.28", "GitLab CI · 전용 Runner", "OIDC (정적 키 미보관)"],
  },
  {
    group: "Observability",
    items: ["Prometheus 3.13", "Grafana 13.2", "Mattermost 경보", "journald 로그"],
  },
];
