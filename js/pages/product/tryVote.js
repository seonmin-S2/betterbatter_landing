/**
 * js/pages/product/tryVote.js
 * ---------------------------------------------------------------------------
 * 직접 해보기 — 앱의 실제 투표 화면(ui/src/PredictionVote.tsx 의 PredictionVotePanel)을
 * 같은 마크업 · 같은 클래스로 옮겨 그린다. 모양은 css/pages/product/vote.css 의 앱 원본 규칙.
 *
 *   질문 머리      .selected-market   — 질문 문구 · 판정 기준 말풍선
 *   YES / NO 대결  .core-stage        — 들어올 때 한 번 맞부딪히는 연출 · 입자 · VS 표시
 *   참여 포인트    .amount-field      — 입력 · 보유 전부 · ±50/100 · 적중 시 예상
 *   참여 버튼      .submit-order
 *
 * 질문은 9월 30일 경기에서 실제로 생성된 것, 참여량은 예시(product.data.js 의 TRY_MARKET).
 * 적중 시 예상은 서버 견적과 같은 공식(payoutMath.js = Payout.java)으로 계산한다.
 * 참여 뒤에는 판정 결과를 골라 적중 · 미적중을 확인한다. 아무것도 서버로 보내지 않는다.
 */

import { TRY_MARKET, PAYOUT } from "./product.data.js";
import { expectedPayout } from "./payoutMath.js";
import { icon } from "../../data/icons.js";
import { $, $$, escapeHtml, onceInView, prefersReducedMotion } from "../../shared/utils.js";

const RULE = { seed: PAYOUT.seed, cap: PAYOUT.cap };
const MIN = 10;
const UNIT = 10;
const START_AMOUNT = 100;
const fmt = (v) => v.toLocaleString("ko-KR");

/* ─── PredictionVote.tsx 의 연출 계산을 그대로 옮김 ─────────────────────── */

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createCollisionParticles(seed, count) {
  const random = seededRandom(seed);
  const perSide = Math.ceil(count / 2);
  return Array.from({ length: count }, (_, index) => {
    const side = index % 2 === 0 ? "yes" : "no";
    const sideIndex = Math.floor(index / 2);
    const lane = perSide <= 1 ? 0.5 : sideIndex / (perSide - 1);
    const x = Math.min(66, Math.max(34, 35 + lane * 30 + (side === "yes" ? -0.75 : 0.75) + (random() - 0.5) * 1.8));
    let y;
    if (index < 10) y = 5 + index * 10 + (random() - 0.5) * 4;
    else if (index % 9 === 0) y = 80 + random() * 16;
    else y = 7 + ((random() + random()) / 2) * 86;
    y = Math.max(4, Math.min(96, y));
    const centerWeight = 1 - Math.min(1, Math.abs(y - 50) / 50);
    const life = 1.15 + centerWeight * 1.75 + random() * 0.75;
    const direction = side === "yes" ? -1 : 1;
    const sizeBias = random();
    const maxSize = 3.2 + centerWeight * 12.3;
    const sizeRatio = 0.58 + sizeBias * sizeBias * 0.42;
    return {
      side,
      style: {
        "--particle-x": `${x.toFixed(2)}%`,
        "--particle-y": `${y.toFixed(2)}%`,
        "--particle-size": `${(1.1 + sizeRatio * (maxSize - 1.1)).toFixed(2)}px`,
        "--particle-life": `${life.toFixed(2)}s`,
        "--particle-delay": `${(-random() * life).toFixed(2)}s`,
        "--particle-origin": `${((random() - 0.5) * 3).toFixed(2)}px`,
        "--particle-travel": `${(direction * (18 + random() * 40)).toFixed(2)}px`,
        "--particle-drift": `${((random() - 0.5) * 22).toFixed(2)}px`,
        "--particle-alpha": `${(0.38 + centerWeight * 0.38 + random() * 0.2).toFixed(2)}`,
      },
    };
  });
}

const PARTICLES = createCollisionParticles(247, 54);

function visualCorePosition(probability) {
  const p = Math.min(80, Math.max(20, probability));
  return 42 + ((p - 20) / 60) * 16;
}

function sampleDuelCurve(progress, target) {
  const keys = [
    { progress: 0, position: 50 },
    { progress: 0.17, position: 61 },
    { progress: 0.31, position: 58 },
    { progress: 0.55, position: 40 },
    { progress: 0.67, position: 44 },
    { progress: 0.84, position: 58 },
    { progress: 1, position: target },
  ];
  const i = Math.min(keys.length - 2, Math.max(0, keys.findIndex((k) => progress <= k.progress) - 1));
  const from = keys[i];
  const to = keys[i + 1];
  const span = to.progress - from.progress;
  const t = Math.min(1, Math.max(0, (progress - from.progress) / span));
  const prev = keys[Math.max(0, i - 1)];
  const next = keys[Math.min(keys.length - 1, i + 2)];
  const fromSlope = i === 0 ? 0 : (to.position - prev.position) / (to.progress - prev.progress);
  const toSlope = i + 1 === keys.length - 1 ? 0 : (next.position - from.position) / (next.progress - from.progress);
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * from.position + (t3 - 2 * t2 + t) * fromSlope * span
    + (-2 * t3 + 3 * t2) * to.position + (t3 - t2) * toSlope * span;
}

/* ─── 마크업 ──────────────────────────────────────────────────────────── */

function markup(m, yes) {
  const particleField = (side) => `<span class="collision-particle-field ${side}" aria-hidden="true">${PARTICLES
    .filter((p) => p.side === side)
    .map((p) => `<i class="collision-particle ${side}" style="${Object.entries(p.style).map(([k, v]) => `${k}:${v}`).join(";")}"></i>`)
    .join("")}</span>`;

  return `
    <header class="bb-vote__bar"><span>예측 체험</span><small>실제 질문 · 예시 참여량</small></header>

    <div class="selected-market">
      <strong><span class="market-question"><span class="question-keyword context">${escapeHtml(m.context)}</span><span class="question-keyword outcome">${escapeHtml(m.outcome)}</span></span></strong>
      <div class="selected-market-meta">
        <span><i class="pulse"></i> 과거 표본 기준 확률 ${(m.base * 100).toFixed(1)}%</span>
        <span class="info-tip text-trigger" data-tip>
          <button class="info-tip-trigger" type="button" aria-label="결과 판정 기준">판정 기준?</button>
          <span class="info-tip-bubble" role="tooltip">
            <strong>결과 판정 기준</strong><span>${escapeHtml(m.resolution)}</span><small>출처 · MLB 공식 Play-by-Play</small>
          </span>
        </span>
      </div>
    </div>

    <div class="core-stage live-power-core unselected" role="group" aria-label="예측 결과 선택">
      <span class="core-beam yes" aria-hidden="true"></span>
      <span class="core-beam no" aria-hidden="true"></span>
      ${particleField("yes")}
      ${particleField("no")}
      <button class="core-choice yes" type="button" aria-pressed="false" data-side="yes">
        <small>YES</small><b><span data-count="yes">${yes}</span><em>%</em></b><strong>그렇다</strong><span data-pick>선택</span>
      </button>
      <button class="core-choice no" type="button" aria-pressed="false" data-side="no">
        <small>NO</small><b><span data-count="no">${100 - yes}</span><em>%</em></b><strong>아니다</strong><span data-pick>선택</span>
      </button>
      <span class="core-impact collision-line" aria-hidden="true">
        <svg class="versus-mark" viewBox="0 0 120 80" focusable="false">
          <defs>
            <clipPath id="bbv-yes"><polygon points="0,0 66,0 41,80 0,80"/></clipPath>
            <clipPath id="bbv-no"><polygon points="77.5,0 120,0 120,80 52.5,80"/></clipPath>
          </defs>
          <text class="versus-text yes" x="49" y="58" text-anchor="middle" clip-path="url(#bbv-yes)">V</text>
          <text class="versus-text no" x="71" y="70" text-anchor="middle" clip-path="url(#bbv-no)">S</text>
        </svg>
      </span>
    </div>

    <div class="amount-field">
      <div class="amount-heading">
        <span class="amount-label-group">
          <label for="bbv-amount">참여 포인트</label>
          <span class="info-tip text-trigger" data-tip>
            <button class="info-tip-trigger" type="button" aria-label="무료 팬 참여 포인트 안내">?</button>
            <span class="info-tip-bubble" role="tooltip">
              <strong>무료 예측 포인트 (P)</strong><span>현금 구매·환전·사용자 간 양도가 불가능합니다.</span>
            </span>
          </span>
        </span>
        <button class="amount-balance" type="button" aria-pressed="false" data-all>
          <span>보유</span><strong>${fmt(m.balance)}P</strong><em>전부</em>
        </button>
      </div>
      <div class="amount-value">
        <span class="amount-entry">
          <input id="bbv-amount" type="number" inputmode="numeric" min="${MIN}" max="${m.balance}" step="${UNIT}" value="${START_AMOUNT}">
          <span>P</span>
        </span>
        <span class="amount-gain-preview is-pending" aria-live="polite">
          <i aria-hidden="true">↗</i>
          <span><em>적중 시 예상</em><strong data-expect>—</strong><small data-gain>선택 후</small></span>
        </span>
      </div>
      <div class="amount-adjustments" role="group" aria-label="참여 포인트 증감">
        ${[-100, -50, 50, 100].map((d) => `<button type="button" data-delta="${d}" aria-label="참여 포인트 ${Math.abs(d)}P ${d < 0 ? "줄이기" : "늘리기"}">${d < 0 ? "−" : "＋"}${Math.abs(d)}</button>`).join("")}
      </div>
      <p class="amount-error" role="alert" hidden></p>
    </div>

    <button class="submit-order side-unselected" type="button" disabled>결과를 먼저 선택하세요</button>
    <p class="order-deadline">${icon("clock", 13)}<span data-deadline>체험용 화면이라 포인트가 실제로 차감되지 않습니다.</span></p>

    <div class="bb-vote__settle" hidden>
      <p class="bb-vote__settle-title">하프이닝이 끝났다고 치고, 판정 결과를 골라 보세요</p>
      <div class="bb-vote__outcomes">
        <button type="button" data-outcome="yes" aria-pressed="false">YES로 판정</button>
        <button type="button" data-outcome="no" aria-pressed="false">NO로 판정</button>
      </div>
      <p class="bb-vote__result" aria-live="polite"></p>
      <button class="bb-vote__reset" type="button">다시 해보기</button>
    </div>`;
}

/* ─── 동작 ────────────────────────────────────────────────────────────── */

export function initTryVote() {
  const root = $(".bb-vote");
  if (!root) return;
  const m = TRY_MARKET;
  const yes = Math.round((m.pool.yes / (m.pool.yes + m.pool.no)) * 100);
  root.classList.add("tone-coral");
  root.innerHTML = markup(m, yes);

  const stage = $(".core-stage", root);
  const beams = { yes: $(".core-beam.yes", stage), no: $(".core-beam.no", stage) };
  const fields = { yes: $(".collision-particle-field.yes", stage), no: $(".collision-particle-field.no", stage) };
  const line = $(".collision-line", stage);
  const counts = { yes: $('[data-count="yes"]', stage), no: $('[data-count="no"]', stage) };
  const choices = $$(".core-choice", stage);
  const input = $("#bbv-amount", root);
  const field = $(".amount-field", root);
  const allButton = $("[data-all]", root);
  const deltas = $$("[data-delta]", root);
  const preview = $(".amount-gain-preview", root);
  const expectOut = $("[data-expect]", root);
  const gainOut = $("[data-gain]", root);
  const errorOut = $(".amount-error", root);
  const submit = $(".submit-order", root);
  const deadline = $("[data-deadline]", root);
  const settle = $(".bb-vote__settle", root);
  const result = $(".bb-vote__result", root);
  const outcomes = $$("[data-outcome]", root);

  let side = null;
  let amount = START_AMOUNT;
  let participated = false;

  /* 대결 화면 — 경계선 위치와 색 영역 */
  const target = visualCorePosition(yes);
  const EDGE = 27; // 176px 높이 · 17도 기울기 → (176 / 2) × tan 17° ≈ 27px
  function place(position) {
    const yesClip = `polygon(0 0, calc(${position}% + ${EDGE}px) 0, calc(${position}% - ${EDGE}px) 100%, 0 100%)`;
    const noClip = `polygon(calc(${position}% + ${EDGE}px) 0, 100% 0, 100% 100%, calc(${position}% - ${EDGE}px) 100%)`;
    stage.style.setProperty("--core-position", `${position}%`);
    beams.yes.style.clipPath = yesClip;
    fields.yes.style.clipPath = yesClip;
    beams.no.style.clipPath = noClip;
    fields.no.style.clipPath = noClip;
    line.style.left = `${position}%`;
  }
  place(target);

  /* 화면에 처음 들어올 때 한 번 — 앱과 같은 1.6초 맞부딪힘 */
  function entrance() {
    if (prefersReducedMotion()) {
      stage.classList.add("motion-disabled");
      return;
    }
    const duration = 1600;
    const clashAt = 0.82;
    const targetNo = 100 - yes;
    const start = performance.now();
    stage.classList.add("is-entering");
    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const duel = Math.min(1, progress / clashAt);
      const reveal = 1 - Math.pow(1 - duel, 2.05);
      let position = sampleDuelCurve(duel, target);
      const bias = Math.min(10, Math.max(-10, (position - target) * 0.58));
      let y = Math.min(100, Math.max(0, yes * reveal + bias));
      let n = Math.min(100, Math.max(0, targetNo * reveal - bias));
      const impacting = progress >= clashAt && progress < 1;
      if (impacting) {
        const s = (progress - clashAt) / (1 - clashAt);
        position = target + Math.sin(s * Math.PI * 5) * 0.85 * Math.pow(1 - s, 1.35);
        y = yes;
        n = targetNo;
      }
      stage.classList.toggle("is-impacting", impacting);
      place(progress === 1 ? target : position);
      counts.yes.textContent = String(progress === 1 ? yes : Math.round(y));
      counts.no.textContent = String(progress === 1 ? targetNo : Math.round(n));
      if (progress < 1) requestAnimationFrame(frame);
      else stage.classList.remove("is-entering", "is-impacting");
    };
    requestAnimationFrame(frame);
  }
  onceInView(stage, entrance, { threshold: 0.4 });

  /* 판정 기준 · 포인트 안내 말풍선 */
  $$("[data-tip]", root).forEach((tip) => {
    const open = (on) => tip.classList.toggle("open", on);
    tip.addEventListener("mouseenter", () => open(true));
    tip.addEventListener("mouseleave", () => open(false));
    const trigger = $(".info-tip-trigger", tip);
    trigger.addEventListener("click", () => open(true));
    trigger.addEventListener("blur", () => open(false));
    trigger.addEventListener("keydown", (e) => { if (e.key === "Escape") { open(false); trigger.blur(); } });
  });

  function amountError() {
    if (!Number.isFinite(amount) || amount < MIN) return `최소 ${MIN}P부터 참여할 수 있습니다.`;
    if (amount > m.balance) return "보유 포인트보다 많이 걸 수 없습니다.";
    if (amount % UNIT !== 0) return `${UNIT}P 단위로 입력해 주세요.`;
    return "";
  }

  function render() {
    const error = amountError();
    stage.classList.toggle("unselected", !side);
    stage.classList.toggle("selected-yes", side === "yes");
    stage.classList.toggle("selected-no", side === "no");
    stage.classList.toggle("is-review", participated);
    choices.forEach((b) => {
      const on = b.dataset.side === side;
      b.classList.toggle("selected", on);
      b.setAttribute("aria-pressed", String(on));
      b.disabled = participated;
      $("[data-pick]", b).innerHTML = on ? `${icon("check", 13)}선택됨` : "선택";
    });

    field.classList.toggle("review", participated);
    input.disabled = participated;
    input.setAttribute("aria-invalid", String(Boolean(error)));
    errorOut.hidden = !error;
    errorOut.textContent = error;
    const all = amount >= m.balance;
    allButton.classList.toggle("active", all);
    allButton.setAttribute("aria-pressed", String(all));
    allButton.disabled = participated;
    $("em", allButton).innerHTML = `${all ? icon("check", 10) : ""}전부`;
    deltas.forEach((b) => {
      const next = amount + Number(b.dataset.delta);
      b.disabled = participated || next < MIN || next > m.balance;
    });

    const quote = side && !error ? expectedPayout(m.pool, side, amount, RULE) : null;
    preview.classList.toggle("is-pending", !quote);
    expectOut.textContent = quote ? `${fmt(quote.payout)}P` : "—";
    gainOut.textContent = quote ? `+${fmt(quote.payout - amount)}P · 마감 분포에 따라 변동` : "선택 후";

    submit.className = `submit-order ${participated ? "review-complete" : side ? `side-${side}` : "side-unselected"}`;
    submit.disabled = participated || !side || Boolean(error);
    submit.innerHTML = participated
      ? `${icon("check", 17)}참여 완료 · ${side.toUpperCase()} 선택`
      : side ? `${side.toUpperCase()}에 ${fmt(amount)}P 참여${icon("arrowRight", 17)}` : "결과를 먼저 선택하세요";
    deadline.textContent = participated
      ? "참여 내역은 하프이닝이 끝나면 판정됩니다. 아래에서 결과를 골라 보세요."
      : "체험용 화면이라 포인트가 실제로 차감되지 않습니다.";
    settle.hidden = !participated;
  }

  choices.forEach((b) => b.addEventListener("click", () => {
    if (participated) return;
    side = b.dataset.side;
    render();
  }));

  input.addEventListener("input", () => {
    amount = Math.max(0, Number(input.value));
    render();
  });

  allButton.addEventListener("click", () => {
    amount = m.balance;
    input.value = String(amount);
    render();
  });

  deltas.forEach((b) => b.addEventListener("click", () => {
    amount = Math.min(m.balance, Math.max(MIN, amount + Number(b.dataset.delta)));
    input.value = String(amount);
    render();
  }));

  submit.addEventListener("click", () => {
    if (!side || amountError()) return;
    participated = true;
    render();
  });

  /* 판정 — 경험치는 ExperiencePolicy.java: 참여 2 + 적중 20 + 난이도 min(80, round(8 × (수령/참여 − 1))) */
  outcomes.forEach((b) => b.addEventListener("click", () => {
    const yesWins = b.dataset.outcome === "yes";
    const won = (side === "yes") === yesWins;
    const quote = expectedPayout(m.pool, side, amount, RULE);
    outcomes.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    const difficulty = Math.min(80, Math.max(0, Math.round(8 * (quote.payout / amount - 1))));
    const xp = won ? 2 + 20 + difficulty : 2;
    result.dataset.won = String(won);
    result.innerHTML = won
      ? `적중 · <b>+${fmt(quote.payout - amount)}P</b><small>${fmt(amount)}P → ${fmt(quote.payout)}P 지급 · 경험치 +${xp} (연속 적중 보너스 별도)</small>`
      : `미적중 · <b>−${fmt(amount)}P</b><small>참여 포인트는 이긴 쪽에 배당됩니다 · 경험치 +${xp}</small>`;
  }));

  $(".bb-vote__reset", root).addEventListener("click", () => {
    side = null;
    amount = START_AMOUNT;
    participated = false;
    input.value = String(amount);
    result.textContent = "";
    delete result.dataset.won;
    outcomes.forEach((o) => o.setAttribute("aria-pressed", "false"));
    render();
  });

  render();
}
