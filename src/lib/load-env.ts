// Tiny .env loader for the web server (no dependency; ignores it if absent).
// server.ts imports this FIRST: ESM evaluates imports in order, so this
// module's side effect runs before any server route reads process.env.
// Deployed platforms (Vercel) inject real env vars, which always win —
// values already set in the environment are never overwritten.
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const candidates = [
  path.join(process.cwd(), ".env"),
  path.join(here, ".env"),
  path.join(here, "../.env"),
];
const file = candidates.find((f) => {
  try {
    return fs.existsSync(f);
  } catch {
    return false;
  }
});
if (file) {
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#") || process.env[m[1]] !== undefined) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[m[1]] = v;
  }
}
export const loadedEnvFile = Boolean(file);
