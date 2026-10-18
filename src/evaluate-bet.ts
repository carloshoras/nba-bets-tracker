
import { Bet } from "./bets.js";
import { TeamStanding } from "./team-standing.js";

// Returns true when the bet is currently winning
export const evaluateBet = (team: TeamStanding, bet: Bet ): boolean => {
    const gamesPlayed = team.wins + team.losses;

    if (gamesPlayed === 0) {
        return false;
    }

    switch (bet.type) {
        case "wins":
            const currentProjectedWins = (team.wins / gamesPlayed) * 82;

            return currentProjectedWins >= bet.minimum;

        case "conference-seed":
            if (bet.side === "under") {
                return team.conferenceRank <= bet.line;
            } else {
                return team.conferenceRank >= bet.line;
            }
        case "division-position":
            return team.divisionRank === bet.position;
    }
}