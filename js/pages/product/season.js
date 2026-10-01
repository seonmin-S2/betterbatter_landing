/**
 * js/pages/product/season.js
 * ---------------------------------------------------------------------------
 * 시즌 · 티어 · 업적 — 티어 7단계 사다리와 업적 8종.
 * 배지와 업적 그림은 앱의 원본(ui/public)을 그대로 옮겨 왔다.
 */

import { TIERS, ACHIEVEMENTS } from "./product.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initSeason() {
  const ladder = $(".season__tiers");
  if (ladder) {
    TIERS.forEach((t, i) => ladder.append(el("li", {
      className: "season__tier",
      style: { "--i": String(i) },
      attrs: { "data-reveal": "" },
      html: `<img src="assets/app/tiers/${t.code.toLowerCase()}.webp" alt="" width="96" height="96" loading="lazy">
             <b>${escapeHtml(t.code)}</b><span class="num">${t.min.toLocaleString("ko-KR")} XP</span>`,
    })));
    window.__bbObserveReveal?.(ladder);
  }

  const grid = $(".season__badges");
  if (grid) {
    ACHIEVEMENTS.forEach((a) => grid.append(el("li", {
      className: "season__badge",
      attrs: { "data-rarity": a.rarity },
      html: `<img src="assets/app/achievements/${a.id}.webp" alt="" width="88" height="88" loading="lazy">
             <span class="season__badge-rarity">${escapeHtml(a.rarity)}</span>
             <b>${escapeHtml(a.name)}</b>
             <small>${escapeHtml(a.detail)} · ${escapeHtml(a.goal)}</small>`,
    })));
  }
}
