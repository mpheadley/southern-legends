// "Sponsor a story" price ladder: the one home for the sponsor price. /sponsor reads CURRENT.
// Steps move on readership triggers, not dates; BOTH conditions must hold before stepping up.
// (Decided 2026-10-05 with the Fable review; plan: reports/sl-strategy/sponsor-pricing-plan.md.)
// Existing sponsors keep their rate for one repeat story within 12 months, told in advance of any change.

export interface SponsorStep {
  key: "founding" | "step2" | "step3" | "step4";
  price: number;
  trigger: string;
  includes: string[];
}

export const SPONSOR_STEPS: SponsorStep[] = [
  {
    key: "founding",
    price: 150,
    trigger: "Now (founding rate while the readership is small)",
    includes: ["Honest story, labeled Sponsored at the top", "You read it before it runs",
      "A mention in the next letter to subscribers", "A post on the Southern Legends Facebook page"],
  },
  {
    key: "step2",
    price: 250,
    trigger: "3 sponsored stories sold AND 150 subscribers",
    includes: ["Everything above", "A second Facebook post two weeks later", "A photo set you can reuse"],
  },
  {
    key: "step3",
    price: 400,
    trigger: "300 subscribers AND a sponsored story with 25+ clicks from the letter",
    includes: ["Everything above", "The short video, delivered as a file you own"],
  },
  {
    key: "step4",
    price: 600,
    trigger: "750 subscribers, or a sponsor asks for a repeat",
    includes: ["Everything above", "Six months of a Supporter line in the letter footer"],
  },
];

// Change this key (and nothing else) when a trigger is met. Post the new price on /sponsor before it applies.
export const CURRENT_STEP: SponsorStep["key"] = "founding";

export const CURRENT = SPONSOR_STEPS.find((s) => s.key === CURRENT_STEP)!;

// Extras above the founding package, cumulative through the current step (for the /sponsor list).
export function extrasThroughCurrent(): string[] {
  const idx = SPONSOR_STEPS.findIndex((s) => s.key === CURRENT_STEP);
  return SPONSOR_STEPS.slice(1, idx + 1).flatMap((s) => s.includes.filter((i) => i !== "Everything above"));
}
