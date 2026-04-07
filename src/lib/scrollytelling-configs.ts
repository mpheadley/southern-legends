/**
 * Scrollytelling section configs per profile slug.
 * Phase 1: hand-mapped. Phase 2: auto-parsed from MDX headings + ArticleImage tags.
 */

const IMG = "/images/profiles/aquality-farms";

export const scrollytellingConfigs: Record<string, any> = {
  "aquality-farms": {
    heroTitle: "A New Way of Growing",
    heroTitleHtml: 'A New Way<br /><em>of Growing.</em>',
    heroSubtitle: "Samuel & John Mark Sawyer — Aquality Farms, Anniston",
    heroImage: `${IMG}/sawyer-brothers-grow-room.webp`,
    heroAlt: "Samuel and John Mark Sawyer standing in the Aquality Farms grow room with vertical lettuce towers",
    heroPosition: "center 35%",
    eyebrow: "Southern Legends",
    authorName: "Matt Headley",
    authorBio: 'lives in Jacksonville, Alabama. He builds websites for local businesses at headleyweb.com and writes about the people and places he finds along the way.',
    slug: "aquality-farms",

    sections: [
      {
        // Section 0: prose before Panel 1
        prose: {
          paragraphs: [
            "Samuel Sawyer showed up at the downtown Anniston farmers market one Saturday morning with a pair of big white coolers and no booth reputation. I'd been shopping the market for years and helping Heather sell flowers there for a couple by then. He hauled everything in by hand. Mushrooms, lettuce, tinctures. Had a juice he'd offer samples of. My kids begged for it every week after that.",
            "People started lining up at the booth. Not just to buy, but also to ask questions. Samuel would pull a mushroom out of the cooler and start explaining how it grew. John Mark would already be talking to the next person in line. They never rushed anybody.",
            "We became business partners. Heather and I grew flowers for his Harvest Box, he shared mushroom compost with us. I miss those Saturday mornings.",
            "But I didn't know what I was watching start. Samuel told me once the whole thing began with notes on a napkin. What I didn't realize was that napkin had five years of research behind it before he ever set up those coolers.",
            "What he and his brother built from that plan is one of the most interesting things happening in downtown Anniston right now. They're growing 24,000 heads of lettuce and 300 pounds of gourmet mushrooms a week. In a 6,000-square-foot converted warehouse on Wilmer Avenue.",
          ],
          image: {
            src: `${IMG}/samuel-john-mark.webp`,
            alt: "Samuel and John Mark Sawyer at the Aquality Farms booth",
            caption: "Samuel and John Mark at the market. Two brothers, one mission.",
            width: 2048,
            height: 1536,
          },
        },
        panel: {
          heading: "The Warehouse",
          text: "1414 Wilmer Avenue. Three generations. A pharmacy, a produce business, a hydroponic farm. Same building, same family, new method.",
          detail: "They spent six years studying before they touched a wall.",
          bgImage: `${IMG}/lettuce-under-lights.webp`,
          bgAlt: "Lettuce growing under colored LED grow lights at Aquality Farms",
          caption: "Lettuce under the grow lights. No soil, no sunlight, no pesticides.",
        },
      },
      {
        // Section 1: prose after Panel 1, before Panel 2
        prose: {
          paragraphs: [
            "The building at 1414 Wilmer Avenue has been in the Sawyer family for thirty years. Three generations in Anniston. Their grandparents ran Sawyer Anniston Pharmacy from the late sixties until 1999. Their father Mark ran a produce business out of the same building. When Samuel and John Mark decided to bring the space back to life, they kept the mission and changed the method.",
            "They spent six years studying hydroponics before they touched a wall. At the start of 2024, they began renovating. By April 2025, they cut the ribbon on the storefront.",
            "The front 2,000 square feet is devoted to lettuce and microgreens. Vertical towers grow heads of lettuce in six-week cycles. No soil, no pesticides. Just water, nutrients, and light. 24,000 heads per cycle.",
            "The back 1,000 square feet is the mushroom lab. Lion's Mane, Oyster, Chestnut, Reishi. They started 2026 by building a new fruiting chamber: coated floors, FRP walls, blue-spectrum lights that trigger pinning earlier. A new incubation room is going in now. Samuel knows the science behind every species in there, and he'll talk about it if you let him.",
          ],
          image: {
            src: `${IMG}/mushroom-grow-kits.webp`,
            alt: "Boxed mushroom grow kits from Aquality Farms",
            caption: "Mushroom grow kits, boxed and ready. Lion's Mane, Oyster, Chestnut, Reishi.",
            width: 2048,
            height: 1536,
          },
        },
        panel: {
          heading: "The Mission",
          text: "Health for the individual, community and the environment. This is much more than a business.",
          detail: "35,000 students. No acreage. Just a warehouse and a method.",
          bgImage: `${IMG}/products-spread.webp`,
          bgAlt: "Aquality Farms products display",
          caption: "Harvest Box contents, mushroom tinctures, and wellness products.",
        },
      },
      {
        // Section 2: prose after Panel 2, before Panel 3
        prose: {
          paragraphs: [
            'When I asked Samuel what drives the farm, he didn\'t hesitate: "The overarching theme in what we do is centered around health. Health for the individual, community and the environment. This is much more than a business, it gives people access to natural wellness products, a different perspective and more importantly a community that listens and supports."',
            "They're partnered with the Alabama Farm to School Program, supplying pesticide-free produce to over 35,000 students across the region. The storefront sells direct to the public. Fresh produce, herbs, mushroom tinctures, ultrasonic mushroom extracts, microgreen powders.",
            "This year they launched a School Sponsorship Program, letting local businesses and organizations fund pesticide-free produce for students directly. Growing the food was the first problem. Paying for it to reach kids was the second. The sponsorship program solves the second one.",
            'When I asked Samuel if there was ever a moment where it all felt too risky or too big, he wrote back: "The hardest part was getting over the fear of failing, the perception of failure by others but every time I have failed in my life it has made me stronger and the man I am today."',
            'He said it like he\'d already tested it. He added: "This is my purpose on this planet at this chapter in my journey and I am enjoying building an impactful brand that can positively change people\'s lives with my brother."',
          ],
          image: {
            src: `${IMG}/tinctures-lab.webp`,
            alt: "Tincture line with extraction equipment at Aquality Farms",
            caption: "The tincture line. Mushroom extracts, microgreen powders, wellness products.",
            width: 2048,
            height: 1536,
          },
          pullQuote: "What matters is doing what we know is right, what we are called to do and the rest will take care of itself.",
        },
        panel: {
          heading: "Chaha Outdoors",
          text: 'The Creek word for "high place." Same root as Cheaha Mountain, thirty minutes from Anniston. Same mission as the farm, different door.',
          detail: "The farm grows food. Chaha gets you outside.",
          bgImage: `${IMG}/sam-chaha-trail.webp`,
          bgAlt: "Samuel Sawyer on a trail run in Calhoun County",
          caption: "Samuel on the trails through Chaha Outdoors.",
          contentAlign: "right",
        },
      },
      {
        // Section 3: prose after Panel 3, before Panel 4
        prose: {
          paragraphs: [
            "Samuel leads wellness walks, shows up at races with the Anniston Runners Club, and talks up every trail in Calhoun County to anyone who'll listen. Chief Ladiga, Coldwater Mountain, Pinhoti.",
            "The farm grows food that's good for you. Chaha gets you outside. One operates from a warehouse. The other from a trailhead. Same mission, different door.",
            "Samuel is also a co-founder of the Northeast Alabama Wellness Alliance. The farm, the trails, the alliance. It all connects.",
          ],
        },
        panel: {
          heading: "Still Growing",
          text: "Every new business that opens downtown is a bet that the revitalization is real. Samuel and John Mark made that bet with a warehouse, some vertical towers, and a mushroom lab.",
          detail: "And they're winning. In the pounds-of-produce-per-week sense.",
          bgImage: `${IMG}/sam-farmers-market.webp`,
          bgAlt: "Samuel Sawyer at the farmers market with mushrooms and tinctures",
          bgPosition: "center 20%",
          caption: "Samuel at the farmers market. This is where we met.",
          contentAlign: "right",
        },
      },
    ],

    closingProse: [
      "For years I'd walk down Wilmer Avenue when I worked downtown. Walked right past that humble warehouse a hundred times. Had no idea what was growing in there.",
    ],
    closingInfo:
      'Aquality Farms is located at 1414 Wilmer Avenue, Anniston, AL 36201. Open Monday–Friday 9:00 AM–5:30 PM, Saturday 10:00 AM–4:00 PM. For products and wellness items, visit <a href="https://www.aqualityfarms.com/">aqualityfarms.com</a>.',
  },
};
