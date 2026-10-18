export type TeamStanding = {
  abbreviation: string;
  name: string;
  conference: "east" | "west";
  conferenceRank: number;
  divisionRank: number;
  wins: number;
  losses: number;
};


export type Standings = {
  season: string;
  updatedAt: string;
  teams: TeamStanding[];
};