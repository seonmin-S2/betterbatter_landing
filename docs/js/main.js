/**
 * js/main.js
 * ---------------------------------------------------------------------------
 * 진입점. 모든 페이지가 이 파일 하나를 불러온다.
 *
 * <body data-page="..."> 값을 보고 그 페이지에 필요한 모듈만 켠다.
 * 그래서 페이지를 늘리거나 섹션을 옮길 때 HTML의 <script> 를 건드릴 필요가 없다.
 *
 * 순서가 중요한 부분
 *   1) initReveal()이 먼저 돌아야 window.__bbObserveReveal이 준비된다.
 *      (뒤에서 JS로 만든 [data-reveal] 요소를 등록할 때 쓴다)
 *   2) initChrome()이 상단바 · 푸터를 만든다. 나머지는 서로 독립적이다.
 *
 * 모듈 하나가 실패해도 나머지 섹션은 살아 있도록 각각 try로 감싼다.
 */

import { initChrome } from "./shared/chrome.js";
import { initReveal, initCursorGlow } from "./shared/reveal.js";
import { initHeroMarket } from "./pages/home/heroMarket.js";
import { initHeroFacts } from "./pages/home/heroFacts.js";
import { initFilm } from "./pages/home/film.js";
import { initFlow } from "./pages/product/flow.js";
import { initQuestionGrid } from "./pages/product/questionGrid.js";
import { initPayout } from "./pages/product/payout.js";
import { initSeason } from "./pages/product/season.js";
import { initTryVote } from "./pages/product/tryVote.js";
import { initSelection } from "./pages/proof/selection.js";
import { initScoreCalc } from "./pages/proof/scoreCalc.js";
import { initOracle } from "./pages/proof/oracle.js";
import { initDeadline } from "./pages/proof/deadline.js";
import { initOps } from "./pages/proof/ops.js";
import { initArchitecture } from "./pages/tech/architecture.js";
import { initPipeline } from "./pages/tech/pipeline.js";
import { initChain } from "./pages/tech/chain.js";
import { initStacks } from "./pages/tech/stacks.js";

/**
 * 페이지마다 켤 모듈. 키는 <body data-page="..."> 값과 같다.
 * 섹션 모듈을 만들면 여기에 ["이름", 함수] 로 등록한다.
 */
const PAGE_MODULES = {
  home: [
    ["heroMarket", initHeroMarket],
    ["heroFacts", initHeroFacts],
    ["film", initFilm],
  ],
  product: [
    ["flow", initFlow],
    ["questions", initQuestionGrid],
    ["payout", initPayout],
    ["season", initSeason],
    ["try", initTryVote],
  ],
  proof: [
    ["selection", initSelection],
    ["scoreCalc", initScoreCalc],
    ["oracle", initOracle],
    ["deadline", initDeadline],
    ["ops", initOps],
  ],
  tech: [
    ["architecture", initArchitecture],
    ["pipeline", initPipeline],
    ["chain", initChain],
    ["stacks", initStacks],
  ],
  principles: [],
  team: [],
};

/** 이름을 붙여 실행 — 어느 모듈에서 났는지 콘솔에 남긴다. */
function run(name, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[BetterBatter landing] ${name} 초기화 실패`, error);
  }
}

function boot() {
  // 1) 등장 연출 기반 먼저
  run("reveal", initReveal);

  // 2) 모든 페이지가 공유하는 껍데기
  run("chrome", initChrome);

  // 3) 이 페이지의 섹션들
  const page = document.body.dataset.page || "home";
  (PAGE_MODULES[page] ?? []).forEach(([name, fn]) => run(name, fn));

  // 4) 장식 (포인터 기기에서만 동작)
  run("cursorGlow", initCursorGlow);

  document.documentElement.classList.add("is-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
