/**
 * js/data/icons.js
 * ---------------------------------------------------------------------------
 * 아이콘 원본. lucide 아이콘의 path 데이터를 그대로 옮겨 왔다.
 * (BetterBatter 앱이 lucide-react를 쓰므로 랜딩도 같은 선 굵기 · 같은 모양을 쓴다)
 *
 * 여기에는 "path 안쪽 마크업"만 담는다. <svg> 껍데기는 icon()이 씌운다.
 * 색은 CSS의 currentColor를 따라가므로, 쓰는 쪽에서 color만 정해 주면 된다.
 *
 * lucide 아이콘은 ISC License로 배포된다. © Lucide Contributors
 */

export const ICONS = {
  chevronDown:
    '<path d="m6 9 6 6 6-6"/>',
  chevronLeft:
    '<path d="m15 18-6-6 6-6"/>',
  chevronRight:
    '<path d="m9 18 6-6-6-6"/>',
  arrowRight:
    '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowUpRight:
    '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  check:
    '<path d="M20 6 9 17l-5-5"/>',
  x:
    '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  play:
    '<path d="M6 4.5v15l13-7.5z"/>',
  pause:
    '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  volume:
    '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/>',
  volumeOff:
    '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  maximize:
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  rotate:
    '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  search:
    '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  user:
    '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar:
    '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  messageCircle:
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  sparkle:
    '<path d="M12 3 13.9 8.6 19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z"/>',
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  server:
    '<rect width="18" height="7" x="3" y="4" rx="2"/><rect width="18" height="7" x="3" y="13" rx="2"/><path d="M7 7.5h.01"/><path d="M7 16.5h.01"/>',
  layers:
    '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.4 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
};

/**
 * 아이콘 SVG 문자열을 만든다.
 * lucide 기본 속성(24×24 / fill:none / stroke-width:2 / round)을 그대로 쓴다.
 * stroke는 currentColor이므로 부모의 color를 따라간다.
 *
 * @param {keyof typeof ICONS} name
 * @param {number} [size=24]
 * @returns {string} <svg>…</svg>
 */
export function icon(name, size = 24) {
  const body = ICONS[name];
  if (!body) {
    console.warn(`[icons] "${name}" 아이콘이 없습니다.`);
    return "";
  }
  return (
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" ` +
    `stroke="currentColor" stroke-width="2" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`
  );
}
