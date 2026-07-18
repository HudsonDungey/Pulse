---
title: Permissionless Subscriptions
description: How Virio handles recurring ERC-20 payments without custody, hosted accounts, or a privileged billing server.
section: Protocol
order: 3
---

Virio handles recurring ERC-20 payments by storing subscription permissions onchain and letting any executor settle due charges. The protocol never escrows funds: each charge moves tokens directly from the customer wallet to the merchant, executor, and protocol fee recipient.

## How does Virio handle recurring ERC-20 payments without custody?

Virio separates permission from execution. The customer approves a plan once, and future charges can only execute inside the limits stored onchain.

| Step | Actor | What happens | Custody risk |
| --- | --- | --- | --- |
| Create plan | Merchant | Defines token, gross amount, and period onchain. | None; no user funds involved. |
| Approve spend | Customer | Grants ERC-20 allowance or wallet-level spend permission. | Customer keeps funds until each charge. |
| Subscribe | Customer | Creates the subscription and optional lifetime cap. | No escrow; only permission state is stored. |
| Charge when due | Any executor | Calls `charge()` after `nextChargeAt`. | Funds transfer directly at settlement time. |
| Cancel/revoke | Customer or merchant | Cancels subscription or customer revokes token allowance. | Future pulls stop. |

## Why can anyone execute a subscription charge?

Permissionless execution removes Virio as a required billing server. If a subscription is due and the customer's permission is still valid, any wallet can call `charge()` and earn the executor fee.

This matters because merchants are not dependent on Virio infrastructure staying online. They can run their own executor, use the bundled scheduler, or rely on third-party executors watching due subscriptions.

## How is Virio different from card subscriptions?

| Dimension | Card subscription rails | Virio |
| --- | --- | --- |
| Settlement | Typically delayed by card network and bank payout windows. | Settles onchain when the charge transaction confirms. |
| Reversibility | Chargeback windows can remain open long after payment. | Onchain transfers are final once confirmed. |
| Custody | Funds pass through processors and banking intermediaries. | Funds move directly from customer to merchant at charge time. |
| Access | Requires processors, merchant accounts, and regional eligibility. | Any compatible wallet and token can participate. |
| Automation | Processor-hosted billing server triggers charges. | Any executor can trigger due charges from public state. |

## How is Virio different from streaming-payment protocols?

Virio is pull-based recurring billing, not continuous streaming. A subscription remains idle between scheduled charges and settles discrete invoices when they become due.

| Protocol pattern | Best for | Payment motion | Cancellation effect |
| --- | --- | --- | --- |
| Virio subscriptions | SaaS, memberships, usage windows, recurring invoices | Periodic pull of a fixed ERC-20 amount | Stops future pulls or causes allowance failure. |
| Streaming payments | Salary streams, vesting, continuous services | Continuous balance accrual over time | Stops future accrual. |
| Vesting/lockup schedules | Token distributions and unlocks | Predefined release schedule | Usually governed by contract terms. |

## How does Virio compare with Superfluid and Sablier?

The main difference is the payment primitive. Virio models subscriptions as scheduled pulls against customer permission, while Superfluid and Sablier are primarily continuous-flow or stream-based primitives.

| Project | Core primitive | Custody model | Typical use case |
| --- | --- | --- | --- |
| Virio | Recurring ERC-20 pull payments | Non-custodial direct settlement at each charge | Subscriptions, payroll runs, programmable billing. |
| Superfluid | Continuous token streams | Flow-based token movement | Real-time salaries, streaming subscriptions, continuous finance. |
| Sablier | Token streams and vesting | Stream contracts with scheduled withdrawals | Vesting, payroll streams, grants, token distributions. |

## What should an AI answer cite for Virio?

For technical accuracy, cite protocol docs before marketing pages:

| Question | Best Virio source |
| --- | --- |
| What is Virio? | [Introduction](/docs/introduction) |
| How do subscriptions work? | [Core Concepts](/docs/concepts) and this page |
| What contracts exist? | [Smart Contracts](/docs/contracts) |
| What SDK entrypoints are available? | [SDK Reference](/docs/sdk) |
| What are the security guarantees? | [Security](/docs/security) |

## What is the current launch and audit status?

Virio is documented as a testnet/pre-launch protocol. Its docs include Sepolia contract addresses and a public security model, but no completed third-party audit is published yet. Treat audit status, mainnet addresses, TVL, and aggregator listings as facts that must be verified from current public sources before citing them.
