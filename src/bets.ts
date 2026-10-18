export type Bet =
    | {
        type: "conference-seed";
        side: "over" | "under";
        line: number;
    }
    | {
        type: "wins";
        minimum: number;
    }
    | {
        type: "division-position";
        position: number;
    };

export const bets: Record<string, Bet[]> = {
    HOU: [
        { type: "conference-seed", side: "under", line: 5.5 },
        { type: "wins", minimum: 45 },
        { type: "wins", minimum: 46.5 },
        { type: "wins", minimum: 47.5 },
        { type: "wins", minimum: 50 },
    ],
    CHA: [
        { type: "conference-seed", side: "over", line: 9.5 },
    ],
    PHX: [
        { type: "division-position", position: 2 },
        { type: "conference-seed", side: "under", line: 8.5 },
        { type: "wins", minimum: 35 },
        { type: "wins", minimum: 40 },
    ],
    BOS: [
        { type: "wins", minimum: 50 },
        { type: "wins", minimum: 45 },
    ],
    PHI: [
        { type: "wins", minimum: 50 },
        { type: "wins", minimum: 45 },
    ],
    NYK: [
        { type: "wins", minimum: 45 },
    ],
    MIA: [
        { type: "wins", minimum: 45 },
        { type: "wins", minimum: 40 },
    ],
    LAL: [
        { type: "wins", minimum: 45 },
        { type: "wins", minimum: 40 },
    ],
    DET: [
        { type: "wins", minimum: 45 },
        { type: "wins", minimum: 40 },
    ],
    DEN: [
        { type: "division-position", position: 2 },
        { type: "wins", minimum: 45 },
        { type: "wins", minimum: 40 },
    ],
    TOR: [
        { type: "wins", minimum: 40 },
        { type: "wins", minimum: 35 },
    ],
    IND: [
        { type: "wins", minimum: 40 },
        { type: "wins", minimum: 35 },
    ],
    UTA: [
        { type: "wins", minimum: 35 },
    ],
    WAS: [
        { type: "wins", minimum: 30 },
        { type: "wins", minimum: 25 },
    ],
    LAC: [
        { type: "wins", minimum: 30 },
        { type: "wins", minimum: 25 },
        { type: "wins", minimum: 20 },
    ],
    DAL: [
        { type: "wins", minimum: 25 },
    ],
    NOP: [
        { type: "wins", minimum: 20 },
    ],
    OKC: [
        { type: "wins", minimum: 55 },
    ],
    SAS: [
        { type: "wins", minimum: 55 },
    ],
    GSW: [
        { type: "conference-seed", side: "under", line: 8.5 },
    ],
};