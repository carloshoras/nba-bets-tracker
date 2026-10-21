import { mkdir, writeFile } from "node:fs/promises";

export async function main() {
  
  const url =
    "https://www.basketball-reference.com/leagues/NBA_2027_standings.html";
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
    });
  
    if (!response.ok) {
      throw new Error(`La descarga ha fallado: HTTP ${response.status}`);
    }
  
    const html = await response.text();
  
  
    await mkdir("data", { recursive: true });
    await writeFile("data/standings-source.html", html, "utf8");
  
    console.log("HTML guardado en data/standings-source.html");
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Error desconocido",
    );
  
    process.exitCode = 1;
  }

}
