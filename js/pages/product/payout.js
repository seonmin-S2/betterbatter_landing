/**
 * js/pages/product/payout.js
 * ---------------------------------------------------------------------------
 * 파리뮤추얼 정산 — 포인트 규칙 네 칸, 배당 공식의 풀이 예시, 경험치 규칙.
 * 예시 숫자는 전부 payoutMath.js(= Payout.java)로 계산한다. 손으로 적은 결과가 없다.
 */

import { POINT_RULES, PAYOUT, XP_RULES } from "./product.data.js";
import { ratio, expectedPayout } from "./payoutMath.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

const n = (v) => v.toLocaleString("ko-KR");

export function initPayout() {
  const rules = $(".payout__rules");
  if (rules) {
    POINT_RULES.forEach((r) => rules.append(el("div", {
      className: "payout__rule",
      html: `<b class="num">${escapeHtml(r.value)}</b><span>${escapeHtml(r.label)}</span><small>${escapeHtml(r.note)}</small>`,
    })));
  }

  /* 풀이 예시 — YES 가 이겼을 때 */
  const worked = $(".payout__worked");
  if (worked) {
    const { yes, no, stake } = PAYOUT.example;
    const rule = { seed: PAYOUT.seed, cap: PAYOUT.cap };
    const r = ratio({ yes, no }, true, rule);
    const mine = expectedPayout({ yes, no }, "yes", stake, rule);
    worked.innerHTML = `
      <div class="payout__pools">
        <div class="payout__pool is-yes"><span>YES 풀</span><b class="num">${n(yes)}P</b><small>시드 ${PAYOUT.seed}P 포함</small></div>
        <div class="payout__pool is-no"><span>NO 풀</span><b class="num">${n(no)}P</b><small>시드 ${PAYOUT.seed}P 포함</small></div>
      </div>
      <ol class="payout__steps">
        <li><span>참여자가 낸 총풀</span><code>${n(yes)} + ${n(no)} − ${PAYOUT.seed}×2 = <b>${n(yes + no - PAYOUT.seed * 2)}P</b></code></li>
        <li><span>이긴 쪽(YES) 참여자 풀</span><code>${n(yes)} − ${PAYOUT.seed} = <b>${n(yes - PAYOUT.seed)}P</b></code></li>
        <li><span>배당</span><code>${n(yes + no - PAYOUT.seed * 2)} ÷ ${n(yes - PAYOUT.seed)} = <b>${r.toFixed(2)}배</b></code></li>
        <li><span>지금 YES에 ${n(stake)}P를 더하면 — 내 참여도 풀에 들어가 배당이 내려갑니다</span><code>(${n(yes + no - PAYOUT.seed * 2)} + ${n(stake)}) ÷ (${n(yes - PAYOUT.seed)} + ${n(stake)}) = <b>${mine.ratio.toFixed(2)}배</b></code><code>${n(stake)} × ${mine.ratio.toFixed(4)}… → 적중 시 <b>${n(mine.payout)}P</b> (버림)</code></li>
      </ol>`;
  }

  const xp = $(".payout__xp");
  if (xp) {
    XP_RULES.forEach((r) => xp.append(el("li", {
      html: `<b class="num">${escapeHtml(r.value)}</b><span>${escapeHtml(r.label)}</span>`,
    })));
  }
}
