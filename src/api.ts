const STANDINGS_URL =
  "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2027&seasontype=2";

export async function fetchStandings(): Promise<unknown> {
  const response = await fetch(STANDINGS_URL, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo obtener la clasificación: HTTP ${response.status}`,
    );
  }

  const data: unknown = await response.json();

  return data;
}