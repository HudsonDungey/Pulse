// ─── @virio/sdk/vanilla ──────────────────────────────────────────────────────
// Deprecated alias for @virio/sdk/web. Kept so existing integrations continue
// working while new apps import @virio/sdk/web, /vue, /angular, or /react.

import { defineVirioButton } from "../web/element.js";

export { defineVirioButton } from "../web/element.js";
export { openVirioCheckout } from "../web/checkout.js";
export type { OpenCheckoutOptions } from "../web/checkout.js";

// Re-export the headless core for advanced/custom UIs.
export { VirioCheckout } from "../checkout/controller.js";
export type {
  CheckoutState,
  CheckoutStatus,
  CheckoutOptions,
  CheckoutCallbacks,
} from "../checkout/controller.js";
export type { PlanSummary } from "../checkout/transaction.js";

// Auto-register so legacy `import "@virio/sdk/vanilla"` still works.
defineVirioButton();
