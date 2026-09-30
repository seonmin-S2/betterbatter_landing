/**
 * js/pages/home/heroFacts.js
 * ---------------------------------------------------------------------------
 * 히어로 아래 요약 수치 네 개. 화면에 들어오면 0부터 세어 올라간다.
 * 값은 js/pages/home/home.data.js의 HERO_FACTS에 있다.
 */

import { HERO_FACTS } from "./home.data.js";
import { $, el, countUp, onceInView, decimalsOf } from "../../shared/utils.js";

export function initHeroFacts() {
  const host = $(".hero__facts");
  if (!host) return;

  HERO_FACTS.forEach((fact) => {
    const value = el("div", { className: "hero__fact-value num" });
    const number = el("span", { text: "0" });
    value.append(number, el("span", { className: "hero__fact-suffix", text: fact.suffix }));

    const block = el("div", {
      children: [value, el("div", { className: "hero__fact-label", text: fact.label })],
    });

    host.append(block);

    onceInView(block, () =>
      countUp(number, Number(fact.value), { decimals: decimalsOf(fact.value), duration: 1400 })
    );
  });
}
