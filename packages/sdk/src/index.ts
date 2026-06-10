// ─── Main client ───────────────────────────────────────────────────────────
export { Virio } from "./Virio.js";
// Default export so `import Virio from "@virio/sdk"` works too.
export { Virio as default } from "./Virio.js";
// Backwards-compatible alias for the previous class name.
export { Virio as VirioClient } from "./Virio.js";

export type {
  VirioOptions,
  ResolvedVirioConfig,
  PlansNamespace,
  SubscriptionsNamespace,
} from "./Virio.js";

// `VirioClientConfig` was the old name for the constructor options.
export type { VirioOptions as VirioClientConfig } from "./Virio.js";

// ─── ABIs ──────────────────────────────────────────────────────────────────
export { VIRIO_ABI, ERC20_ABI } from "./abi.js";
export type { VirioAbi, Erc20Abi } from "./abi.js";

// ─── Errors ─────────────────────────────────────────────────────────────────
export {
  VirioError,
  MissingWalletError,
  MissingTokenError,
  MissingAccountError,
  MissingContractError,
  EventNotFoundError,
} from "./errors.js";
export type { VirioErrorCode } from "./errors.js";

// ─── Webhooks ────────────────────────────────────────────────────────────────
export { signWebhook, verifyWebhook, buildEvent } from "./webhooks.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
export {
  usdc,
  fromUsdc,
  formatUsdc,
  parseUnits,
  formatUnits,
  PERIOD,
  intervalToPeriod,
  computeSubscriptionId,
} from "./helpers.js";

// ─── Chains ──────────────────────────────────────────────────────────────────
export {
  CHAINS,
  SUPPORTED_CHAINS,
  USDC_ADDRESSES,
  VIRIO_CONTRACT_ADDRESS,
  resolveChain,
  usdcAddressFor,
  mainnet,
  base,
  arbitrum,
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  foundry,
} from "./chains.js";
export type { ChainName, Chain } from "./chains.js";

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  Plan,
  PlanRecord,
  Subscription,
  SubscriptionRecord,
  SubscriptionRole,
  Charge,
  Fees,
  PreparedTransaction,
  PreparedCheckout,
  ListOptions,
  CreatePlanParams,
  SubscribeParams,
  VirioEvent,
  VirioEventType,
  SubscriptionChargedData,
  SubscriptionCreatedData,
} from "./types.js";
