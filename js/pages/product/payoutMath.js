/**
 * js/pages/product/payoutMath.js
 * ---------------------------------------------------------------------------
 * 파리뮤추얼 배당 — api/.../worker/Payout.java 를 그대로 옮겼다.
 *
 *   배당 = min( (총풀 − 시드×2) / (승리풀 − 시드), 상한 )
 *
 * 시드는 투표 중 화면을 안정시키려고 양쪽에 넣는 100P다. 사람이 낸 포인트가 아니므로
 * 정산 때 총풀에서 빼고 소각한다 — 그래야 참여자가 낸 만큼 참여자가 가져간다(제로섬).
 * 상한(30배)에서 잘린 몫은 지급하지 않는다.
 */

/**
 * @param {{yes:number, no:number}} pool  시드를 포함한 현재 풀
 * @param {boolean} yesWins
 * @param {{seed:number, cap:number}} rule
 * @returns {number|null} 배당률. 승리 쪽 실제 참여자가 없으면 null (무효 · 환급)
 */
export function ratio(pool, yesWins, { seed, cap }) {
  const total = pool.yes + pool.no - seed * 2;
  const winning = (yesWins ? pool.yes : pool.no) - seed;
  if (winning <= 0) return null;
  // 서버는 소수 여섯째 자리에서 버린다
  return Math.min(Math.floor((total / winning) * 1e6) / 1e6, cap);
}

/** 참여 1건의 수령액. 진 쪽은 0, 소수점 아래는 버린다 */
export function payoutFor(amount, r, won) {
  if (!won || r === null) return 0;
  return Math.floor(amount * r);
}

/** 내 참여를 풀에 더한 뒤의 예상 수령액 — 앱의 "적중 시 예상"과 같은 계산 */
export function expectedPayout(pool, side, amount, rule) {
  const next = { yes: pool.yes + (side === "yes" ? amount : 0), no: pool.no + (side === "no" ? amount : 0) };
  const r = ratio(next, side === "yes", rule);
  return { ratio: r, payout: payoutFor(amount, r, true), pool: next };
}
