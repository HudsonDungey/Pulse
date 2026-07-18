// --- @virio/sdk/web ---------------------------------------------------------
// Framework-neutral checkout: a <virio-button> Web Component plus an
// imperative openVirioCheckout() for custom buttons in any browser app.

import { defineVirioButton } from "./element.js";

export { defineVirioButton } from "./element.js";
export { openVirioCheckout } from "./checkout.js";
export type { OpenCheckoutOptions } from "./checkout.js";

// Re-export the headless core for advanced/custom UIs.
export { VirioCheckout } from "../checkout/controller.js";
export type {
  CheckoutState,
  CheckoutStatus,
  CheckoutOptions,
  CheckoutCallbacks,
} from "../checkout/controller.js";
export type { PlanSummary } from "../checkout/transaction.js";

// Auto-register so `import "@virio/sdk/web"` is enough in plain HTML.
defineVirioButton();
