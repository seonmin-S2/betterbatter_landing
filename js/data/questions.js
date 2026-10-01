/**
 * js/data/questions.js
 * ---------------------------------------------------------------------------
 * 하프이닝 질문 38종. 제품 · 검증 페이지가 함께 쓴다.
 *
 * 출처 (코드를 그대로 옮겼다)
 *   · code · q · cat · sub   api/.../domain/market/QuestionType.java
 *   · res (판정 기준)         api/.../worker/QuestionTextRenderer.java#resolution
 *   · p · interest            db/migration/V7__seed_base_probabilities.sql 의 GLOBAL 행
 *                             (2025 시즌 43,202 하프이닝 전체 평균 YES 확률 · 흥미도)
 *   · seen                    2026-09-30 운영 서버 수집본 4경기 61개 질문에서 나온 횟수
 */

/** 질문 계열 — QuestionCategory.java. tone 은 앱 카드 색(QuestionTextRenderer#tone)과 같다 */
export const CATEGORIES = [
  { id: "OFFENSE", label: "타격 결과", desc: "안타 · 장타 · 득점", tone: "coral" },
  { id: "PITCHING", label: "투구 결과", desc: "삼진 · 볼넷 · 투구 수 · 투수 교체", tone: "blue" },
  { id: "STRUCTURE", label: "이닝 구조", desc: "타석 수 · 출루 인원 · 삼자범퇴", tone: "green" },
  { id: "SEQUENCE", label: "이닝 전개", desc: "주자 상황 · 잔루 · 복합 조건", tone: "green" },
  { id: "RARE", label: "희소 이벤트", desc: "홈런 · 만루 · 병살 · 실책", tone: "gold" },
];

export const QUESTIONS = [
  { code: "HIT", q: "안타가 나올까?", cat: "OFFENSE", sub: null, p: 0.5543, interest: 0.4452, seen: 5,
    res: "이 하프이닝에 안타가 1개 이상 나오면 YES 입니다." },
  { code: "HIT2", q: "안타 2개 이상 나올까?", cat: "OFFENSE", sub: null, p: 0.236, interest: 0.388, seen: 3,
    res: "이 하프이닝에 안타가 2개 이상 나오면 YES 입니다." },
  { code: "XBH", q: "장타가 나올까?", cat: "OFFENSE", sub: null, p: 0.262, interest: 0.4058, seen: 4,
    res: "이 하프이닝에 2루타·3루타·홈런이 1개 이상 나오면 YES 입니다." },
  { code: "RUN", q: "득점이 나올까?", cat: "OFFENSE", sub: "RUN_COUNT", p: 0.2733, interest: 0.4556, seen: 4,
    res: "이 하프이닝에 득점이 1점 이상 나오면 YES 입니다." },
  { code: "RUN2", q: "2점 이상 날까?", cat: "OFFENSE", sub: "RUN_COUNT", p: 0.1256, interest: 0.4429, seen: 0,
    res: "이 하프이닝에 득점이 2점 이상 나오면 YES 입니다." },
  { code: "NO_RUN", q: "무득점으로 끝날까?", cat: "OFFENSE", sub: null, p: 0.7267, interest: 0.4556, seen: 0,
    res: "이 하프이닝에 득점이 한 점도 없으면 YES 입니다." },
  { code: "SO", q: "삼진이 나올까?", cat: "PITCHING", sub: null, p: 0.661, interest: 0.0433, seen: 0,
    res: "이 하프이닝에 삼진이 1개 이상 나오면 YES 입니다." },
  { code: "SO2", q: "삼진 2개 이상 나올까?", cat: "PITCHING", sub: null, p: 0.2398, interest: 0.003, seen: 0,
    res: "이 하프이닝에 삼진이 2개 이상 나오면 YES 입니다." },
  { code: "BB", q: "볼넷이 나올까?", cat: "PITCHING", sub: null, p: 0.2861, interest: 0.1135, seen: 0,
    res: "이 하프이닝에 볼넷이 1개 이상 나오면 YES 입니다. 몸에 맞는 공은 포함하지 않습니다." },
  { code: "NO_SO_BB", q: "삼진도 볼넷도 없이 끝날까?", cat: "PITCHING", sub: null, p: 0.2383, interest: 0.0871, seen: 0,
    res: "이 하프이닝에 삼진과 볼넷이 모두 없으면 YES 입니다." },
  { code: "PITCH12", q: "투구 12개를 넘길까?", cat: "PITCHING", sub: "PITCH_COUNT", p: 0.6938, interest: 0.2196, seen: 0,
    res: "이 하프이닝에 양 팀 합계 투구 수가 13개 이상이면 YES 입니다." },
  { code: "PITCH15", q: "투구 15개를 넘길까?", cat: "PITCHING", sub: "PITCH_COUNT", p: 0.4816, interest: 0.2371, seen: 4,
    res: "이 하프이닝에 양 팀 합계 투구 수가 16개 이상이면 YES 입니다." },
  { code: "PITCH18", q: "투구 18개를 넘길까?", cat: "PITCHING", sub: "PITCH_COUNT", p: 0.3098, interest: 0.2548, seen: 1,
    res: "이 하프이닝에 양 팀 합계 투구 수가 19개 이상이면 YES 입니다." },
  { code: "FULL_COUNT", q: "풀카운트까지 가는 타석이 나올까?", cat: "PITCHING", sub: null, p: 0.4592, interest: 0.0744, seen: 1,
    res: "이 하프이닝에 3볼 2스트라이크까지 간 타석이 하나라도 있으면 YES 입니다." },
  { code: "PITCH95", q: "95마일 이상 구속이 나올까?", cat: "PITCHING", sub: null, p: 0.5622, interest: 0.0209, seen: 3,
    res: "이 하프이닝에 구속 95마일 이상인 공이 하나라도 나오면 YES 입니다." },
  { code: "PITCHER_CHANGE", q: "이번 이닝에 투수가 바뀔까?", cat: "PITCHING", sub: "PITCHER_SUBSTITUTION", p: 0.1084, interest: 0.2058, seen: 3,
    res: "이 하프이닝에 투수가 한 번이라도 바뀌면 YES 입니다." },
  { code: "PITCHER_60", q: "투수 누적 투구수가 60개를 넘길까?", cat: "PITCHING", sub: "PITCHER_SUBSTITUTION", p: 0.2553, interest: 0.04, seen: 3,
    res: "이닝을 시작한 투수의 경기 누적 투구 수가 이닝이 끝나는 시점에 61개 이상이면 YES 입니다." },
  { code: "ONE_TWO_THREE", q: "삼자범퇴로 끝날까?", cat: "STRUCTURE", sub: null, p: 0.3264, interest: 0.3833, seen: 3,
    res: "이 하프이닝에 세 타자로 이닝이 끝나면 YES 입니다." },
  { code: "AB4", q: "타석이 4번 이상 돌까?", cat: "STRUCTURE", sub: "AT_BAT_COUNT", p: 0.6197, interest: 0.3521, seen: 3,
    res: "이 하프이닝에 타석이 4번 이상 들어서면 YES 입니다." },
  { code: "AB5", q: "타석이 5번 이상 돌까?", cat: "STRUCTURE", sub: "AT_BAT_COUNT", p: 0.333, interest: 0.3463, seen: 4,
    res: "이 하프이닝에 타석이 5번 이상 들어서면 YES 입니다." },
  { code: "AB6", q: "타석이 6번 이상 돌까?", cat: "STRUCTURE", sub: "AT_BAT_COUNT", p: 0.1614, interest: 0.3769, seen: 0,
    res: "이 하프이닝에 타석이 6번 이상 들어서면 YES 입니다." },
  { code: "ONBASE2", q: "두 명 이상 출루할까?", cat: "STRUCTURE", sub: "ON_BASE_COUNT", p: 0.3688, interest: 0.3502, seen: 4,
    res: "이 하프이닝에 출루한 타자가 2명 이상이면 YES 입니다. 안타·볼넷·몸에 맞는 공·실책을 모두 포함합니다." },
  { code: "ONBASE3", q: "세 명 이상 출루할까?", cat: "STRUCTURE", sub: "ON_BASE_COUNT", p: 0.1785, interest: 0.3779, seen: 0,
    res: "이 하프이닝에 출루한 타자가 3명 이상이면 YES 입니다." },
  { code: "RISP", q: "득점권 주자가 나올까?", cat: "SEQUENCE", sub: "RUNNER_STATE", p: 0.401, interest: 0.2766, seen: 3,
    res: "이 하프이닝에 2루 또는 3루에 주자가 한 번이라도 서면 YES 입니다." },
  { code: "LOB", q: "주자를 남기고 끝날까?", cat: "SEQUENCE", sub: null, p: 0.5382, interest: 0.214, seen: 3,
    res: "이 하프이닝에 이닝이 끝날 때 루상에 주자가 남아 있으면 YES 입니다." },
  { code: "LOB2", q: "주자를 2명 이상 남길까?", cat: "SEQUENCE", sub: null, p: 0.1874, interest: 0.1677, seen: 0,
    res: "이 하프이닝에 이닝이 끝날 때 루상에 주자가 2명 이상 남아 있으면 YES 입니다." },
  { code: "NO_RUNNER", q: "주자 없이 끝날까?", cat: "SEQUENCE", sub: "RUNNER_STATE", p: 0.3569, interest: 0.31, seen: 4,
    res: "이 하프이닝에 루상에 주자가 한 번도 나가지 않으면 YES 입니다." },
  { code: "HIT_NO_RUN", q: "안타는 나오는데 득점은 없을까?", cat: "SEQUENCE", sub: null, p: 0.2853, interest: 0.091, seen: 2,
    res: "이 하프이닝에 안타는 나왔는데 득점이 없으면 YES 입니다." },
  { code: "ONB_NO_RUN", q: "출루는 있는데 득점은 없을까?", cat: "SEQUENCE", sub: null, p: 0.3996, interest: 0.0254, seen: 0,
    res: "이 하프이닝에 출루는 있었는데 득점이 없으면 YES 입니다." },
  { code: "SO_AND_HIT", q: "삼진과 안타가 모두 나올까?", cat: "SEQUENCE", sub: null, p: 0.3551, interest: 0.3062, seen: 3,
    res: "이 하프이닝에 삼진과 안타가 모두 나오면 YES 입니다." },
  { code: "RISP_NO_RUN", q: "득점권까지 가고도 못 넣을까?", cat: "SEQUENCE", sub: null, p: 0.1962, interest: 0.0132, seen: 0,
    res: "이 하프이닝에 득점권에 주자가 섰는데도 득점이 없으면 YES 입니다." },
  { code: "BB_NO_HIT", q: "안타 없이 볼넷으로만 출루할까?", cat: "SEQUENCE", sub: null, p: 0.1017, interest: 0.2435, seen: 0,
    res: "이 하프이닝에 볼넷은 나왔는데 안타가 없으면 YES 입니다." },
  { code: "HR", q: "홈런이 나올까?", cat: "RARE", sub: null, p: 0.1187, interest: 0.4553, seen: 1,
    res: "이 하프이닝에 홈런이 1개 이상 나오면 YES 입니다." },
  { code: "LOADED", q: "만루가 될까?", cat: "RARE", sub: "RUNNER_STATE", p: 0.0628, interest: 0.2479, seen: 0,
    res: "이 하프이닝에 만루가 한 번이라도 되면 YES 입니다." },
  { code: "DP", q: "병살이 나올까?", cat: "RARE", sub: null, p: 0.084, interest: 0.0955, seen: 0,
    res: "이 하프이닝에 병살이 1개 이상 나오면 YES 입니다. 삼진 뒤 주자 아웃·희생플라이 뒤 주자 아웃·삼중살도 병살로 봅니다." },
  { code: "ERROR", q: "실책으로 출루할까?", cat: "RARE", sub: null, p: 0.0231, interest: 0.0944, seen: 0,
    res: "이 하프이닝에 타자가 수비 실책으로 출루하면 YES 입니다. 주자만 실책으로 진루한 경우는 아닙니다." },
  { code: "HBP", q: "몸에 맞는 공이 나올까?", cat: "RARE", sub: null, p: 0.043, interest: 0.1133, seen: 0,
    res: "이 하프이닝에 몸에 맞는 공이 1개 이상 나오면 YES 입니다." },
  { code: "SAC", q: "희생타가 나올까?", cat: "RARE", sub: null, p: 0.0407, interest: 0.1858, seen: 0,
    res: "이 하프이닝에 희생플라이 또는 희생번트가 1개 이상 나오면 YES 입니다." },
];

/** 수집본 전체 질문 수 (seen 의 합) */
export const COLLECTED_TOTAL = 61;
