import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sdkDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(sdkDir, "../..");
const packDir = path.join(repoRoot, ".tmp", "sdk-pack");
const npmCache = path.join(repoRoot, ".tmp", "npm-cache");

await mkdir(packDir, { recursive: true });
await mkdir(npmCache, { recursive: true });

const result = spawnSync("npm", ["pack", "--pack-destination", packDir], {
  cwd: sdkDir,
  stdio: "inherit",
  shell: false,
  env: {
    ...process.env,
    npm_config_cache: npmCache,
  },
});

if (result.status !== 0) {
  throw new Error(`npm pack failed with exit code ${result.status}`);
}
