/**
 * js/pages/product/questionGrid.js
 * ---------------------------------------------------------------------------
 * 질문 테이블 — 계열 필터 · "9월 30일에 출제된 유형만" 스위치 · 카드 그리드.
 * 카드는 2025 시즌 43,202개 하프이닝에서 실제로 일어난 비율(p)이 높은 순으로 놓는다.
 * 계열은 카드 색과 필터로 구분한다. 카드를 누르면 판정 기준이 펼쳐진다.
 *
 * 데이터: js/data/questions.js (서버 코드 · 확률 시드에서 옮긴 값)
 */

import { CATEGORIES, QUESTIONS, COLLECTED_TOTAL } from "../../data/questions.js";
import { $, $$, el, escapeHtml } from "../../shared/utils.js";

const pct = (v) => `${(v * 100).toFixed(1)}%`;

export function initQuestionGrid() {
  const host = $(".questions");
  if (!host) return;

  const filters = $(".questions__filters", host);
  const grid = $(".questions__grid", host);
  const seenToggle = $(".questions__seen", host);
  const summary = $(".questions__summary", host);
  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  const seenTypes = QUESTIONS.filter((q) => q.seen > 0).length;
  if (summary) {
    summary.innerHTML = `2026-09-30 수집한 4경기 <b class="num">${COLLECTED_TOTAL}</b>개 질문에 <b class="num">${seenTypes}</b>개 유형이 나왔습니다 · 2025 시즌 발생 비율이 높은 순`;
  }

  let category = "ALL";
  let seenOnly = false;

  /* 계열 필터 칩 */
  const chips = [{ id: "ALL", label: "전체", count: QUESTIONS.length }, ...CATEGORIES.map((c) => ({
    id: c.id, label: c.label, count: QUESTIONS.filter((q) => q.cat === c.id).length,
  }))];
  chips.forEach((chip) => {
    filters.append(el("button", {
      className: "chip chip--toggle",
      attrs: { type: "button", "aria-pressed": String(chip.id === "ALL"), "data-cat": chip.id },
      html: `${escapeHtml(chip.label)} <span class="num">${chip.count}</span>`,
      on: { click: () => { category = chip.id; render(); } },
    }));
  });

  seenToggle?.addEventListener("click", () => {
    seenOnly = !seenOnly;
    seenToggle.setAttribute("aria-checked", String(seenOnly));
    render();
  });

  /* 카드 — 한 번만 만들고 필터는 hidden 으로만 바꾼다 */
  const byRate = [...QUESTIONS].sort((a, b) => b.p - a.p);
  const cards = byRate.map((q) => {
    const cat = catById[q.cat];
    const card = el("article", {
      className: "qcard",
      attrs: { "data-cat": q.cat, "data-seen": String(q.seen > 0) },
      style: { "--tone": `var(--market-${cat.tone})` },
      html: `
        <button class="qcard__head" type="button" aria-expanded="false">
          <span class="qcard__meta"><span class="qcard__cat">${escapeHtml(cat.label)}</span>
            ${q.seen ? `<span class="qcard__seen">9/30 출제 <b class="num">${q.seen}</b>회</span>` : ""}</span>
          <span class="qcard__q">${escapeHtml(q.q)}</span>
          <span class="qcard__p">
            <span class="qcard__bar"><i style="width:${(q.p * 100).toFixed(1)}%"></i></span>
            <span class="qcard__pv">평균 <b class="num">${pct(q.p)}</b></span>
          </span>
        </button>
        <p class="qcard__res" hidden>${escapeHtml(q.res)}</p>`,
    });
    const head = $(".qcard__head", card);
    const res = $(".qcard__res", card);
    head.addEventListener("click", () => {
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      res.hidden = open;
    });
    grid.append(card);
    return card;
  });

  function render() {
    $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === category)));
    cards.forEach((card) => {
      const show = (category === "ALL" || card.dataset.cat === category) && (!seenOnly || card.dataset.seen === "true");
      card.hidden = !show;
    });
  }
  render();
}
