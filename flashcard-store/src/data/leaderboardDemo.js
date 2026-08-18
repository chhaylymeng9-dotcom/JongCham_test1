import { DEFAULT_LEAGUES } from "../components/Leaderboard.jsx";

/* ---------- leaderboard demo roster ----------
There is no multi-user backend in this app — storage.js is a single
learner's localStorage, with no friends list, no server, and no weekly-
reset score to read. Everyone here except "me" is placeholder roster
data, the same way the Lessons tab's Biology chapters were a placeholder
before real per-deck content existed. "me" uses the real signed-in name
and the real streak (getStreak().current, passed in as `streak`); `xp`
for "me" is a fixed demo number chosen to land mid-pack so the ladder,
podium and promote/relegate zones all have something to show.
--------------------------------- */

export function leagueIndexFor(xp) {
  let idx = 0;
  DEFAULT_LEAGUES.forEach((l, i) => {
    if (xp >= l.at) idx = i;
  });
  return idx;
}

const WEEK_OTHERS = [
  { name: "Sokha", xp: 5120, move: 1, streak: 41 },
  { name: "Dara", xp: 4680, move: 0, streak: 22 },
  { name: "Chenda", xp: 4310, move: -1, streak: 15 },
  { name: "Pisach", xp: 3960, move: 2, streak: 9 },
  { name: "Bopha", xp: 3540, move: -1, streak: 30 },
  { name: "Vichet", xp: 3105, move: 1, streak: 6 },
  { name: "Ratana", xp: 2780, move: 0, streak: 18 },
  { name: "Kunthea", xp: 2410, move: -2, streak: 4 },
  { name: "Vantha", xp: 2090, move: 3, streak: 12 },
  { name: "Sreymom", xp: 1760, move: -1, streak: 7 },
  // "me" is spliced in around here at build time
  { name: "Mengly", xp: 1610, move: 1, streak: 5 },
  { name: "Pheakdey", xp: 1340, move: 0, streak: 2 },
  { name: "Sopheak", xp: 1080, move: -1, streak: 11 },
  { name: "Thida", xp: 860, move: 2, streak: 3 },
  { name: "Piseth", xp: 640, move: 0, streak: 1 },
  { name: "Channary", xp: 470, move: -3, streak: 0 },
  { name: "Rithy", xp: 330, move: 1, streak: 8 },
  { name: "Sopha", xp: 210, move: 0, streak: 0 },
];

const LAST_WEEK_OTHERS = [
  { name: "Sokha", xp: 4890, move: 0, streak: 40 },
  { name: "Dara", xp: 4720, move: 1, streak: 21 },
  { name: "Pisach", xp: 4105, move: 3, streak: 8 },
  { name: "Chenda", xp: 3980, move: -2, streak: 14 },
  { name: "Bopha", xp: 3410, move: 0, streak: 29 },
  { name: "Ratana", xp: 2960, move: 2, streak: 17 },
  { name: "Vichet", xp: 2615, move: -1, streak: 5 },
  { name: "Vantha", xp: 2270, move: -1, streak: 11 },
  { name: "Kunthea", xp: 1990, move: 4, streak: 3 },
  { name: "Sreymom", xp: 1705, move: 0, streak: 6 },
  { name: "Pheakdey", xp: 1420, move: -1, streak: 1 },
  { name: "Sopheak", xp: 1150, move: 2, streak: 10 },
  { name: "Thida", xp: 900, move: -1, streak: 2 },
  { name: "Piseth", xp: 700, move: 0, streak: 1 },
  { name: "Channary", xp: 560, move: 1, streak: 0 },
  { name: "Rithy", xp: 300, move: -2, streak: 7 },
];

const FRIEND_NAMES = new Set(["Dara", "Bopha", "Vantha", "Sreymom", "Pheakdey"]);

function withMe(others, me, meXp, meMove, meStreak) {
  return [...others, { id: "me", name: me, xp: meXp, move: meMove, streak: meStreak, me: true }];
}

export function weekStandings(name, streak) {
  return withMe(WEEK_OTHERS, name, 1930, 2, streak);
}

export function lastWeekStandings(name) {
  return withMe(LAST_WEEK_OTHERS, name, 1780, 0, 0);
}

export function friendStandings(name, streak) {
  const friends = WEEK_OTHERS.filter((p) => FRIEND_NAMES.has(p.name));
  return withMe(friends, name, 1930, 2, streak);
}
