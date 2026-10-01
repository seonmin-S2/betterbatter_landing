/**
 * js/pages/tech/architecture.js
 * ---------------------------------------------------------------------------
 * 시스템 아키텍처 — API 서버 상자 안의 패키지 목록을 채운다.
 * 상자 · 연결선 · 배포 흐름은 tech.html 의 정적 마크업이다.
 */

import { PACKAGES } from "./tech.data.js";
import { $, el, escapeHtml } from "../../shared/utils.js";

export function initArchitecture() {
  const list = $(".arch__packages");
  PACKAGES.forEach((p) => list?.append(el("li", {
    className: "arch__pkg",
    html: `<code>${escapeHtml(p.name)}</code><span>${escapeHtml(p.role)}</span>` +
          (p.note ? `<small>${escapeHtml(p.note)}</small>` : ""),
  })));
}
