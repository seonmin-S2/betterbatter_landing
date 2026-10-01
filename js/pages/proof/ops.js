/**
 * js/pages/proof/ops.js
 * ---------------------------------------------------------------------------
 * 운영 검증 섹션 — 자동화된 테스트 수 · CI 파이프라인 · 부하 검증 표.
 */

import { TEST_COUNTS, PIPELINE, LOAD_STEPS } from "./proof.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initOps() {
  const counts = $(".ops__counts");
  TEST_COUNTS.forEach((c) => counts?.append(el("li", {
    className: "ops__count",
    html: `<b class="num">${escapeHtml(c.value)}</b><span>${escapeHtml(c.label)}</span><small>${escapeHtml(c.detail)}</small>`,
  })));

  const pipeline = $(".ops__pipeline");
  PIPELINE.forEach((s) => pipeline?.append(el("div", {
    className: "ops__stage",
    html: `<p>${escapeHtml(s.stage)}</p><ul>${s.jobs.map((j) => `<li>${escapeHtml(j)}</li>`).join("")}</ul>`,
  })));

  const load = $(".ops__load");
  LOAD_STEPS.forEach((r) => load?.append(el("tr", {
    html: `<td><b>${escapeHtml(r.target)}</b></td><td class="num" data-label="성공">${escapeHtml(r.ok)}</td>` +
          `<td class="num" data-label="p95">${escapeHtml(r.p95)}</td><td class="num" data-label="최대">${escapeHtml(r.max)}</td><td class="num" data-label="WS">${escapeHtml(r.ws)}</td>`,
  })));
}
