/**
 * js/pages/tech/pipeline.js
 * ---------------------------------------------------------------------------
 * 데이터 파이프라인 — OFFLINE · LIVE 두 줄, GUMBO 함정 표, 리플레이 요약.
 */

import { OFFLINE, LIVE, PITFALLS, REPLAY } from "./tech.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initPipeline() {
  const offline = $(".lane__steps--offline");
  if (offline) {
    offline.style.setProperty("--n", String(OFFLINE.length));
    OFFLINE.forEach((s) => offline.append(el("li", {
      className: "lane__step",
      html: `<p class="lane__value"><b class="num">${escapeHtml(s.value)}</b><span>${escapeHtml(s.unit)}</span></p>
             ${/^[a-z_]+$/.test(s.label) ? `<code>${escapeHtml(s.label)}</code>` : `<span class="lane__label">${escapeHtml(s.label)}</span>`}<small>${escapeHtml(s.detail)}</small>`,
    })));
  }

  const live = $(".lane__steps--live");
  if (live) {
    live.style.setProperty("--n", String(LIVE.length));
    LIVE.forEach((s) => live.append(el("li", {
      className: "lane__step",
      html: `<b>${escapeHtml(s.title)}</b><p>${escapeHtml(s.body)}</p>`,
    })));
  }

  const pitfalls = $(".pipeline__pitfalls");
  PITFALLS.forEach((p) => pitfalls?.append(el("tr", {
    html: `<td><code>${escapeHtml(p.field)}</code></td><td><b>${escapeHtml(p.trap)}</b></td><td data-label="대응">${escapeHtml(p.fix)}</td>`,
  })));

  const replay = $(".replay__facts");
  REPLAY.forEach((r) => replay?.append(el("li", {
    html: `<b>${escapeHtml(r.value)}</b><span>${escapeHtml(r.label)}</span><small>${escapeHtml(r.detail)}</small>`,
  })));
}
