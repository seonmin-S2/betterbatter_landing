/**
 * js/pages/proof/deadline.js
 * ---------------------------------------------------------------------------
 * 마감 처리 섹션 — 무효 사유 표 · 피드 상태 표.
 */

import { VOID_RULES, FEED_HEALTH } from "./proof.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initDeadline() {
  const voids = $(".deadline__voids");
  VOID_RULES.forEach((v) => voids?.append(el("tr", {
    html: `<td><code>${escapeHtml(v.code)}</code></td><td><b>${escapeHtml(v.when)}</b><br>${escapeHtml(v.why)}</td>`,
  })));

  const health = $(".deadline__health");
  FEED_HEALTH.forEach((h) => health?.append(el("tr", {
    html: `<td><code>${escapeHtml(h.state)}</code></td><td>${escapeHtml(h.limit)}</td><td>${escapeHtml(h.effect)}</td>`,
  })));
}
