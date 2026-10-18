import { load } from "cheerio/slim";
import type { TeamStanding } from "./team-standing.js";

const aliases: Record<string, string> = {
  CHO: "CHA",
  BRK: "BKN",
  PHO: "PHX",
};

function getAbbreviation(href: string | undefined): string {
  const match = href?.match(/^\/teams\/([A-Z]{3})\/\d{4}\.html$/);

  if (!match) {
    throw new Error(`Enlace de equipo no válido: ${href}`);
  }

  const code = match[1];

  return aliases[code] ?? code;
}

function readRecordValue(text: string): number {
  const cleanText = text.trim();

  if (!/^\d+$/.test(cleanText)) {
    throw new Error(`Victorias o derrotas no válidas: "${text}"`);
  }

  const value = Number(cleanText);

  if (value > 82) {
    throw new Error(`Récord fuera de rango: ${value}`);
  }

  return value;
}

export function parseStandings(html: string): TeamStanding[] {
  const $ = load(html);

  const conferences = [
    { suffix: "E", name: "east" },
    { suffix: "W", name: "west" },
  ] as const;

  const teams: TeamStanding[] = [];
  const seenTeams = new Set<string>();

  for (const conference of conferences) {
    const divisionRanks = new Map<string, number>();

    const divisionTable = $(`#divs_standings_${conference.suffix}`);

    if (divisionTable.length !== 1) {
      throw new Error(`No se encuentra la tabla de divisiones ${conference.name}`);
    }

    let divisionCount = 0;
    let position = 0;

    for (const element of divisionTable.find("tbody tr").toArray()) {
      const row = $(element);

      if (row.hasClass("thead")) {
        divisionCount++;
        position = 0;
        continue;
      }

      const link = row.find('[data-stat="team_name"] a');

      if (link.length !== 1 || divisionCount === 0) {
        throw new Error("Fila inesperada en la tabla de divisiones");
      }

      const abbreviation = getAbbreviation(link.attr("href"));

      if (divisionRanks.has(abbreviation)) {
        throw new Error(`Equipo duplicado en divisiones: ${abbreviation}`);
      }

      position++;
      divisionRanks.set(abbreviation, position);
    }

    if (divisionCount !== 3 || position !== 5 || divisionRanks.size !== 15) {
      throw new Error(`Divisiones incompletas en ${conference.name}`);
    }

    const conferenceTable = $(`#confs_standings_${conference.suffix}`);
    const rows = conferenceTable.find("tbody tr");

    if (conferenceTable.length !== 1 || rows.length !== 15) {
      throw new Error(`La conferencia ${conference.name} debe tener 15 equipos`);
    }

    for (const [index, element] of rows.toArray().entries()) {
      const row = $(element);
      const link = row.find('[data-stat="team_name"] a');

      if (link.length !== 1) {
        throw new Error("Fila sin un enlace de equipo válido");
      }

      const abbreviation = getAbbreviation(link.attr("href"));
      const name = link.text().trim();
      const divisionRank = divisionRanks.get(abbreviation);

      if (!name || divisionRank === undefined) {
        throw new Error(`Datos incompletos para ${abbreviation}`);
      }

      if (seenTeams.has(abbreviation)) {
        throw new Error(`Equipo duplicado en conferencias: ${abbreviation}`);
      }

      const wins = readRecordValue(
        row.find('[data-stat="wins"]').text(),
      );

      const losses = readRecordValue(
        row.find('[data-stat="losses"]').text(),
      );

      if (wins + losses > 82) {
        throw new Error(`Demasiados partidos para ${abbreviation}`);
      }

      seenTeams.add(abbreviation);

      teams.push({
        abbreviation,
        name,
        conference: conference.name,
        conferenceRank: index + 1,
        divisionRank,
        wins,
        losses,
      });
    }
  }

  return teams;
}