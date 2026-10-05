// ad-brand.ts — per-venture brand tokens for the ad unit. Every ad wears ITS
// venture's identity (logo, color), not a generic gray box. Keyed by the router's
// venture `key`. Colors pulled from each venture's real brand source.
// logoOnDark = the logo is light/cream → render it on a colored chip.

export interface VentureBrand {
  logo?: string;        // path under /ad-assets (public)
  logoOnDark?: boolean; // logo is light → needs a colored chip behind it
  accent: string;       // brand color (button + eyebrow)
  onAccent?: string;    // text color on the accent button (default cream)
  hero?: string;        // optional hero image/video shown beside the copy
  testimonial?: Testimonial; // renders the HTML flip card (consented quotes only)
}

/** A consented testimonial rendered as an HTML flip card (no baked images). */
export interface Testimonial {
  face?: string;   // headshot under /ad-assets/testimonials-face
  front: string;   // 1–2 sentences, verbatim (… for cuts)
  back: string;    // full quote
  name: string;
  org: string;
  look: "sl" | "gs"; // which venture's background + wordmark
}

// Consent source: data/testimonials.json (consent = public-ad). Lisa Davis held (pending).
export const TESTIMONIALS: Record<string, Testimonial> = {
  jeanEllison: {
    face: "/ad-assets/testimonials-face/jeanEllison.webp",
    front: "He took the time to understand my story. Genuinely invested in this community.",
    back: "Matt Headley captured my story in a way that was fascinating. He was so easy to talk to — he really took the time to UNDERSTAND my story. He is GENUINELY invested in this community. 10/10 highly recommend.",
    name: "Jean Ellison", org: "Jacksonville, AL", look: "sl",
  },
  samuelSawyer: {
    face: "/ad-assets/testimonials-face/samuelSawyer.webp",
    front: "He shared our passion with readers across the South.",
    back: "Matt did a wonderful job highlighting our mission at Aquality Farms. He took the time to ask questions, build a relationship and share our passion with readers across the South!",
    name: "Samuel Sawyer", org: "Aquality Farms, Alabama", look: "sl",
  },
  jessicaWhitfield: {
    face: "/ad-assets/testimonials-face/jessicaWhitfield.webp",
    front: "He asks a lot of questions to really understand what matters to you and makes you tick.",
    back: "Matt is very easy to work with. He is very intentional and interested in what makes your business creative and unique. He asks a lot of questions to really understand what matters to you and makes you tick.",
    name: "Jessica Whitfield", org: "Owner, Kingdom Focus Photography", look: "gs",
  },
};

export const VENTURE_BRAND: Record<string, VentureBrand> = {
  // GS venture CTA offers the free Plainspoken Blueprint tool, but wears the GATHER STUDIO
  // umbrella brand (green mark + forest green) — one identity, warm, matches SL's palette.
  // PSBP's #007bff blue clashed with SL's editorial warmth; GS green sits with it.
  gatherstudio: { logo: "/ad-assets/gs-wordmark.png", accent: "#3D6B4F", onAccent: "#F0EDE6", hero: "/ad-assets/ad-psbp.webp" },
  aisle:        { logo: "/ad-assets/the-aisle-cream.png", logoOnDark: true, accent: "#1e2a4a", onAccent: "#f6f1e6", hero: "/ad-assets/ad-aisle.webp" },
  sl:           { logo: "/ad-assets/sl-badge-cream-canon.png", logoOnDark: true, accent: "#9A3412", onAccent: "#F0EDE6", hero: "/ad-assets/ad-sl.webp" },
  bsr:          { accent: "#b23b6b", onAccent: "#ffffff" }, // wedding pages: face card (testimonial set below)
  sermoncoach:  { logo: "/ad-assets/sermoncoach.svg", accent: "#1f6f6f", onAccent: "#ffffff", hero: "/ad-assets/ad-sermoncoach.webp" },
  tend:         { logo: "/ad-assets/tend.svg", accent: "#8a6d3b", onAccent: "#ffffff", hero: "/ad-assets/ad-tend.webp" },
  gatherregistry: { logo: "/ad-assets/gather-registry.svg", logoOnDark: true, accent: "#0f1c13", onAccent: "#f0ede8" },
  ecclesia:     { accent: "#3f5b7a", onAccent: "#ffffff" },
  // Reader-facing default fallback — SL's own wordmark + rust, a real (not placeholder) unit.
  support:      { logo: "/ad-assets/sl-badge-cream-canon.png", logoOnDark: true, accent: "#9A3412", onAccent: "#F0EDE6" },
  // Advertiser-pitch fallback (manual/sales use only) — renders the dashed "YOUR AD HERE" rail.
  advertise:    { accent: "#9A3412", onAccent: "#F0EDE6" },
};

VENTURE_BRAND.support.testimonial = TESTIMONIALS.jeanEllison;
VENTURE_BRAND.bsr.testimonial = TESTIMONIALS.jessicaWhitfield;

export function brandFor(key: string): VentureBrand {
  return VENTURE_BRAND[key] ?? { accent: "#9a6c2f", onAccent: "#F0EDE6" };
}
