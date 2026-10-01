/**
 * js/pages/principles/principles.js
 * ---------------------------------------------------------------------------
 * 원칙 페이지 — 포인트 흐름 · 포인트 규칙 · 법령별 설계 대응 · 개인정보 원칙.
 * 글은 principles.data.js 에 있다.
 */

import { POINT_RULES, POINT_FLOW, LAWS, PRIVACY } from "./principles.data.js";
import { icon } from "../../data/icons.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initPrinciples() {
  const open = $(".pflow__open");
  POINT_FLOW.open.forEach((step, i) => open?.append(el("li", {
    html: `<span class="num">0${i + 1}</span>${escapeHtml(step)}`,
  })));

  const closed = $(".pflow__closed");
  POINT_FLOW.closed.forEach((exit) => closed?.append(el("li", {
    html: `${icon("x", 14)}<span>${escapeHtml(exit)}</span>`,
  })));

  const rules = $(".prules");
  POINT_RULES.forEach((r) => rules?.append(el("li", {
    className: "prule",
    attrs: { "data-reveal": "" },
    html: `<span class="prule__icon">${icon(r.icon, 20)}</span><b>${escapeHtml(r.title)}</b><p>${escapeHtml(r.body)}</p>`,
  })));
  if (rules) window.__bbObserveReveal?.(rules);

  const laws = $(".laws");
  LAWS.forEach((l) => laws?.append(el("article", {
    className: "law",
    attrs: { "data-reveal": "" },
    html: `<div class="law__name"><b>${escapeHtml(l.law)}</b><span>${escapeHtml(l.topic)}</span></div>
           <div class="law__risk"><span class="law__label">문제 삼는 것</span><p>${escapeHtml(l.risk)}</p></div>
           <div class="law__answer"><span class="law__label">설계 대응</span>
             <ul>${l.answer.map((a) => `<li>${icon("check", 15)}${escapeHtml(a)}</li>`).join("")}</ul></div>`,
  })));
  if (laws) window.__bbObserveReveal?.(laws);

  const privacy = $(".privacy__grid");
  PRIVACY.forEach((p) => privacy?.append(el("li", {
    className: "privacy__item",
    attrs: { "data-reveal": "" },
    html: `<b>${escapeHtml(p.title)}</b><p>${escapeHtml(p.body)}</p>`,
  })));
  if (privacy) window.__bbObserveReveal?.(privacy);
}
