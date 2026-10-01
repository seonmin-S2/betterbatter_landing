/**
 * js/pages/proof/selection.js
 * ---------------------------------------------------------------------------
 * 질문 선정 섹션 — 점수 요소 · 감점 · 제외 규칙 · 컨텍스트 폴백 · 튜닝 표 ·
 * 9월 30일 실제 출제 61개의 기준 확률 분포.
 * 글과 수치는 proof.data.js 에 있다.
 */

import { SCORE_TERMS, PENALTIES, EXCLUSIONS, CONTEXT_CHAIN, TUNING, REAL_BASES } from "./proof.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initSelection() {
  const terms = $(".select__terms");
  SCORE_TERMS.forEach((t) => terms?.append(el("li", {
    className: "select__term",
    html: `<div class="select__term-head"><b>${escapeHtml(t.label)}</b><span>× ${t.weight.toFixed(2)}</span></div>
           <code>${escapeHtml(t.formula)}</code>
           <p>${escapeHtml(t.body)}</p>`,
  })));

  const penalties = $(".select__penalties");
  PENALTIES.forEach((p) => penalties?.append(el("li", {
    className: "select__penalty",
    html: `<b>${escapeHtml(p.label)}</b><span>${escapeHtml(p.value)}</span><p>${escapeHtml(p.body)}</p>`,
  })));

  const exclusions = $(".select__exclusions");
  EXCLUSIONS.forEach((x) => exclusions?.append(el("li", {
    html: `<b>${escapeHtml(x.rule)}</b>${escapeHtml(x.detail)}`,
  })));

  const chain = $(".select__chain");
  CONTEXT_CHAIN.forEach((c) => chain?.append(el("li", {
    html: `<span class="num">L${c.level}</span><code>${escapeHtml(c.key)}</code><span>${escapeHtml(c.label)}</span>`,
  })));

  const tuning = $(".select__tuning-rows");
  TUNING.forEach((r) => tuning?.append(el("tr", {
    html: `<td>${escapeHtml(r.label)}</td><td class="num">${escapeHtml(r.before)}</td><td class="num">${escapeHtml(r.after)}</td>`,
  })));

  renderHistogram();
}

/** 0.15 ~ 0.80 을 0.05 폭 13칸으로 나눠 막대를 세운다 */
function renderHistogram() {
  const plot = $(".hist__plot");
  if (!plot) return;
  const from = 0.15;
  const step = 0.05;
  const bins = 13;
  const counts = Array(bins).fill(0);
  REAL_BASES.forEach((p) => {
    const i = Math.min(bins - 1, Math.max(0, Math.floor((p - from) / step + 1e-9)));
    counts[i] += 1;
  });
  const peak = Math.max(...counts);
  plot.style.setProperty("--bins", String(bins));

  // 0.40~0.60 띠 — 칸 5~8
  const band = el("div", { className: "hist__band", html: "<span>40~60%</span>" });
  band.style.left = `calc(${(5 / bins) * 100}% + 2px)`;
  band.style.width = `calc(${(4 / bins) * 100}% - 4px)`;
  plot.append(band);

  counts.forEach((c, i) => {
    const lo = from + i * step;
    plot.append(el("span", {
      className: `hist__bar${lo < 0.2 ? " is-low" : ""}`,
      style: { "--h": `${(c / peak) * 100}%` },
      attrs: { title: `${Math.round(lo * 100)}~${Math.round((lo + step) * 100)}% · ${c}개` },
      html: c ? `<b class="num">${c}</b>` : "",
    }));
  });
  [0.2, 0.4, 0.6, 0.8].forEach((v) => {
    plot.append(el("span", {
      className: "hist__tick",
      style: { left: `${((v - from) / (step * bins)) * 100}%` },
      text: `${Math.round(v * 100)}%`,
    }));
  });

  const sorted = [...REAL_BASES].sort((a, b) => a - b);
  const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  const n = sorted.length;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const mid = sorted.filter((v) => v >= 0.3 && v <= 0.7).length;
  const low = sorted.filter((v) => v < 0.2).length;
  plot.setAttribute("aria-label",
    `기준 확률 분포 막대그래프. 61개 중 30~70% 구간 ${mid}개, 20% 미만 ${low}개`);
  $(".hist__stats").innerHTML =
    `평균 <b class="num">${(mean * 100).toFixed(1)}%</b> · 중앙값 <b class="num">${(median * 100).toFixed(1)}%</b> · ` +
    `30~70% 구간 <b class="num">${mid}</b>/${sorted.length}개. 20% 미만은 <b class="num">${low}</b>개로, ` +
    `감점을 받고도 상위 후보에 남은 경우입니다. 과거 경기 재생에서 얻은 평균 41.1%와 거의 같습니다.`;
}
