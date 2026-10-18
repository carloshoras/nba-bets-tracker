import { evaluateBet } from "./evaluate-bet.js";
import type { TeamStanding } from "./team-standing.js";

const houston: TeamStanding = {
  abbreviation: "HOU",
  name: "Houston Rockets",
  conference: "west",
  conferenceRank: 5,
  divisionRank: 2,
  wins: 4,
  losses: 3,
};

console.log(
  "Houston U 5.5:",
  evaluateBet(houston, {
    type: "conference-seed",
    side: "under",
    line: 5.5,
  }),
);

console.log(
  "Houston +45:",
  evaluateBet(houston, {
    type: "wins",
    minimum: 45,
  }),
);

console.log(
  "Houston +50:",
  evaluateBet(houston, {
    type: "wins",
    minimum: 50,
  }),
);