// GatherSites CMS: the editable fields on the home page, in page order grouped by section.
// Everything else (profiles, essays, the almanac, the subscribe pipeline, the dataset) stays
// out of the editor — it comes from SL's own publishing pipeline, not from here. See
// @headley/gathersites. Home renders these defaults unless Matt publishes an override from
// /edit.
import { fieldNames, textDefaults, type Section, type SiteConfig } from "@headley/gathersites";

// ── Home (/) ──────────────────────────────────────────────────────────────
export const HOME_SECTIONS: Section[] = [
  {
    title: "More Stories",
    anchor: "more-stories",
    fields: [
      ["home.more.headline", { label: "Headline", default: "More Stories" }],
      [
        "home.more.sub",
        {
          label: "Line",
          long: true,
          default: "The people behind the shops, farms, and traditions that make this region what it is.",
        },
      ],
    ],
  },
  {
    title: "Support band — Vol. 1 on sale",
    anchor: "support-band",
    fields: [
      ["home.support.sale.label", { label: "Label", group: "On sale", default: "Now available · Vol. 1" }],
      [
        "home.support.sale.headline",
        { label: "Headline", long: true, group: "On sale", default: "Southern Legends\nin print." },
      ],
      [
        "home.support.sale.body",
        {
          label: "Line",
          long: true,
          group: "On sale",
          default: "Five profiles. 200 copies. $15.\n10% supports early childhood literacy through UWECA's Imagination Library.",
        },
      ],
      ["home.support.sale.cta", { label: "Button", group: "On sale", default: "Reserve your copy — $15" }],
      ["home.support.ask.label", { label: "Label", group: "After sellout", default: "Reader-supported" }],
      [
        "home.support.ask.headline",
        { label: "Headline", long: true, group: "After sellout", default: "No paywall.\nNo sponsors picking the stories." },
      ],
      [
        "home.support.ask.body",
        { label: "Line", long: true, group: "After sellout", default: "$5 a month keeps the stories free for everyone else." },
      ],
      ["home.support.ask.cta", { label: "Button", group: "After sellout", default: "Support this work — $5" }],
    ],
  },
];

export const HOME_TEXT_DEFAULTS = textDefaults(HOME_SECTIONS);
export const HOME_EDITOR: SiteConfig = {
  slug: "southern-legends",
  name: "Southern Legends",
  greeting: "Hey Matt.",
  sections: HOME_SECTIONS,
  photos: [],
  shapes: {},
  liveUrl: "/",
};

// Only the home page publishes through the editor today, under its own path prefix
// (home.*) — one map for CmsProvider.
export const TEXT_DEFAULTS: Record<string, string> = {
  ...HOME_TEXT_DEFAULTS,
};

export const FIELD_NAMES: Record<string, string> = {
  ...fieldNames(HOME_SECTIONS, []),
};

/** Default text for a field (the page's built-in copy). */
export const t = (path: string): string => TEXT_DEFAULTS[path] ?? "";
