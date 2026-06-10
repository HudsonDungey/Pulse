import type { Address, Hash, Hex } from "viem";

// ─── On-chain structs (mirror VirioSubscriptionManager.sol) ───────────────────

export interface Plan {
  merchant: Address;
  token: Address;
  /** Gross amount (fee-inclusive) per charge, in the token's smallest unit. */
  amount: bigint;
  /** Minimum seconds between charges. */
  period: bigint;
  active: boolean;
}

export interface Subscription {
  customer: Address;
  merchant: Address;
  token: Address;
  /** Gross amount per charge, denormalised from the plan at subscribe time. */
  amount: bigint;
  /** Seconds between charges, denormalised from the plan at subscribe time. */
  period: bigint;
  /** Unix timestamp of the next allowed charge. */
  nextChargeAt: bigint;
  /** Opt-in lifetime spend limit; 0n = unlimited. */
  totalSpendCap: bigint;
  /** Cumulative gross amount charged so far. */
  totalSpent: bigint;
  active: boolean;
}

// ─── Records (struct + its on-chain id, returned by list helpers) ─────────────

export interface PlanRecord extends Plan {
  /** keccak256(merchant ‖ nonce ‖ chainId). */
  id: Hex;
}

export interface SubscriptionRecord extends Subscription {
  /** keccak256(planId ‖ customer). */
  id: Hex;
  /** The plan this subscription belongs to. */
  planId: Hex;
}

/** A single successful charge, reconstructed from a `ChargeExecuted` log. */
export interface Charge {
  subscriptionId: Hex;
  executor: Address;
  customer: Address;
  /** Total amount pulled from the customer. */
  gross: bigint;
  /** Net amount the merchant received. */
  merchantAmount: bigint;
  executorFee: bigint;
  protocolFee: bigint;
  nextChargeAt: bigint;
  txHash: Hash;
  blockNumber: bigint;
}

/** Protocol-wide fee configuration, read from the contract. */
export interface Fees {
  executorFeeBps: number;
  protocolFeeBps: number;
  protocolFlatFee: bigint;
  feeRecipient: Address;
}

// ─── Tool-friendly planning types ────────────────────────────────────────────

export interface PreparedTransaction {
  /** Contract or token receiving the transaction. */
  to: Address;
  /** Encoded calldata, ready for any EVM wallet/client. */
  data: Hex;
  /** ETH value. Virio contract calls are currently non-payable. */
  value: bigint;
  /** Human-readable operation name. */
  label: string;
  /** Contract function encoded in `data`. */
  functionName: string;
  /** Original function args for tools that want to inspect before sending. */
  args: readonly unknown[];
}

export interface PreparedCheckout {
  planId: Hex;
  customer: Address;
  subscriptionId: Hex;
  token: Address;
  requiredAllowance: bigint;
  currentAllowance: bigint;
  needsApproval: boolean;
  transactions: PreparedTransaction[];
}

export interface ListOptions {
  /** Start block for this query. Defaults to the client's deploymentBlock. */
  fromBlock?: bigint;
  /** End block for this query. Defaults to latest. */
  toBlock?: bigint;
  /** Largest block span per getLogs call. */
  maxRange?: bigint;
  /** Stop after this many matching logs. */
  limit?: number;
}

// ─── Call params ──────────────────────────────────────────────────────────────

export interface CreatePlanParams {
  /** Defaults to the configured USDC address when omitted. */
  token?: Address;
  /** Gross amount per charge, in the token's smallest unit (use `usdc(49)`). */
  amount: bigint;
  /** Seconds between charges (use the `PERIOD` constants). */
  period: bigint;
}

export interface SubscribeParams {
  planId: Hex;
  /** Lifetime spend cap; omit or pass 0n for unlimited. */
  totalSpendCap?: bigint;
}

/** Filter passed to `getSubscriptions(address, …)`. */
export type SubscriptionRole = "customer" | "merchant" | "any";

// ─── Webhook types ────────────────────────────────────────────────────────────

export type VirioEventType =
  | "subscription.created"
  | "subscription.charged"
  | "subscription.cancelled"
  | "plan.deactivated";

export interface VirioEvent {
  id: string;
  type: VirioEventType;
  createdAt: number; // unix seconds
  data: SubscriptionChargedData | SubscriptionCreatedData | Record<string, unknown>;
}

export interface SubscriptionChargedData {
  subscriptionId: Hex;
  planId: Hex;
  customer: Address;
  merchant: Address;
  /** Net merchant amount in the token's smallest unit. */
  amount: string;
  fee: string;
  txHash: Hash;
  nextChargeAt: number;
  chainId: number;
}

export interface SubscriptionCreatedData {
  subscriptionId: Hex;
  planId: Hex;
  customer: Address;
  totalSpendCap: string;
  chainId: number;
}
