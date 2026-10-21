import { mkdir, writeFile } from "node:fs/promises";
import { dataDirectory, sourceHtmlPath } from "./data-paths.js";

export async function main(): Promise<void> {
  const url =
    "https://www.basketball-reference.com/leagues/NBA_2027_standings.html";

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`La descarga ha fallado: HTTP ${response.status}`);
  }

  const html = await response.text();

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(sourceHtmlPath, html, "utf8");

  console.log(`HTML guardado en ${sourceHtmlPath}`);
}