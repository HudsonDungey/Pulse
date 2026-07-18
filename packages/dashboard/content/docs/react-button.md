---
title: Drop-in Button
description: Add crypto subscriptions with one component — native React, Vue, and Angular entrypoints, plus a Web Component for plain HTML. WalletConnect, plan lookup, approvals and signing handled for you.
section: Build
order: 3
---

`@virio/sdk/react` is a WalletConnect-powered React component that turns a plan id into a working subscription checkout. It feels like Stripe Checkout: the customer clicks a button, connects a wallet, and the subscription becomes active — no wallet config, no wagmi, no transaction handling on your side.

## Installation

```bash
npm install @virio/sdk
```

`react` and `react-dom` are peer dependencies (React 18+). WalletConnect and QR generation come bundled.

## Two steps

Wrap your app once, then drop the button wherever you sell:

```tsx
import { VirioProvider, VirioButton } from "@virio/sdk/react";

export default function App() {
  return (
    <VirioProvider rpcUrl={process.env.NEXT_PUBLIC_RPC_URL!}>
      <VirioButton planId="0x123…" />
    </VirioProvider>
  );
}
```

That is the whole integration. The merchant supplies only an **RPC URL** and a **plan id** — token, amount, recipient, interval and chain all come from the contract, which is the source of truth.

The default label is **Subscribe with Crypto**. Override it with children:

```tsx
<VirioButton planId="0x123…">Get Pro</VirioButton>
```

## What happens on click

```text
Subscribe with Crypto → Connect Wallet → Wallet Connected
→ Preparing Subscription → Signature Request → Subscription Active
```

1. The connect screen offers two paths: **Continue with Wallet** (mobile deep link) and **Connect on another device** (QR code).
2. On connect, the SDK loads the plan, switches the wallet to the right chain if needed, and — because `autoSign` defaults to `true` — immediately requests the required signatures: an ERC-20 approval (only if the current allowance is too low) followed by `subscribe`. No second button.
3. On confirmation the success screen shows and `onSuccess` fires with the subscription id.

## `<VirioProvider>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rpcUrl` | `string` | — | RPC endpoint for the chain the contract lives on. **Required.** |
| `chain` | `string \| number` | `"base"` | Chain name (`"base"`, `"sepolia"`, …) or id. |
| `contractAddress` | `Address` | canonical deployment | VirioSubscriptionManager address. |
| `projectId` | `string` | Virio's shared project | WalletConnect Cloud project id. Set your own for branded session metadata. |
| `appName` | `string` | `"Virio"` | Name shown in the user's wallet during connection. |

## `<VirioButton>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `planId` | `string` | — | The plan to subscribe to. **Required.** |
| `children` | `ReactNode` | `"Subscribe with Crypto"` | Button label. |
| `className` / `style` | — | — | Override the default styling. |
| `disabled` | `boolean` | `false` | Disable the button. |
| `autoConnect` | `boolean` | `true` | Skip the connect screen when a session is already restored. |
| `autoSign` | `boolean` | `true` | Start signing automatically after connecting. Set `false` to show a summary with a manual confirm button. |
| `onConnect` | `(address: string) => void` | — | Fired when the wallet connects. |
| `onPending` | `(txHash: string) => void` | — | Fired for each transaction as it is broadcast. |
| `onSuccess` | `(subscriptionId: string) => void` | — | Fired when the subscription is active. |
| `onError` | `(error: Error) => void` | — | Fired on connection or signature failure. |

## `useVirio()`

Read connection state or drive connect/disconnect from your own UI:

```tsx
import { useVirio } from "@virio/sdk/react";

const { connected, address, chainId, connect, disconnect } = useVirio();
```

## Sessions, chains and errors

- **Persistence** — WalletConnect sessions are stored and restored automatically, so a returning customer stays connected across refreshes.
- **Wrong chain** — the SDK requests a network switch before signing.
- **Rejections** — a cancelled connection shows *Connection Cancelled*; a cancelled signature shows *Signature Cancelled*; an expired pairing shows *Connection Expired* with a retry.

## Accessibility

The modal is a labelled dialog with focus trapping, `Esc` to close, full keyboard navigation and reduced-motion support.

## Vue and Angular

React is one of three native entrypoints. `@virio/sdk/vue` and `@virio/sdk/angular` ship the same checkout — WalletConnect, plan lookup, approvals and signing — as a `<virio-button>` element with framework-specific setup, so each framework imports its own entrypoint rather than a generic shim.

### Vue — `@virio/sdk/vue`

Install the plugin once. It registers `<virio-button>` and teaches Vue's compiler that it is a custom element, so you get no unknown-component warnings:

```ts
import { createApp } from "vue";
import { VirioVue } from "@virio/sdk/vue";

createApp(App).use(VirioVue).mount("#app");
```

```vue
<virio-button :rpc-url="rpcUrl" :plan-id="planId">Subscribe with Crypto</virio-button>
```

Prefer no plugin? A side-effect import (`import "@virio/sdk/vue"`) registers the element on its own.

### Angular — `@virio/sdk/angular`

Register the element at bootstrap and add `CUSTOM_ELEMENTS_SCHEMA` to any component that renders `<virio-button>`:

```ts
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defineVirioAngularElements } from "@virio/sdk/angular";

defineVirioAngularElements();
```

```html
<virio-button [attr.rpc-url]="rpcUrl" [attr.plan-id]="planId">Subscribe with Crypto</virio-button>
```

### Element attributes & events

In both frameworks (and in plain HTML below), attributes map to the React props: `rpc-url`, `plan-id`, `chain`, `contract-address`, `project-id`, `app-name`, `auto-connect`, `auto-sign`. Results surface as bubbling `CustomEvent`s:

```js
const btn = document.querySelector("virio-button");
btn.addEventListener("virio:success", (e) => console.log("active", e.detail));
btn.addEventListener("virio:error", (e) => console.error(e.detail));
// also: virio:connect (address), virio:pending (txHash)
```

## Plain HTML & other frameworks

`@virio/sdk/web` exposes the same `<virio-button>` for anything without a native entrypoint — plain HTML, Svelte, Solid, or any framework that renders custom elements:

```html
<script type="module">
  import "@virio/sdk/web"; // registers <virio-button>
</script>

<virio-button rpc-url="https://…" plan-id="0x123…">Subscribe with Crypto</virio-button>
```

`@virio/sdk/vanilla` still works as a deprecated alias of `@virio/sdk/web`; new integrations should import `/web`.

### Imperative API (any JS)

Open the checkout from your own button or logic — exported from `/web`, `/vue`, and `/angular` alike:

```ts
import { openVirioCheckout } from "@virio/sdk/web";

openVirioCheckout({
  rpcUrl: "https://…",
  planId: "0x123…",
  onSuccess: (subscriptionId) => console.log(subscriptionId),
});
```

### Headless core

Want your own UI? `@virio/sdk/checkout` exports the `VirioCheckout` controller (a `getState()` / `subscribe()` state machine) plus `loadPlan`, `subscribeToPlan` and the session store — build any front end on top.
