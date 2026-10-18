import { readFile, writeFile, stat } from "node:fs/promises";
import { parseStandings } from "./parse-standings.js";
import type { Standings } from "./team-standing.js";

const sourcePath = "data/standings-source.html";

const html = await readFile(sourcePath, "utf8");
const sourceInfo = await stat(sourcePath);

const teams = parseStandings(html);

const standings: Standings = {
  season: "2025-26",
  updatedAt: sourceInfo.mtime.toISOString(),
  teams,
};

await writeFile(
  "data/standings.json",
  JSON.stringify(standings, null, 2),
  "utf8",
);

console.log(`Guardados ${teams.length} equipos de ${standings.season}`);