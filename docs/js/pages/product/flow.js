/**
 * js/pages/product/flow.js
 * ---------------------------------------------------------------------------
 * 사용 흐름 5장면 — 왼쪽 단계 목록(탭)을 고르면 오른쪽에 실제 앱 화면이 바뀐다.
 * 넓은 화면은 데스크톱 캡처(1440×900), 좁은 화면은 모바일 캡처(390×844)를 쓴다.
 *
 * 탭 규약: role="tablist" · ← → Home End 키 이동 · aria-selected
 * 글: product.data.js 의 FLOW
 */

import { FLOW } from "./product.data.js";
import { $, $$, el, escapeHtml } from "../../shared/utils.js";

export function initFlow() {
  const list = $(".flow__steps");
  const view = $(".flow__view");
  if (!list || !view) return;

  const picture = el("picture", {
    html: `<source media="(max-width: 760px)" srcset=""><img class="flow__img" src="" alt="" width="2880" height="1800" decoding="async">`,
  });
  const caption = el("div", { className: "flow__caption", attrs: { "aria-live": "polite" } });
  view.append(picture, caption);
  const source = $("source", picture);
  const img = $("img", picture);

  FLOW.forEach((step, i) => {
    list.append(el("button", {
      className: "flow__step",
      attrs: { type: "button", role: "tab", id: `flow-tab-${i}`, "aria-controls": "flow-view", "aria-selected": "false" },
      html: `<span class="flow__num num">${String(i + 1).padStart(2, "0")}</span><span class="flow__label">${escapeHtml(step.label)}</span>`,
      on: { click: () => show(i) },
    }));
  });

  // 다른 장면의 이미지를 미리 받아 둔다 — 탭을 누를 때 빈 화면이 깜빡이지 않게
  const narrow = window.matchMedia("(max-width: 760px)");
  const preload = () => FLOW.forEach((s) => { const p = new Image(); p.src = `assets/screens/${s.shot}-${narrow.matches ? "m" : "d"}.webp`; });

  let current = 0;
  function show(i) {
    current = i;
    const step = FLOW[i];
    source.srcset = `assets/screens/${step.shot}-m.webp`;
    img.src = `assets/screens/${step.shot}-d.webp`;
    img.alt = step.alt;
    caption.innerHTML = `<p class="flow__title">${escapeHtml(step.title)}</p><p class="flow__body">${escapeHtml(step.body)}</p>`;
    view.setAttribute("aria-labelledby", `flow-tab-${i}`);
    $$(".flow__step", list).forEach((tab, k) => {
      tab.setAttribute("aria-selected", String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
  }

  list.addEventListener("keydown", (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (event.key in keys) next = (current + keys[event.key] + FLOW.length) % FLOW.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = FLOW.length - 1;
    if (next === null) return;
    event.preventDefault();
    show(next);
    $$(".flow__step", list)[next].focus();
  });

  show(0);
  if ("requestIdleCallback" in window) requestIdleCallback(preload); else setTimeout(preload, 1200);
}
