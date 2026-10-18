import { readFile } from "node:fs/promises";
import { parseStandings } from "./parse-standings.js";

const html = await readFile("data/standings-source.html", "utf8");

const teams = parseStandings(html);

console.table(teams);
console.log(`Total: ${teams.length} equipos`);