/**
 * js/pages/tech/stacks.js
 * ---------------------------------------------------------------------------
 * 기술 스택 — 영역별 칩 묶음.
 */

import { STACKS } from "./tech.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initStacks() {
  const root = $(".stacks");
  STACKS.forEach((s) => root?.append(el("div", {
    className: "stack",
    html: `<p>${escapeHtml(s.group)}</p><ul>${s.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`,
  })));
}
