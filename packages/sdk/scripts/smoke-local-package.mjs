import { mkdtemp, mkdir, readFile, symlink, rm } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sdkDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(sdkDir, "../..");
const packDir = path.join(repoRoot, ".tmp", "sdk-pack");
const appDir = await mkdtemp(path.join(tmpdir(), "virio-sdk-smoke-"));
const appNodeModules = path.join(appDir, "node_modules");
const appSdkDir = path.join(appNodeModules, "@virio", "sdk");

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: options.cwd ?? sdkDir,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      npm_config_cache: path.join(repoRoot, ".tmp", "npm-cache"),
    },
  });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

async function linkDependency(name) {
  const requireFromSdk = createRequire(path.join(sdkDir, "package.json"));
  const depDir = findPackageRoot(requireFromSdk.resolve(name), name);
  const target = path.join(appNodeModules, name);
  await mkdir(path.dirname(target), { recursive: true });
  if (!existsSync(target)) await symlink(depDir, target, "junction");
}

function findPackageRoot(entrypoint, expectedName) {
  let current = path.dirname(entrypoint);
  while (current !== path.dirname(current)) {
    const packageJson = path.join(current, "package.json");
    if (existsSync(packageJson)) {
      try {
        const metadata = JSON.parse(readFileSync(packageJson, "utf8"));
        if (metadata.name === expectedName) return current;
      } catch {
        // Keep walking; nested implementation folders can have tiny package.json files.
      }
    }
    current = path.dirname(current);
  }
  throw new Error(`Could not find package root for ${entrypoint}`);
}


try {
  await rm(packDir, { recursive: true, force: true });
  await mkdir(packDir, { recursive: true });
  run("npm", ["pack", "--pack-destination", packDir]);

  const tarball = path.join(packDir, "virio-sdk-0.1.0.tgz");
  await mkdir(appSdkDir, { recursive: true });
  run("tar", ["-xzf", tarball, "-C", appSdkDir, "--strip-components", "1"], { cwd: appDir });

  await mkdir(appNodeModules, { recursive: true });
  for (const dep of ["viem", "qrcode", "@walletconnect/ethereum-provider", "react", "react-dom"]) {
    await linkDependency(dep);
  }

  await readFile(path.join(appSdkDir, "package.json"), "utf8");
  const smoke = `
    import Virio, { Virio as NamedVirio } from "@virio/sdk";
    import { VirioProvider, VirioButton } from "@virio/sdk/react";
    import { VirioVue, installVirio } from "@virio/sdk/vue";
    import { defineVirioAngularElements } from "@virio/sdk/angular";
    import { defineVirioButton, openVirioCheckout } from "@virio/sdk/web";
    import { defineVirioButton as defineLegacy } from "@virio/sdk/vanilla";
    import { VirioCheckout } from "@virio/sdk/checkout";

    const checks = [
      typeof Virio === "function",
      Virio === NamedVirio,
      typeof VirioProvider === "function",
      typeof VirioButton === "function",
      typeof VirioVue.install === "function",
      typeof installVirio === "function",
      typeof defineVirioAngularElements === "function",
      typeof defineVirioButton === "function",
      typeof openVirioCheckout === "function",
      typeof defineLegacy === "function",
      typeof VirioCheckout === "function",
    ];
    if (checks.some((ok) => !ok)) throw new Error("SDK export smoke check failed");
    console.log("SDK local package smoke check passed");
  `;
  run("node", ["--input-type=module", "--eval", smoke], { cwd: appDir });
} finally {
  await rm(appDir, { recursive: true, force: true });
}
