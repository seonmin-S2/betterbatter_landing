/**
 * js/pages/home/heroMarket.js
 * ---------------------------------------------------------------------------
 * 히어로의 "라이브 마켓 무대".
 *
 * 실제 경기에서 생성된 하프이닝 질문을 차례로 재생한다. 한 질문은 다섯 단계를 지난다.
 *   0 하프이닝 종료   공수 교대 — 다음 질문을 고르는 중
 *   1 질문 선정       질문과 기저확률(과거 표본 기준)이 나타난다
 *   2 60초 투표       카운트다운이 돌고 YES/NO 참여 막대가 움직인다 (참여 비율은 예시)
 *   3 첫 투구 마감    투표 창이 닫힌다
 *   4 판정 · 정산     하프이닝이 끝나면 적용할 판정 기준을 보여 준다
 *
 * 실제 60초를 그대로 틀면 지루하므로 무대 시간은 압축했다(질문 하나에 약 10초).
 * 화면 밖에 있거나 탭이 가려지면 시계를 멈춘다.
 * 모션 최소화를 요청한 사용자에게는 마지막 질문의 투표 단계를 멈춘 화면으로 보여 준다.
 *
 * 글과 수치: js/pages/home/home.data.js
 */

import { HERO_MARKETS, HERO_PHASES } from "./home.data.js";
import { $, escapeHtml, prefersReducedMotion } from "../../shared/utils.js";

/** 단계가 시작되는 시각(ms) — 질문 하나 = CYCLE ms */
const AT = [0, 1100, 2400, 7200, 8400];
const CYCLE = 10400;
const VOTE_WINDOW = 60; // 실제 투표 창(초)

const pct = (v) => `${(v * 100).toFixed(1)}%`;

function markup() {
  const steps = HERO_PHASES.map(
    (label, i) => `<li class="stage__step" data-step="${i}"><span class="stage__step-dot"></span><span>${escapeHtml(label)}</span></li>`
  ).join("");

  return `
    <div class="stage__top">
      <span class="stage__live"><span class="stage__live-dot"></span>LIVE</span>
      <span class="stage__score">
        <b>CHC</b><span class="num" data-score-away>0</span><i>:</i><span class="num" data-score-home>0</span><b>SD</b>
      </span>
      <span class="stage__inning" data-inning></span>
    </div>

    <ol class="stage__steps">${steps}</ol>

    <div class="stage__card">
      <div class="stage__switch" data-switch>
        <span class="stage__spinner" aria-hidden="true"></span>
        <span>공수 교대 중 · 다음 질문을 고르고 있습니다</span>
      </div>

      <div class="stage__market" data-market>
        <p class="stage__eyebrow"><span class="stage__eyebrow-dot"></span>현재 예측 · <span data-label></span></p>
        <p class="stage__question" data-question></p>

        <div class="stage__base">
          <span>과거 표본 기준 확률</span>
          <span class="stage__base-bar"><i data-base-bar></i></span>
          <b class="num" data-base></b>
        </div>

        <div class="stage__vote">
          <div class="stage__timer">
            <svg viewBox="0 0 36 36" aria-hidden="true"><circle class="stage__timer-track" cx="18" cy="18" r="15.5"/><circle class="stage__timer-ring" cx="18" cy="18" r="15.5" data-ring/></svg>
            <span class="num" data-seconds>60</span>
          </div>
          <div class="stage__pool">
            <div class="stage__pool-labels">
              <span class="stage__yes">YES <b class="num" data-yes>50</b>%</span>
              <span class="stage__pool-note">참여 비율 · 예시</span>
              <span class="stage__no"><b class="num" data-no>50</b>% NO</span>
            </div>
            <div class="stage__pool-bar"><i data-pool></i></div>
          </div>
        </div>

        <p class="stage__status" data-status></p>
      </div>
    </div>

    <p class="stage__source">2026-09-30 컵스 대 파드리스 경기에서 실제로 생성된 질문 · 참여 비율은 예시</p>
  `;
}

export function initHeroMarket() {
  const host = $(".hero__stage .stage");
  if (!host) return;
  host.innerHTML = markup();

  const q = (sel) => $(sel, host);
  const nodes = {
    away: q("[data-score-away]"), home: q("[data-score-home]"), inning: q("[data-inning]"),
    switcher: q("[data-switch]"), market: q("[data-market]"), label: q("[data-label]"),
    question: q("[data-question]"), base: q("[data-base]"), baseBar: q("[data-base-bar]"),
    seconds: q("[data-seconds]"), ring: q("[data-ring]"), yes: q("[data-yes]"), no: q("[data-no]"),
    pool: q("[data-pool]"), status: q("[data-status]"),
  };
  const steps = Array.from(host.querySelectorAll(".stage__step"));

  let index = -1;
  let phase = -1;

  /** 새 질문을 무대에 올린다 */
  function load(i) {
    const m = HERO_MARKETS[i];
    index = i;
    host.style.setProperty("--tone", `var(--market-${m.tone})`);
    nodes.away.textContent = m.score[0];
    nodes.home.textContent = m.score[1];
    nodes.inning.textContent = m.inning;
    nodes.label.textContent = m.inning;
    nodes.question.innerHTML =
      `<span class="stage__q-context">${escapeHtml(m.context)}</span> <span class="stage__q-outcome">${escapeHtml(m.outcome)}</span>`;
    nodes.base.textContent = pct(m.base);
    nodes.baseBar.style.width = "0%";
    setPool(50);
    setTimer(VOTE_WINDOW, 1);
    nodes.status.textContent = "";
  }

  function setPool(yes) {
    const y = Math.round(yes);
    nodes.yes.textContent = y;
    nodes.no.textContent = 100 - y;
    nodes.pool.style.width = `${yes}%`;
  }

  /** ratio: 남은 비율(1 → 0) */
  function setTimer(seconds, ratio) {
    nodes.seconds.textContent = Math.max(0, Math.ceil(seconds));
    nodes.ring.style.strokeDashoffset = String(97.4 * (1 - ratio));
  }

  function setPhase(p) {
    if (p === phase) return;
    phase = p;
    host.dataset.phase = String(p);
    steps.forEach((s, i) => {
      s.classList.toggle("is-done", i < p);
      s.classList.toggle("is-now", i === p);
    });
    const m = HERO_MARKETS[index];
    if (p === 1) nodes.baseBar.style.width = pct(m.base);
    if (p === 2) nodes.status.textContent = "공수 교대 후 60초 동안 참여 · 첫 투구 시 조기 마감";
    if (p === 3) nodes.status.textContent = "첫 투구 — 투표 창이 닫혔습니다";
    if (p === 4) nodes.status.textContent = `판정 기준 · ${m.resolution}`;
  }

  /* 모션 최소화 — 마지막 질문의 투표 단계를 멈춘 화면 */
  if (prefersReducedMotion()) {
    load(HERO_MARKETS.length - 1);
    setPhase(2);
    nodes.baseBar.style.width = pct(HERO_MARKETS[index].base);
    setPool(HERO_MARKETS[index].yesShare);
    setTimer(42, 42 / VOTE_WINDOW);
    host.classList.add("is-static");
    return;
  }

  /* 시계 — 보이는 동안만 흐른다 */
  let elapsed = 0;
  let last = null;
  let running = false;
  let visible = true;

  function frame(now) {
    if (!running) return;
    if (last !== null) elapsed += Math.min(now - last, 100);
    last = now;

    const cycle = Math.floor(elapsed / CYCLE);
    const i = cycle % HERO_MARKETS.length;
    if (i !== index) { phase = -1; load(i); }
    const t = elapsed % CYCLE;
    const p = AT.reduce((acc, at, k) => (t >= at ? k : acc), 0);
    setPhase(p);

    const m = HERO_MARKETS[index];
    if (p === 2) {
      const r = (t - AT[2]) / (AT[3] - AT[2]);      // 0 → 1
      setTimer(VOTE_WINDOW * (1 - r), 1 - r);
      // 참여가 몰리며 목표 비율로 수렴한다 (앞부분에서 크게, 뒤로 갈수록 작게 흔들린다)
      const wobble = Math.sin(r * 9) * 6 * (1 - r);
      setPool(50 + (m.yesShare - 50) * Math.min(1, r * 1.6) + wobble);
    }
    if (p >= 3) setPool(m.yesShare);
    if (p === 3 || p === 4) setTimer(0, 0);

    requestAnimationFrame(frame);
  }

  function play() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = null;
    requestAnimationFrame(frame);
  }
  function pause() { running = false; }

  load(0);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? play() : pause();
    }, { threshold: 0.15 }).observe(host);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
  play();
}
