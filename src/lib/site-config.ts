export const siteConfig = {
  name: "Southern Legends",
  tagline: "Stories from the Appalachian Foothills of Northeast Alabama",
  description:
    "Spotlighting the makers, builders, and business owners who define life in Alabama's Appalachian foothills.",
  url: "https://southernlegends.org",
  author: "Matt Headley",
  authorRole: "Founding Editor, Southern Legends",
  /** The bar: five sections + Support (redesign B-02). */
  nav: [
    { label: "Stories", href: "/profiles" },
    { label: "Places", href: "/places" },
    { label: "Essays", href: "/essays" },
    { label: "Guides", href: "/listicles" },
    { label: "About", href: "/about" },
  ],
  /** Everything else lives in the mobile sheet and the footer, never in the bar. */
  mobileNav: [
    { title: "Read", links: [
      { label: "Stories", href: "/profiles" },
      { label: "Essays", href: "/essays" },
      { label: "Guides", href: "/listicles" },
      { label: "Faith column", href: "/faith" },
      { label: "Books", href: "/books" },
    ]},
    { title: "Explore", links: [
      { label: "Places", href: "/places" },
      { label: "Map", href: "/map" },
      { label: "Trails", href: "/trails" },
      { label: "Parks", href: "/parks" },
      { label: "The Land", href: "/land" },
      { label: "Arts", href: "/arts" },
    ]},
    { title: "More", links: [
      { label: "Theology", href: "/theology" },
      { label: "About", href: "/about" },
      { label: "Merch", href: "/merch" },
    ]},
  ],
  /** Footer-only sections (also in the mobile sheet). */
  footerSections: [
    { label: "Map", href: "/map" },
    { label: "Trails", href: "/trails" },
    { label: "Parks", href: "/parks" },
    { label: "Arts", href: "/arts" },
    { label: "The Land", href: "/land" },
    { label: "Theology", href: "/theology" },
    { label: "Faith column", href: "/faith" },
    { label: "Books", href: "/books" },
    { label: "Merch", href: "/merch" },
  ],
  podcast: {
    rssUrl: "https://southernlegends.org/podcast/feed.xml",
    spotify: "https://open.spotify.com/show/033rE2IJkbyZuLXZwEjtgo",
    apple: "https://podcasts.apple.com/podcast/id1896892029",
    youtube: "https://www.youtube.com/@mpheadley",
  },
};
