/**
 * js/pages/tech/chain.js
 * ---------------------------------------------------------------------------
 * 블록체인 설계 — 테스트넷 실측 수치, 컨트랙트의 다섯 가지 보장, 기록 순서.
 * 운영 비활성 안내 문구와 외부 링크는 tech.html 에 정적으로 둔다.
 */

import { CHAIN_RUN, GUARANTEES, CHAIN_ORDER } from "./tech.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initChain() {
  const run = $(".chain__run");
  CHAIN_RUN.forEach((r) => run?.append(el("li", {
    html: `<b class="num">${escapeHtml(r.value)}</b><span>${escapeHtml(r.label)}</span><small>${escapeHtml(r.detail)}</small>`,
  })));

  const guarantees = $(".chain__guarantees");
  GUARANTEES.forEach((g) => guarantees?.append(el("li", {
    html: `<b>${escapeHtml(g.title)}</b><span><code>${escapeHtml(g.fn)}</code> — ${escapeHtml(g.body)}</span>`,
  })));

  const order = $(".chain__order");
  CHAIN_ORDER.forEach((o, i) => order?.append(el("li", {
    className: i >= 3 ? "is-async" : "",
    html: `<span class="num">${i + 1}</span><b>${escapeHtml(o.step)}</b><span>${escapeHtml(o.mode)}</span>`,
  })));
}
