/**
 * js/pages/team/team.data.js
 * ---------------------------------------------------------------------------
 * 팀원 정보.
 *
 * 출처
 *   · 이름          저장소 docs/contributions/ 의 팀원별 파일 (가나다순)
 *   · 역할 · 소개    팀 저장소 전체 커밋 기록에서 각자 맡은 작업을 정리
 *   · 저장소 기간    git log 의 첫 커밋 · 마지막 커밋 날짜
 *
 * 필드
 *   · roles          이름 옆에 칩으로 나란히 보인다 (보통 두 개)
 *   · intro          한두 문장 소개. "OO 작성" 이 들어 있으면 점선 자리표시로 보인다
 *   · avatar         assets/team/ 에 이미지를 넣고 경로를 적는다(예: "assets/team/gi-hayoung.webp").
 *                    비워 두면 이름 첫 글자로 된 원형 자리표시가 나온다.
 */

export const TEAM = {
  program: "SSAFY 15기 특화 프로젝트",
  code: "B203",
  repoPeriod: "2026-08-26 ~ 2026-09-28",
};

export const MEMBERS = [
  {
    name: "기하영",
    roles: ["Backend", "Frontend"],
    intro: "질문별 즉시 정산과 잔액 보충을 서버에 적용하고, 마이페이지 프로필 편집과 활동 기록 화면을 다듬었습니다.",
    avatar: "",
  },
  {
    name: "나주원",
    roles: ["Infra", "DevOps"],
    intro: "AWS 운영 환경과 CI/CD를 구축하고, 백업 · 모니터링 · 개인정보 보호 기준을 마련했습니다.",
    avatar: "",
  },
  {
    name: "민경철",
    roles: ["Frontend", "Test"],
    intro: "단위 테스트와 E2E 자동 검증을 CI에 올리고, 한/영 다국어 전환을 만들었습니다.",
    avatar: "",
  },
  {
    name: "박준유",
    roles: ["Backend", "Blockchain"],
    intro: "경기 추적 · 질문 선정 · 판정 · 정산 엔진과 스마트 컨트랙트 연동을 구현했습니다.",
    avatar: "",
  },
  {
    name: "손현준",
    roles: ["Frontend", "UI"],
    intro: "서비스 화면과 업적 · 티어 이미지를 만들고, 라이브 화면을 실제 경기 데이터와 연결했습니다.",
    avatar: "",
  },
  {
    name: "윤선민",
    roles: ["Backend", "서비스 고도화"],
    intro: "경험치 산정 · 알림 · 커뮤니티 보상을 만들고, 목업 화면을 실제 데이터로 바꾸며 마무리 버그를 정리했습니다.",
    avatar: "",
  },
];
