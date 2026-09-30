/**
 * js/pages/proof/scoreCalc.js
 * ---------------------------------------------------------------------------
 * 선정 점수 계산기. QuestionSelector.java#score 와 같은 식을 브라우저에서 돌린다.
 *
 *   deviation = min(|p − p평균| ÷ max(p평균, 0.05), 1)
 *   balance   = max(1 − 2|p − 0.5|, 0)
 *   base      = 0.45·deviation + 0.35·interest + 0.20·balance
 *   score     = base × 0.5^이미나온횟수 × (p < 0.20 ? 0.5 : 1)
 *
 * p평균 · interest 는 js/data/questions.js 의 시즌 전체(GLOBAL) 값이다.
 * 실제 서버는 상황 조합의 흥미도를 쓰므로, 여기서는 흥미도를 고정값으로 둔다고 안내한다.
 * 아무것도 서버로 보내지 않는다.
 */

import { QUESTIONS, CATEGORIES } from "../../data/questions.js";
import { SCORE_TERMS } from "./proof.data.js";
import { $, $$, escapeHtml } from "../../shared/utils.js";

const W = Object.fromEntries(SCORE_TERMS.map((t) => [t.key, t.weight]));
const DECAY = 0.5;
const LOW_THRESHOLD = 0.2;
const LOW_PENALTY = 0.5;

export function score(p, pGlobal, interest, appeared) {
  const deviation = Math.min(Math.abs(p - pGlobal) / Math.max(pGlobal, 0.05), 1);
  const balance = Math.max(1 - 2 * Math.abs(p - 0.5), 0);
  const base = W.deviation * deviation + W.interest * interest + W.balance * balance;
  const decay = DECAY ** appeared;
  const low = p < LOW_THRESHOLD ? LOW_PENALTY : 1;
  return { deviation, balance, base, decay, low, total: base * decay * low };
}

export function initScoreCalc() {
  const root = $(".calc");
  if (!root) return;
  const select = $(".calc__type", root);
  const slider = $(".calc__p", root);
  const pOut = $(".calc__p-out", root);
  const result = $(".calc__result", root);
  const seenButtons = $$("[data-seen]", root);

  const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  CATEGORIES.forEach((c) => {
    const group = document.createElement("optgroup");
    group.label = c.label;
    QUESTIONS.filter((q) => q.cat === c.id).forEach((q) => {
      const o = document.createElement("option");
      o.value = q.code;
      o.textContent = `${q.q} (평균 ${(q.p * 100).toFixed(1)}%)`;
      group.append(o);
    });
    if (group.children.length) select.append(group);
  });

  let appeared = 0;
  select.value = "RUN";
  slider.value = "40";

  function render() {
    const q = QUESTIONS.find((x) => x.code === select.value) ?? QUESTIONS[0];
    const p = Number(slider.value) / 100;
    pOut.textContent = `${slider.value}%`;
    seenButtons.forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.seen) === appeared)));
    const s = score(p, q.p, q.interest, appeared);
    const row = (label, value) => `
      <div class="calc__row">
        <span><b>${label}</b></span>
        <span class="calc__bar"><i style="width:${(value * 100).toFixed(1)}%"></i></span>
        <span class="num">${value.toFixed(3)}</span>
      </div>`;
    const flags = [];
    if (s.low < 1) flags.push(`<span class="calc__flag">20% 미만 · 절반 감점</span>`);
    if (appeared) flags.push(`<span class="calc__flag">재등장 × ${s.decay}</span>`);
    result.innerHTML = `
      <div class="calc__rows">
        ${row("상황 특이도", s.deviation)}
        ${row("흥미도", q.interest)}
        ${row("균형", s.balance)}
      </div>
      <div class="calc__total">
        <span>${escapeHtml(catLabel[q.cat])} · 평균 ${(q.p * 100).toFixed(1)}% → 지금 ${slider.value}% ${flags.join(" ")}</span>
        <code>(0.45×${s.deviation.toFixed(3)} + 0.35×${q.interest.toFixed(3)} + 0.20×${s.balance.toFixed(3)})${appeared ? ` × ${s.decay}` : ""}${s.low < 1 ? " × 0.5" : ""} = <b>${s.total.toFixed(3)}</b></code>
      </div>`;
  }

  select.addEventListener("change", render);
  slider.addEventListener("input", render);
  seenButtons.forEach((b) => b.addEventListener("click", () => { appeared = Number(b.dataset.seen); render(); }));
  render();
}
