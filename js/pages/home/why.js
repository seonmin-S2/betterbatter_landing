/**
 * js/pages/home/why.js
 * ---------------------------------------------------------------------------
 * 기획 배경 — 세 가지 기준 카드. 데이터는 home.data.js 의 WHY.
 * 번호는 순서대로 붙이고, tone 은 카드 위 색 띠(--tone)로 쓴다.
 * 본문의 " · " 앞 공백은 줄바꿈되지 않게 바꿔, 가운뎃점이 줄 맨 앞에 오지 않게 한다.
 */

import { WHY } from "./home.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initWhy() {
  const host = $(".why");
  if (!host) return;

  WHY.forEach((item, i) => {
    host.append(el("li", {
      className: "why__card",
      attrs: { "data-reveal": "", style: `--tone: var(--market-${item.tone})` },
      html: `<span class="why__num num">${String(i + 1).padStart(2, "0")}</span>
             <b class="why__title">${escapeHtml(item.title)}</b>
             <p class="why__body">${escapeHtml(item.body).replace(/ · /g, " · ")}</p>`,
    }));
  });
  window.__bbObserveReveal?.(host);
}
