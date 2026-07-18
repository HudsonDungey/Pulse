// --- @virio/sdk/vue ---------------------------------------------------------
// Vue-friendly entrypoint. It registers the framework-neutral <virio-button>
// custom element and exposes the same imperative checkout function for custom
// Vue components without taking a hard dependency on Vue.

import { defineVirioButton } from "../web/element.js";

export interface VueLikeApp {
  config?: {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean;
    };
  };
}

export interface VirioVuePluginOptions {
  tag?: string;
}

export const VIRIO_BUTTON_TAG = "virio-button";

export const VirioVue = {
  install(app?: VueLikeApp, options: VirioVuePluginOptions = {}): void {
    const tag = options.tag ?? VIRIO_BUTTON_TAG;
    defineVirioButton(tag);

    const compilerOptions = app?.config?.compilerOptions;
    if (!compilerOptions) return;

    const previous = compilerOptions.isCustomElement;
    compilerOptions.isCustomElement = (candidate) =>
      candidate === tag || previous?.(candidate) === true;
  },
};

export function installVirio(app?: VueLikeApp, options?: VirioVuePluginOptions): void {
  VirioVue.install(app, options);
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

// Side-effect import support: `import "@virio/sdk/vue"` registers <virio-button>.
defineVirioButton(VIRIO_BUTTON_TAG);
