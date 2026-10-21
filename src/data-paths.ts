import { join } from "node:path";

export const dataDirectory = process.env.AWS_LAMBDA_FUNCTION_NAME
  ? "/tmp/nba-bets-tracker"
  : "data";

export const sourceHtmlPath = join(
  dataDirectory,
  "standings-source.html",
);

export const standingsJsonPath = join(
  dataDirectory,
  "standings.json",
);