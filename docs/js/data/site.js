/**
 * js/data/site.js
 * ---------------------------------------------------------------------------
 * 사이트 전역 설정 — 페이지 목차와 외부 링크.
 *
 * ✅ 여기부터 고치세요
 *    LINKS의 값을 채우면 상단바 · 마무리 버튼이 한꺼번에 살아납니다.
 *    빈 문자열("")로 두면 해당 버튼은 자동으로 감춰집니다.
 */

export const LINKS = {
  /** 배포된 서비스 주소 — 운영 서버는 2026-10-02에 종료되어 비워 둔다 */
  service: "",
  /** 소스 저장소 */
  repository: "",
  /** 발표 자료 PDF */
  deck: "",
};

/**
 * 사이트 구조 — 페이지 6장과 각 페이지의 상세 목차.
 *
 * 상단바 · 메가패널 · 모바일 시트 · 푸터가 모두 이 배열 하나로 만들어진다.
 *
 * 필드
 *   id       페이지 식별자. <body data-page="..."> 값과 같아야 한다
 *   label    상단바에 보이는 이름
 *   file     실제 파일명 (같은 폴더에 나란히 있으므로 상대경로 그대로)
 *   children 그 페이지 안의 섹션들. hash는 해당 <section> 의 id
 */
export const NAV = [
  {
    id: "home",
    label: "홈",
    file: "index.html",
    children: [
      { hash: "why", label: "기획 배경" },
      { hash: "glance", label: "기능 요약" },
      { hash: "film", label: "실제 화면" },
    ],
  },
  {
    id: "product",
    label: "제품",
    file: "product.html",
    children: [
      { hash: "flow", label: "사용 흐름" },
      { hash: "questions", label: "질문 38종" },
      { hash: "payout", label: "파리뮤추얼 정산" },
      { hash: "season", label: "시즌 · 티어 · 업적" },
      { hash: "try", label: "직접 해보기" },
    ],
  },
  {
    id: "proof",
    label: "검증",
    file: "proof.html",
    children: [
      { hash: "selection", label: "질문 선정" },
      { hash: "oracle", label: "결과 판정" },
      { hash: "deadline", label: "마감 처리" },
      { hash: "ops", label: "운영 검증" },
    ],
  },
  {
    id: "tech",
    label: "기술",
    file: "tech.html",
    children: [
      { hash: "architecture", label: "시스템 아키텍처" },
      { hash: "pipeline", label: "데이터 파이프라인" },
      { hash: "chain", label: "블록체인 설계" },
      { hash: "stacks", label: "기술 스택" },
    ],
  },
  {
    id: "principles",
    label: "원칙",
    file: "principles.html",
    children: [
      { hash: "points", label: "무료 가상 포인트" },
      { hash: "law", label: "법적 검토" },
      { hash: "privacy", label: "개인정보 보호" },
    ],
  },
  {
    id: "team",
    label: "팀",
    file: "team.html",
    children: [{ hash: "members", label: "팀원 소개" }],
  },
];

/** 로고를 눌렀을 때 돌아가는 곳. 상단바 첫 항목("홈")과 같은 문서입니다. */
export const HOME_FILE = "index.html";

export const SITE = {
  name: "BetterBatter",
  /** 앱 <title>의 부제 (ui/index.html) */
  meaning: "Live Ballpark Prediction",
  tagline: "실시간 야구 경기 데이터 기반 예측 마켓",
  year: 2026,
};
