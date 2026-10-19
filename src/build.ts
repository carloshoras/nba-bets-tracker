import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import { bets } from "./bets.js";
import type { Bet } from "./bets.js";
import { evaluateBet } from "./evaluate-bet.js";
import type { Standings, TeamStanding } from "./team-standing.js";

// Leemos el JSON que ha generado prepare-data.
const content = await readFile("data/standings.json", "utf8");
const standings = JSON.parse(content) as Standings;

// Convierte caracteres especiales en texto seguro para el HTML.
function escapeHtml(text: string): string {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Genera el texto visible de una apuesta.
function formatBet(bet: Bet): string {
    switch (bet.type) {
        case "wins":
            return `${bet.minimum}+(${(
                (bet.minimum / 82) * 100
            ).toFixed(1)}%)`;

        case "conference-seed":
            return `${bet.side === "under" ? "U" : "O"}${bet.line}`;

        case "division-position":
            return `${bet.position}º div`;
    }
}

// Genera una fila de la tabla.
function renderTeamRow(team: TeamStanding): string {
    const gamesPlayed = team.wins + team.losses;

    const percentage =
        gamesPlayed === 0
            ? "—"
            : `${((team.wins / gamesPlayed) * 100).toFixed(1)}%`;

    const teamBets = bets[team.abbreviation] ?? [];

    const betsHtml = teamBets
        .map((bet) => {
            const result = evaluateBet(team, bet);

            const status =
                result ? "winning" : "losing";

            return `
        <span class="${status}">
          ${escapeHtml(formatBet(bet))}
        </span>
      `;
        })
        .join("  ||  ");

    return `
    <tr>
      <td>${team.conferenceRank}</td>
      <td>
  <div class="team-cell">
    <img
      class="team-logo"
      src="./logos/${escapeHtml(team.abbreviation.toLowerCase())}.svg"
      alt=""
      width="32"
      height="32"
    >
    <span class="team-name">${escapeHtml(team.name)}</span>
    <abbr class="team-abbreviation" title="${escapeHtml(team.name)}">
    ${escapeHtml(team.abbreviation)}
    </abbr>
  </div>
</td>   
      <td>${team.wins}-${team.losses} (${percentage})</td>
      <td>${betsHtml || "—"}</td>
    </tr>
  `;
}

// Genera una tabla completa.
function renderConference(
    conference: TeamStanding["conference"],
    title: string,
): string {
    const teams = standings.teams
        .filter((team) => team.conference === conference)
        .sort((a, b) => a.conferenceRank - b.conferenceRank);

    return `
    <section>
      <h2>${escapeHtml(title)}</h2>

      <div class="table-container">
        <table>
        <colgroup>
            <col class="column-seed">
            <col class="column-team">
            <col class="column-record">
            <col class="column-bets">
         </colgroup>
          <thead>
            <tr>
              <th scope="col">Seed</th>
              <th scope="col">Team</th>
              <th scope="col">Record</th>
              <th scope="col">Bets</th>
            </tr>
          </thead>
          <tbody>
            ${teams.map(renderTeamRow).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

const html = `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pedrinho & Carlazo NBA Bets Tracker</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <main>
      <h1>Pedrinho & Carlazo NBA Bets Tracker</h1>

      <p>
        Los datos se actualizan cada día a las 8:00 AM (GMT+2).
        Última actualización: ${escapeHtml(new Date(standings.updatedAt).toLocaleString("es-ES"))}.
      </p>
      <div class="tables-container">
      ${renderConference("east", "Eastern Conference")}
      ${renderConference("west", "Western Conference")}
      </div>

    </main>
  </body>
</html>
`;

await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await writeFile("dist/index.html", html, "utf8");

console.log(`Página generada con ${standings.teams.length} equipos`);