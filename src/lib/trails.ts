export type TrailSurface = "paved" | "gravel" | "dirt" | "mixed"
export type TrailDifficulty = "easy" | "moderate" | "hard" | "strenuous"
export type TrailUse = "hiking" | "biking" | "running" | "horses" | "rail-trail"

export interface Trail {
  slug: string
  name: string
  shortName: string
  region: string
  state: string
  length: number // miles
  lengthNote?: string
  difficulty: TrailDifficulty
  surface: TrailSurface
  uses: TrailUse[]
  description: string
  history: string
  highlights: string[]
  startLat: number
  startLng: number
  elevationGain?: number // feet
  website?: string
  alltrailsUrl?: string
  dogs: boolean
  fee: boolean
  feeNote?: string
  image?: string
  tags: string[]
}

export const TRAILS: Trail[] = [
  {
    slug: "chief-ladiga-trail",
    name: "Chief Ladiga Trail",
    shortName: "Chief Ladiga",
    region: "NE Alabama",
    state: "AL",
    length: 33,
    lengthNote: "Cleburne County trailhead to Piedmont",
    difficulty: "easy",
    surface: "paved",
    uses: ["biking", "hiking", "running"],
    description: "A 33-mile paved rail trail running through the heart of Cleburne County, Alabama — past cotton fields, small towns, and the edge of the Talladega National Forest. One of the finest rail trails in the Southeast.",
    history: "Built on the right-of-way of the Seaboard Air Line Railroad, Chief Ladiga connects Cleburne County to the Silver Comet Trail in Georgia, forming part of a 100+ mile corridor. Named for Chief Ladiga (Autosse), a Creek chief who led his people through this land during the removal era.",
    highlights: [
      "Connects to the Silver Comet Trail in Georgia",
      "Paved surface — accessible to all fitness levels",
      "Passes through Cleburne County towns of Heflin and Piedmont",
      "Wildlife: deer, wild turkey, hawks along forested sections",
      "Borden Springs rest stop at the midpoint",
    ],
    startLat: 33.6518,
    startLng: -85.5832,
    elevationGain: 280,
    website: "https://www.chiefladiga.com",
    alltrailsUrl: "https://www.alltrails.com/trail/us/alabama/chief-ladiga-trail",
    dogs: true,
    fee: false,
    image: "/images/journal/chief-ladiga-trail-snow-2017.webp",
    tags: ["rail-trail", "paved", "family-friendly", "cleburne-county", "clt"],
  },
  {
    slug: "silver-comet-trail",
    name: "Silver Comet Trail",
    shortName: "Silver Comet",
    region: "NW Georgia / NE Alabama",
    state: "GA/AL",
    length: 61.5,
    lengthNote: "Smyrna GA to Alabama state line — connects to Chief Ladiga",
    difficulty: "easy",
    surface: "paved",
    uses: ["biking", "hiking", "running"],
    description: "A 61.5-mile paved rail trail from suburban Atlanta to the Alabama state line, where it connects seamlessly with the Chief Ladiga Trail. Together they form one of the longest paved trail corridors in the eastern United States.",
    history: "Built on the former Seaboard Air Line Railroad right-of-way. The Silver Comet was a famous passenger train that ran from New York to Birmingham in the mid-20th century. The trail opened in sections beginning in 1998.",
    highlights: [
      "Connects directly to Chief Ladiga Trail at the Alabama line",
      "Combined with CLT: 94+ miles of paved trail",
      "Passes through Cedartown, Rockmart, and Tallatoona",
      "Multiple trailheads with parking and restrooms",
      "Atlanta metro access at Smyrna terminus",
    ],
    startLat: 33.8839,
    startLng: -84.5144,
    elevationGain: 420,
    website: "https://www.silvercomet.com",
    alltrailsUrl: "https://www.alltrails.com/trail/us/georgia/silver-comet-trail",
    dogs: true,
    fee: false,
    image: "/images/journal/chief-ladiga-trail-heather-bike.webp",
    tags: ["rail-trail", "paved", "family-friendly", "georgia", "silver-comet"],
  },
  {
    slug: "coldwater-mountain",
    name: "Coldwater Mountain",
    shortName: "Coldwater",
    region: "NE Alabama",
    state: "AL",
    length: 25,
    lengthNote: "25+ miles of singletrack across the trail system",
    difficulty: "moderate",
    surface: "dirt",
    uses: ["biking", "hiking"],
    description: "An IMBA Epic-designated mountain bike trail system on the edge of Oxford, Alabama. Built on reclaimed mine land, Coldwater Mountain is one of the best trail systems in the Southeast — technical singletrack through hardwood forest with Anniston as the backdrop.",
    history: "Developed on land owned by the city of Oxford on former mining property. The trail system was built with community volunteer labor and is maintained by the Coldwater Mountain Bike Association. IMBA Epic designation places it among the top trail systems in the country.",
    highlights: [
      "IMBA Epic designation",
      "Flow trails, technical singletrack, beginner loops",
      "Views of Anniston and the Piedmont Plateau",
      "Coldwater Mountain Brewpub at the trailhead",
      "Active volunteer trail building community",
    ],
    startLat: 33.6006,
    startLng: -85.8177,
    elevationGain: 1800,
    website: "https://coldwatermountain.com",
    alltrailsUrl: "https://www.alltrails.com/trail/us/alabama/coldwater-mountain-bike-trail",
    dogs: true,
    fee: false,
    // no image: the only file on hand was AI-generated (real photos only)
    tags: ["mountain-bike", "singletrack", "imba-epic", "oxford-al", "technical"],
  },
  {
    slug: "pinhoti-trail",
    name: "Pinhoti Trail",
    shortName: "Pinhoti",
    region: "NE Alabama / NW Georgia",
    state: "AL/GA",
    length: 337,
    lengthNote: "172 miles in Alabama, 165 miles in Georgia",
    difficulty: "strenuous",
    surface: "dirt",
    uses: ["hiking"],
    description: "A 337-mile long-distance footpath through the Talladega National Forest and the Blue Ridge Mountains of Georgia. The Pinhoti is the southern anchor of a continuous trail system that connects to the Appalachian Trail through Virginia.",
    history: "Pinhoti is a Creek word meaning 'turkey home.' The trail was developed through the combined efforts of the Forest Service, Alabama and Georgia trail alliances, and hundreds of volunteer trail builders. It links to the Benton MacKaye Trail in Georgia, which connects to the AT.",
    highlights: [
      "Passes through Cheaha State Park — Alabama's highest point",
      "Remote sections through Talladega National Forest",
      "Thru-hiking culture growing rapidly",
      "Connects to Appalachian Trail via Benton MacKaye",
      "Abundant wildlife: black bear, wild turkey, whitetail deer",
    ],
    startLat: 33.4818,
    startLng: -85.9482,
    elevationGain: 42000,
    website: "https://pinhotitrailalliance.org",
    alltrailsUrl: "https://www.alltrails.com/trail/us/alabama/pinhoti-trail",
    dogs: true,
    fee: false,
    image: "/images/journal/matt-headley-hiking.webp",
    tags: ["long-distance", "backpacking", "thru-hiking", "talladega", "cheaha"],
  },
  {
    slug: "cheaha-state-park-trails",
    name: "Cheaha State Park Trails",
    shortName: "Cheaha",
    region: "NE Alabama",
    state: "AL",
    length: 18,
    lengthNote: "Multiple trail systems within the park",
    difficulty: "moderate",
    surface: "mixed",
    uses: ["hiking", "running"],
    description: "A network of trails surrounding Alabama's highest point at 2,407 feet. Cheaha offers dramatic overlooks, rocky ridge walks, and connections to the Pinhoti Trail through the Talladega National Forest.",
    history: "Cheaha State Park was established in 1933, built by the Civilian Conservation Corps. The name comes from the Creek word meaning 'high place.' The park sits within the Talladega National Forest and draws hikers, campers, and photographers year-round.",
    highlights: [
      "Cheaha Mountain — Alabama's highest point at 2,407 ft",
      "Boulderfield and rocky outcrops with 360° views",
      "Pulpit Rock and Cheaha Lake",
      "Pinhoti Trail access",
      "CCC-era stone structures throughout the park",
    ],
    startLat: 33.4854,
    startLng: -85.8054,
    elevationGain: 1200,
    website: "https://alapark.com/parks/cheaha-state-park",
    alltrailsUrl: "https://www.alltrails.com/trail/us/alabama/cheaha-mountain-trail",
    dogs: true,
    fee: true,
    feeNote: "$5/vehicle day use",
    image: "/images/journal/the-trail-at-night.webp",
    tags: ["state-park", "summit", "views", "cleburne-county", "pinhoti-access"],
  },
  {
    slug: "oxford-lake-trail",
    name: "Oxford Lake Trail",
    shortName: "Oxford Lake",
    region: "NE Alabama",
    state: "AL",
    length: 3.5,
    difficulty: "easy",
    surface: "paved",
    uses: ["hiking", "running", "biking"],
    description: "A 3.5-mile paved loop around Oxford Lake in the heart of Oxford, Alabama. The city's most accessible trail — flat, scenic, and busy on weekends. A family staple that feeds into the larger Coldwater Mountain system nearby.",
    history: "Oxford Lake has been the recreational heart of Oxford since the city developed its parks system in the 1970s. The paved trail loop was expanded and improved in the 2010s as part of Oxford's push to become a recreation destination to complement Coldwater Mountain.",
    highlights: [
      "Flat paved loop — accessible to all ages and abilities",
      "Wetland boardwalk section with bird watching",
      "Fishing pier and boat launch on the lake",
      "Connects to Oxford's broader greenway system",
      "Playground and pavilions throughout",
    ],
    startLat: 33.5917,
    startLng: -85.8357,
    elevationGain: 25,
    website: "https://www.oxfordal.gov",
    dogs: true,
    fee: false,
    image: "/images/journal/chief-ladiga-trail-peugeot-park.webp",
    tags: ["paved", "lake", "family-friendly", "oxford-al", "flat"],
  },
  {
    slug: "choccolocco-creek-greenway",
    name: "Choccolocco Creek Greenway",
    shortName: "Choccolocco Greenway",
    region: "NE Alabama",
    state: "AL",
    length: 7,
    lengthNote: "Planned 7-mile corridor; portions complete",
    difficulty: "easy",
    surface: "mixed",
    uses: ["hiking", "biking", "running"],
    description: "A developing greenway corridor along Choccolocco Creek connecting Anniston and Oxford. When complete, the Choccolocco Greenway will link downtown Anniston to the Oxford Lake Trail and the broader NE Alabama trail network.",
    history: "The Choccolocco Creek Greenway is a regional trail project supported by the City of Anniston, Oxford, and Calhoun County. Funded through ATRIP and RAISE federal grants, it represents one of the most significant trail investments in the area's history.",
    highlights: [
      "Connects Anniston and Oxford via creek corridor",
      "Wildlife habitat along Choccolocco Creek",
      "Links to Oxford Lake Trail and Coldwater Mountain",
      "Part of the larger NE Alabama trail network vision",
      "Active advocacy through local trail coalition",
    ],
    startLat: 33.6571,
    startLng: -85.8331,
    elevationGain: 60,
    dogs: true,
    fee: false,
    image: "/images/profiles/anniston-museums-gardens/bird-of-prey-trail.webp",
    tags: ["greenway", "urban", "developing", "anniston", "oxford-al"],
  },
]

export function getTrail(slug: string): Trail | undefined {
  return TRAILS.find(t => t.slug === slug)
}

export function getTrailsByRegion(region: string): Trail[] {
  return TRAILS.filter(t => t.region.toLowerCase().includes(region.toLowerCase()))
}

export function getTrailsByTag(tag: string): Trail[] {
  return TRAILS.filter(t => t.tags.includes(tag))
}

export function difficultyLabel(d: TrailDifficulty): string {
  return { easy: "Easy", moderate: "Moderate", hard: "Hard", strenuous: "Strenuous" }[d]
}

export function difficultyColor(d: TrailDifficulty): string {
  return { easy: "#16a34a", moderate: "#ca8a04", hard: "#ea580c", strenuous: "#dc2626" }[d]
}

export function surfaceLabel(s: TrailSurface): string {
  return { paved: "Paved", gravel: "Gravel", dirt: "Dirt/Natural", mixed: "Mixed" }[s]
}
