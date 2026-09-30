/**
 * js/pages/proof/oracle.js
 * ---------------------------------------------------------------------------
 * 결과 판정 섹션 — 교차검증 8종 칩 · 근거 JSON 항목 · 원문 대조 검증 결과.
 * 칩 이름은 js/data/questions.js 의 질문 문구를 그대로 쓴다.
 */

import { CROSS_CHECKED, EVIDENCE_FIELDS, GROUND_TRUTH } from "./proof.data.js";
import { QUESTIONS } from "../../data/questions.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initOracle() {
  const chips = $(".oracle__chips");
  CROSS_CHECKED.forEach((code) => {
    const q = QUESTIONS.find((x) => x.code === code);
    chips?.append(el("li", { html: `<b>${escapeHtml(code)}</b>${escapeHtml(q ? q.q : code)}` }));
  });

  const evidence = $(".oracle__evidence");
  EVIDENCE_FIELDS.forEach((f) => evidence?.append(el("li", { text: f })));

  const g = GROUND_TRUTH;
  const games = $(".truth__games");
  if (games) games.textContent = String(g.games);
  const halves = $(".truth__halves");
  if (halves) halves.textContent = String(g.halves);
  const pitch = $(".truth__pitch");
  if (pitch) {
    pitch.innerHTML =
      `투구 수는 타석별 투구 번호로 따로 세어 <b class="num">${g.pitches}</b>개가 정확히 일치했습니다. ` +
      `피드에 섞인 비투구 이벤트(선수 교체 · 견제 등) <b class="num">${g.nonPitch}</b>개를 거르지 않았다면 ` +
      `투구 수가 <b class="num">${g.inflation}</b> 부풀어 투구 수 질문 세 종류의 확률이 통째로 어긋났을 것입니다.`;
  }

  const list = $(".truth__defects");
  g.defects.forEach((d) => list?.append(el("li", {
    className: "truth__defect",
    html: `<div class="truth__defect-head"><code>${escapeHtml(d.code)}</code><b>${escapeHtml(d.title)}</b></div>
           <p>${escapeHtml(d.body)}</p>
           ${d.from ? `<p class="truth__fix">시즌 확률 ${escapeHtml(d.from)} → <b>${escapeHtml(d.to)}</b></p>` : ""}`,
  })));
}
