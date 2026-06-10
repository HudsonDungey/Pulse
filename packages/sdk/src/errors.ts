export type VirioErrorCode =
  | "MISSING_WALLET"
  | "MISSING_TOKEN"
  | "MISSING_ACCOUNT"
  | "MISSING_CONTRACT"
  | "UNKNOWN_CHAIN"
  | "CONFIG_NOT_FOUND"
  | "CONFIG_INVALID"
  | "EVENT_NOT_FOUND";

export class VirioError extends Error {
  constructor(
    public readonly code: VirioErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "VirioError";
  }
}

export class MissingWalletError extends VirioError {
  constructor() {
    super(
      "MISSING_WALLET",
      "Virio: a wallet is required for write operations. Pass `privateKey` or `walletClient`.",
    );
  }
}

export class MissingTokenError extends VirioError {
  constructor() {
    super(
      "MISSING_TOKEN",
      "Virio: no token address. Configure `usdcAddress` for this chain, or pass a token explicitly.",
    );
  }
}

export class MissingAccountError extends VirioError {
  constructor() {
    super(
      "MISSING_ACCOUNT",
      "Virio: no account to read. Configure `account` or pass an address explicitly.",
    );
  }
}

export class MissingContractError extends VirioError {
  constructor() {
    super(
      "MISSING_CONTRACT",
      "Virio: contractAddress is not configured.",
    );
  }
}

export class EventNotFoundError extends VirioError {
  constructor(eventName: string) {
    super("EVENT_NOT_FOUND", `Virio: ${eventName} event not found in receipt.`, { eventName });
  }
}
