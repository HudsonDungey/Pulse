export { loadConfig, resolveFileConfig, findConfigFile } from "./config.js";
export type {
  VirioFileConfig,
  ChainFileConfig,
  LoadConfigOptions,
} from "./config.js";

export { Virio } from "./Virio.js";
export type { VirioOptions } from "./Virio.js";

import { Virio } from "./Virio.js";
import { loadConfig, type LoadConfigOptions } from "./config.js";

export function virioFromConfigFile(options: LoadConfigOptions = {}): Virio {
  return new Virio(loadConfig(options));
}
