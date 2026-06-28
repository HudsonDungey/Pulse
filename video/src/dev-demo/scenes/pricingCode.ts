// The pricing/page.tsx file shown in S2/S3. One source so the ship scene shows
// exactly what was typed. The REAL integration: VirioButton from
// '@virio/sdk/react' — planId is the only required prop; token, amount,
// interval and chain come from the contract.

import type {CodeLine} from '../CodeEditor';
import {PLAN_ID} from '../theme';

export const IMPORT_LINE = `import { VirioButton } from '@virio/sdk/react';`;
export const PLANID_LINE = `              planId="${PLAN_ID}"`;

interface Timing {
  importAt: number;
  jsxAt: number;
  pasteAt: number;
  onSuccessAt: number;
  closeAt: number;
}

// `timing` undefined → every line static and complete (S3).
export function pricingLines(timing?: Timing): CodeLine[] {
  const t = (typeStart?: number, paste?: boolean): Partial<CodeLine> =>
    timing ? {typeStart, paste, flashGutter: true} : {flashGutter: true};
  return [
    {text: `'use client';`, dim: true},
    {text: IMPORT_LINE, ...t(timing?.importAt)},
    {text: ``, dim: true},
    {text: `const tiers = [`, dim: true},
    {text: `  { name: 'Hobby', price: 0 },`, dim: true},
    {text: `  { name: 'Pro', price: 20 },`, dim: true},
    {text: `  { name: 'Team', price: 60 },`, dim: true},
    {text: `];`, dim: true},
    {text: ``, dim: true},
    {text: `export default function PricingPage() {`, dim: true},
    {text: `  return (`, dim: true},
    {text: `    <main className="pricing">`, dim: true},
    {text: `      {tiers.map((tier) => (`, dim: true},
    {text: `        <PricingCard key={tier.name} tier={tier}>`, dim: true},
    {text: `          {tier.name === 'Pro' ? (`, dim: true},
    {text: `            <VirioButton`, ...t(timing?.jsxAt)},
    {text: PLANID_LINE, ...t(timing?.pasteAt, true)},
    {text: `              onSuccess={handleSubscribed}`, ...t(timing?.onSuccessAt)},
    {text: `            />`, ...t(timing?.closeAt)},
    {text: `          ) : (`, dim: true},
    {text: `            <BuyButton tier={tier} />`, dim: true},
    {text: `          )}`, dim: true},
    {text: `        </PricingCard>`, dim: true},
    {text: `      ))}`, dim: true},
    {text: `    </main>`, dim: true},
    {text: `  );`, dim: true},
    {text: `}`, dim: true},
  ];
}
