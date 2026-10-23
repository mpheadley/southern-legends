// Unit check for the date-driven ad picker (src/lib/ad-schedule.ts) against the bundled schedule.
// Run: node scripts/check-ad-picker.mjs   (Node 22+ loads the .ts picker directly; exits 1 on any failure)
import { readFileSync } from "node:fs";
import { pickCampaign } from "../src/lib/ad-schedule.ts";

const schedule = JSON.parse(readFileSync(new URL("../content/data/ad-schedule.json", import.meta.url), "utf8"));
const hasSilverRun = schedule.campaigns.some((c) => c.id === "aisle-silver-run-2027");
const SLOTS = ["top-strip", "band", "margin", "mobile-bar", "listicle"];
const at = (d) => new Date(`${d}T12:00:00-05:00`);

const cases = [
  ["show day", schedule, "2026-10-18", {}, "aisle-oct18"],
  ["show day, late night Central (UTC is already the 19th)", schedule, "2026-10-18T23:30:00-05:00", {}, "aisle-oct18"],
  ["day after the show", schedule, "2026-10-19", {}, "sl-support"],
  ["today", schedule, "2026-10-23", {}, "sl-support"],
  ["January", schedule, "2027-01-10", {}, hasSilverRun ? "aisle-silver-run-2027" : "sl-support"],
  ["after Silver Run", schedule, "2027-03-01", {}, "sl-support-spring"],
  ["empty list, Vol. 1 on sale", { ...schedule, campaigns: [] }, "2026-10-23", { VOL1_ON_SALE: true }, "sl-vol1-fallback"],
  ["empty list, Vol. 1 not on sale", { ...schedule, campaigns: [] }, "2026-10-23", { VOL1_ON_SALE: false }, "sl-support-fallback"],
];

let fail = 0;
for (const [name, sched, day, flags, want] of cases) {
  const when = day.includes("T") ? new Date(day) : at(day);
  for (const slot of SLOTS) {
    const got = pickCampaign(sched, "southern-legends", slot, when, flags)?.campaign.id ?? "(none)";
    if (got !== want) { fail++; console.log(`FAIL ${name} ${slot}: got ${got}, want ${want}`); }
  }
  console.log(`ok   ${name.padEnd(55)} → ${want}`);
}
const other = pickCampaign(schedule, "some-client-site", "band", at("2026-10-23"));
if (other) { fail++; console.log(`FAIL other site got ${other.campaign.id}`); } else console.log("ok   other site gets nothing from SL-only campaigns");
console.log(fail ? `${fail} failure(s)` : "all picker checks passed");
process.exit(fail ? 1 : 0);
