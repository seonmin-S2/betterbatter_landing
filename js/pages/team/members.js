/**
 * js/pages/team/members.js
 * ---------------------------------------------------------------------------
 * 팀원 카드 6장과 팀 요약 줄. 데이터는 team.data.js.
 * 이름 옆에 역할 칩(roles)을 나란히 두고, 아래에 소개를 둔다.
 * 소개의 " · " 앞 공백은 줄바꿈되지 않게 바꿔, 가운뎃점이 줄 맨 앞에 오지 않게 한다.
 * avatar 가 비어 있으면 이름 첫 글자를 원 안에 보여 준다.
 */

import { TEAM, MEMBERS } from "./team.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

const isPlaceholder = (text) => /OO 작성/.test(text);

export function initMembers() {
  const meta = $(".team__meta");
  if (meta) {
    meta.innerHTML =
      `<li><span>과정</span><b>${escapeHtml(TEAM.program)}</b></li>` +
      `<li><span>팀</span><b>${escapeHtml(TEAM.code)}</b></li>` +
      `<li><span>인원</span><b class="num">${MEMBERS.length}명</b></li>` +
      `<li><span>저장소 기록</span><b class="num">${escapeHtml(TEAM.repoPeriod)}</b></li>`;
  }

  const grid = $(".members");
  MEMBERS.forEach((m) => {
    const avatar = m.avatar
      ? `<img class="member__avatar" src="${escapeHtml(m.avatar)}" alt="" width="160" height="160" loading="lazy">`
      : `<span class="member__avatar is-empty" aria-hidden="true">${escapeHtml(m.name.slice(0, 1))}</span>`;
    grid?.append(el("li", {
      className: "member",
      attrs: { "data-reveal": "" },
      html: `${avatar}
             <div class="member__head">
               <b class="member__name">${escapeHtml(m.name)}</b>
               <ul class="member__roles" aria-label="역할">${(m.roles ?? []).map((r) => `<li class="member__role">${escapeHtml(r)}</li>`).join("")}</ul>
             </div>
             <p class="member__intro${isPlaceholder(m.intro) ? " placeholder-text" : ""}">${escapeHtml(m.intro).replace(/ · /g, "\u00a0· ")}</p>`,
    }));
  });
  if (grid) window.__bbObserveReveal?.(grid);
}
