import { readFile, writeFile, stat } from "node:fs/promises";
import { parseStandings } from "./parse-standings.js";
import type { Standings } from "./team-standing.js";
import { sourceHtmlPath, standingsJsonPath } from "./data-paths.js";

export async function main(): Promise<void> {
  const html = await readFile(sourceHtmlPath, "utf8");
  const sourceInfo = await stat(sourceHtmlPath);

  const teams = parseStandings(html);

  const standings: Standings = {
    season: "2026-27",
    updatedAt: sourceInfo.mtime.toISOString(),
    teams,
  };

  await writeFile(
    standingsJsonPath,
    JSON.stringify(standings, null, 2),
    "utf8",
  );

  console.log(
    `Guardados ${teams.length} equipos de ${standings.season} en ${standingsJsonPath}`,
  );
}