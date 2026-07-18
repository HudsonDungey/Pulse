// --- @virio/sdk/angular -----------------------------------------------------
// Angular-friendly entrypoint. Angular apps should include CUSTOM_ELEMENTS_SCHEMA
// wherever <virio-button> is used; this module registers the underlying custom
// element and exposes an imperative checkout function for Angular services.

import { defineVirioButton } from "../web/element.js";

export interface VirioAngularOptions {
  tag?: string;
}

export const VIRIO_BUTTON_TAG = "virio-button";

export function defineVirioAngularElements(options: VirioAngularOptions = {}): void {
  defineVirioButton(options.tag ?? VIRIO_BUTTON_TAG);
}

export { defineVirioButton } from "../web/element.js";
export { openVirioCheckout } from "../web/checkout.js";
export type { OpenCheckoutOptions } from "../web/checkout.js";
export { VirioCheckout } from "../checkout/controller.js";
export type {
  CheckoutState,
  CheckoutStatus,
  CheckoutOptions,
  CheckoutCallbacks,
} from "../checkout/controller.js";
export type { PlanSummary } from "../checkout/transaction.js";

// Side-effect import support: `import "@virio/sdk/angular"` registers <virio-button>.
defineVirioAngularElements();
