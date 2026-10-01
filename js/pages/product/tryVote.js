/**
 * js/pages/product/tryVote.js
 * ---------------------------------------------------------------------------
 * 직접 해보기 — 실제로 생성된 질문 하나에 예시 참여량을 붙인 체험 카드.
 * YES/NO를 고르고 포인트를 정하면, 서버와 같은 공식(payoutMath.js)으로
 * 배당과 적중 시 수령액을 보여 준다. 판정 버튼으로 두 결과를 모두 확인할 수 있다.
 * 아무 데이터도 서버로 보내지 않는다.
 */

import { TRY_MARKET, PAYOUT } from "./product.data.js";
import { expectedPayout } from "./payoutMath.js";
import { $, $$, escapeHtml } from "../../shared/utils.js";

const n = (v) => v.toLocaleString("ko-KR");
const RULE = { seed: PAYOUT.seed, cap: PAYOUT.cap };
const MIN = 10;
const UNIT = 10;

export function initTryVote() {
  const card = $(".try");
  if (!card) return;
  const m = TRY_MARKET;

  $(".try__label", card).textContent = m.inning;
  $(".try__question", card).innerHTML =
    `<span class="try__q-context">${escapeHtml(m.context)}</span> ${escapeHtml(m.outcome)}`;
  $(".try__base", card).textContent = `${(m.base * 100).toFixed(1)}%`;
  $(".try__resolution", card).textContent = m.resolution;

  const yesPct = Math.round((m.pool.yes / (m.pool.yes + m.pool.no)) * 100);
  $("[data-try-yes]", card).textContent = yesPct;
  $("[data-try-no]", card).textContent = 100 - yesPct;

  const amountOut = $("[data-try-amount]", card);
  const balanceOut = $("[data-try-balance]", card);
  const expectOut = $("[data-try-expect]", card);
  const ratioOut = $("[data-try-ratio]", card);
  const submit = $(".try__submit", card);
  const result = $(".try__result", card);
  const sides = $$("[data-side]", card);

  let side = null;
  let amount = 100;
  let entered = false;

  function render() {
    amountOut.textContent = n(amount);
    balanceOut.textContent = n(m.balance - (entered ? amount : 0));
    sides.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.side === side)));
    card.dataset.side = side ?? "";
    if (!side) {
      expectOut.textContent = "—";
      ratioOut.textContent = "결과를 먼저 고르세요";
      submit.disabled = true;
      submit.textContent = "YES 또는 NO를 고르세요";
      return;
    }
    const q = expectedPayout(m.pool, side, amount, RULE);
    expectOut.textContent = `${n(q.payout)}P`;
    ratioOut.textContent = `배당 ${q.ratio.toFixed(2)}배 · 마감 분포에 따라 변동`;
    submit.disabled = entered;
    submit.textContent = entered ? `${side.toUpperCase()}에 ${n(amount)}P 참여함` : `${side.toUpperCase()}에 ${n(amount)}P 참여`;
  }

  sides.forEach((b) => b.addEventListener("click", () => {
    if (entered) return;
    side = b.dataset.side;
    render();
  }));

  $$("[data-step]", card).forEach((b) => b.addEventListener("click", () => {
    if (entered) return;
    amount = Math.max(MIN, Math.min(m.balance, amount + Number(b.dataset.step)));
    amount -= amount % UNIT;
    render();
  }));

  submit.addEventListener("click", () => {
    if (!side || entered) return;
    entered = true;
    card.classList.add("is-entered");
    result.hidden = false;
    render();
  });

  /* 판정 — 하프이닝이 끝났다고 치고 두 결과를 확인한다 */
  $$("[data-outcome]", card).forEach((b) => b.addEventListener("click", () => {
    const yesWins = b.dataset.outcome === "yes";
    const won = (side === "yes") === yesWins;
    const q = expectedPayout(m.pool, side, amount, RULE);
    $$("[data-outcome]", card).forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    const out = $(".try__settle", card);
    out.dataset.won = String(won);
    // 경험치 — ExperiencePolicy.java: 참여 2 + 적중 20 + 난이도 min(80, round(8 × (수령/참여 − 1)))
    const difficulty = Math.min(80, Math.max(0, Math.round(8 * (q.payout / amount - 1))));
    const xp = won ? 2 + 20 + difficulty : 2;
    out.innerHTML = won
      ? `적중 · <b class="num">+${n(q.payout - amount)}P</b> <small>${n(amount)}P → ${n(q.payout)}P 지급 · 경험치 +${xp} (연속 적중 보너스 별도)</small>`
      : `미적중 · <b class="num">−${n(amount)}P</b> <small>참여 포인트는 이긴 쪽에 배당됩니다 · 경험치 +${xp}</small>`;
  }));

  $(".try__reset", card)?.addEventListener("click", () => {
    side = null; amount = 100; entered = false;
    card.classList.remove("is-entered");
    result.hidden = true;
    $(".try__settle", card).textContent = "";
    $$("[data-outcome]", card).forEach((o) => o.setAttribute("aria-pressed", "false"));
    render();
  });

  render();
}
