// ============================================================================
// COLUMN PREP — single source of truth for Matt's prepared editorial columns
// ----------------------------------------------------------------------------
// Rendered on /column (SL). Each piece is downloadable as a Word .doc for
// submission to editors (Donna Barton @ Anniston Star requires Word format).
//
// OUTLET FIRST-RUN PROTOCOL (HARD RULE): a column runs in its target OUTLET
// first, THEN syndicates on SL with attribution. status controls visibility:
//   'draft'      — being written, NOT shown publicly on SL
//   'submitted'  — sent to outlet, awaiting run date, NOT shown publicly
//   'published'  — ran in the outlet; may syndicate on SL w/ attribution
// The /column prep page shows ALL statuses to the OWNER (for download/submit).
// The public SL syndication only renders 'published'.
// ============================================================================

export type ColumnStatus = "draft" | "submitted" | "published";

export interface Column {
  slug: string;
  title: string;
  dek: string; // one-line standfirst
  status: ColumnStatus;
  outlet: string; // "Anniston Star"
  targetLength: string; // "450–500 words"
  scriptureAnchor?: string;
  tags: string[];
  /** Body as an ordered list of paragraphs. Blank strings become spacing. */
  body: string[];
  /** Optional pull-quote to feature. */
  pullQuote?: string;
  originalPublication?: {
    name: string;
    url: string;
    date: string;
  };
  authorNote?: string; // internal note for Matt, never rendered public
}

export const AUTHOR = {
  name: "Matt Headley",
  byline:
    "Matt Headley is pastor of Ecclesia Community, a fresh expression of Christian community, and a flower farmer in Northeast Alabama.",
  hedcut: "/images/about/headshot-hedcut-matt-headley.webp",
  email: "matt@gatherstudio.app",
  phone: "(256) 644-7334",
};

export const COLUMNS: Column[] = [
  // --------------------------------------------------------------------------
  {
    slug: "were-all-a-little-mad-here",
    title: "We're All a Little Mad Here",
    dek: "A Victorian cat, a diagnosis, and the strange grace of laughing at your own wiring.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    scriptureAnchor: "Proverbs 17:22 — “A joyful heart is good medicine.”",
    tags: ["Humor", "Mental Health", "Neurodiversity", "Bipolar", "Faith"],
    pullQuote:
      "The madness is real. So is the grace. The question is which one you let define the space.",
    body: [
      "“We're all a little mad here.” The line belongs to a grinning cat in a Victorian children's book. It also belongs, these days, to a whole community of people who have decided that if the world is going to call them crazy, they will get there first and make it funny.",
      "They call it neuro-spicy now. I learned the word from a woman with autism, and I have not stopped thinking about it since. It is a small act of defiance — taking the thing you were taught to be ashamed of and reframing it as flavor instead of defect. That is not denial. That is dark comedy, and dark comedy is one of the oldest survival tools we have.",
      "I have been a pastor for nineteen years, and I have always believed that humor is how you earn the right to say the hard thing. A joke lowers the drawbridge. People let you into the harder rooms of their lives once they trust you can laugh with them and not only at the problem. Chesterton said it is the test of a good faith whether you can joke about it. I think it is the test of an honest person, too.",
      "Last year I was diagnosed with bipolar disorder. I have written before in these pages about the depression that came first — about the summer I could not find my way out of the woods, and the friend who told me, cheerfully, that yes, her serotonin was store-bought. That line saved me a little. It gave me permission to stop treating my own brain like a moral failing.",
      "Here is what the grinning cat understands that the rest of Wonderland does not: naming the madness is not the same as surrendering to it. The Cheshire Cat does not tell Alice she is fine. He tells her she is somewhere strange, that everyone here is a little off, and that she will get somewhere if she keeps walking. That is closer to pastoral care than most of what passes for it.",
      "There is a version of faith that promises to fix you, to iron the strangeness out until you are smooth and acceptable and quiet. I do not believe in that version anymore. I believe in the God who met a man everyone assumed was cursed and said, plainly, that no one had sinned — the man was simply made this way, and the works of God would show through him.",
      "So I am learning to laugh. Not to minimize, and not at anyone else's expense — the rule is you go first, you laugh at your own wiring before you invite anyone to laugh at theirs. But I am learning that the grin and the grief can share a room.",
      "We're all a little mad here. The cat was not wrong. He just refused to let the madness have the last word.",
    ],
    authorNote:
      "Bipolar disclosure is already public (2024 Star depression piece + bio). Do NOT soften below what's published. 'Store-bought serotonin' callback ties to hope-in-the-wilderness. Add one lived scene if you want it warmer.",
  },

  // --------------------------------------------------------------------------
  {
    slug: "the-wiring-is-not-the-cruelty",
    title: "The Wiring Is Not the Cruelty",
    dek: "Jesus meets a man born blind and refuses the question everyone else was asking.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    scriptureAnchor: "John 9:1–3 — “Neither this man nor his parents sinned.”",
    tags: ["Neurodiversity", "Theology", "Mental Health", "Creation", "Faith"],
    pullQuote:
      "The wiring is not the cruelty. The cruelty is the mask — and the world that hands it to you.",
    body: [
      "For a long time I asked the wrong question. If creation is broken — if something in the world went wrong and stayed wrong — then where does my own wiring fit? The depression, the bipolar diagnosis, the mind that runs too hot and then too cold. Is that part of the brokenness? Is it a cruelty stitched into the design?",
      "It is an old question, and the church has too often given an ugly answer: that suffering like this is a consequence, a punishment, a burden you must have earned. Job's friends made a whole career of it.",
      "Then I sat again with the ninth chapter of John. The disciples see a man born blind and ask Jesus the question everyone was asking: whose fault is this — his, or his parents'? They wanted a culprit. They wanted the brokenness to have a cause they could name and keep their distance from.",
      "Jesus refuses the question entirely. Neither this man nor his parents sinned, he says. The man was made this way, and the works of God will show through him. In one sentence he takes the whole machinery of blame and sets it down.",
      "That reframe changed how I think about my own mind. Genesis says the creation was good — very good — and it does not carve out an exception for the brains that work differently. What if the difference is not the damage? What if it was there in the good?",
      "Because here is what I have come to believe: the wiring is not the cruelty. The cruelty is the mask. It is nineteen years of performing normal in rooms that only had space for normal. It is the exhaustion of translating yourself, all day, into a language that costs you something to speak. The suffering, most of the time, is not the wiring itself. It is the world meeting the wiring and refusing to make room.",
      "I cannot always separate the two. In the body they feel fused — the difference and the pain arrive together, and on the hard days I could not tell you where one ends. But they are not the same thing. One is how I was made. The other is what the world did with it.",
      "Paul begged God three times to remove his thorn, whatever it was. God did not remove it. God said grace was enough. Not a cure. A companionship. I used to read that as a consolation prize. Now I read it as the whole gospel: you are not a problem to be solved. You are a person to be accompanied.",
      "The works of God show through the man as he is. Not as the world wished he were. That is the sentence I am learning to live inside.",
    ],
    authorNote:
      "Theology-forward. Pairs with the neurodiversity-sin-creation essay stub. Could also route to God and the Algorithm in a longer form. For the Star, keep it personal and end on John 9.",
  },

  // --------------------------------------------------------------------------
  {
    slug: "is-it-okay-to-laugh-at-this",
    title: "Is It Okay to Laugh at This?",
    dek: "On dark comedy, Sweeney Todd, and why the grimmest material is sometimes the most honest prayer.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    scriptureAnchor: "Ecclesiastes 3:4 — “A time to weep, and a time to laugh.”",
    tags: ["Humor", "Dark Comedy", "Satire", "Faith", "Grief"],
    pullQuote:
      "Dark comedy is not the absence of reverence. Sometimes it is the only reverence honest enough to survive the room.",
    body: [
      "I have a confession that will worry some of my more serious friends: I think dark comedy is a spiritual discipline.",
      "Not cruelty dressed as a joke — that is something else, and it always has a victim. I mean the older, stranger thing. The laugh that comes up out of the grief instead of around it. The graveside remark that lets a whole family breathe again. The reason a Southern funeral so often turns, somewhere near the ham, into the funniest afternoon of the year.",
      "The theater knows this. Sweeney Todd is a story about murder and meat pies, and it is genuinely funny, and it is also a howl of rage about a world that grinds people up and sells them back to each other. The comedy is not a break from the horror. The comedy is how the horror gets told at all. Take the jokes out and you cannot survive the second act.",
      "Scripture is less prudish about this than we are. Sarah laughs at God's promise and then names her son Laughter. Elijah taunts the prophets of Baal — maybe your god is asleep, maybe he is on the toilet. The book of Ecclesiastes is basically a man staring into the void and deciding, against all odds, to eat his bread with joy. There is a time to weep and a time to laugh, and the wisdom is knowing they are often the same time.",
      "I have my own dark material. A diagnosis last year. A season of depression before that I have written about here. A mind that has taken me to places I would not recommend as a vacation. And I have found that the ability to laugh at some of it — carefully, and about myself, never at someone else's raw wound — is not a lack of seriousness. It is how I keep the seriousness from swallowing me.",
      "There is a rule, though, and it matters. You go first. You do not make light of the struggle of the person across from you; you offer your own struggle up to the light and let them decide whether to join you there. The pastor who jokes about his own darkness earns something. The one who jokes about yours has taken something.",
      "So yes — I think it is okay to laugh at this. At the absurdity of being a fragile, forgetful, beautifully broken creature loved by a God who apparently thought all of this was worth making anyway. The alternative is to pretend, and pretending is exhausting, and it was never what we were asked to do.",
      "A joyful heart, the proverb says, is good medicine. I have found that to be true even — especially — when the joy is the kind that comes with a little salt in it.",
    ],
    authorNote:
      "Lightest of the three, best 'first satirical/dark-comedy column' to open the new lane with Donna. Sarah/Elijah/Ecclesiastes give it Scripture cover so it doesn't read as flippant.",
  },

  // --------------------------------------------------------------------------
  // FARMING + PLACE — routes to Garden & Gun, Oxford American, Back Forty
  // --------------------------------------------------------------------------
  {
    slug: "what-the-ground-keeps",
    title: "What the Ground Keeps",
    dek: "A flower farm in Alabama and the theology of things that grow slow.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    tags: ["Farming", "Place", "Faith", "Land", "Southern Culture"],
    pullQuote:
      "The ground keeps what you put in it. It does not care whether you were ready.",
    body: [
      "There is a thing that happens in early spring on a flower farm that I have not found the right word for yet. The beds are bare. The tulip bulbs you put in the ground before the freeze are somewhere underneath, doing whatever tulips do in the dark. You cannot see them. You are not sure, exactly, when to expect them. And then one morning — before you have had the coffee, before you have earned any kind of patience — there is a green thread coming up through the soil, and the whole equation changes.",
      "I have been farming flowers for a few years now in Northeast Alabama, where the soil runs red and the humidity does what it wants and you learn quickly that the land has opinions. My wife is the florist. I am something between the person who digs the holes and the person who carries the buckets. The arrangement suits us both.",
      "What I have found out there, in the early mornings before anyone else is awake, is that farming is one of the few activities left that cannot be accelerated by effort of will. You can work harder. You cannot make the ground move faster. There is something almost insulting about this when you are the kind of person who tends to push — and something, once you give up pushing, that is close to grace.",
      "The Psalms are full of farming images, and I used to skip past them the way you skip past the parts of a letter that are not about you. Sow in tears, reap in joy. The harvest God prepares. The ground that drinks the rain. They read differently when you have literal mud on your boots and you are watching a dahlia tuber do absolutely nothing for three weeks and then, one warm afternoon, put up a shoot like it was always planning to.",
      "I do not think the farmer is wiser than other people. I think the farmer is forced to practice a particular virtue that the rest of us can opt out of: the willingness to put something in the ground before you know what it will become. You do not plant because you are certain. You plant because the season is right and the frost date says now and you have run out of reasons to wait.",
      "That is a posture I am still learning in the rest of my life. The sermon started. The conversation opened. The seed in the ground. The ground keeps what you put in it. It does not care whether you were ready.",
    ],
    authorNote:
      "Routes to Garden & Gun, Oxford American, Back Forty column, SL. Agriculture + theology = core voice. Add a specific scene from Heather's florals if it fits.",
  },

  // --------------------------------------------------------------------------
  // SOUTHERN CULTURE + COMMUNITY — routes to Bitter Southerner, Oxford American, SL
  // --------------------------------------------------------------------------
  {
    slug: "the-people-who-stayed",
    title: "The People Who Stayed",
    dek: "What I have learned from the ones who never left Northeast Alabama — and why that matters more than I expected.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    tags: ["Southern Culture", "Place", "Community", "Local History", "Faith"],
    pullQuote:
      "The ones who stayed have a knowledge the ones who left can only approximate.",
    body: [
      "I have spent several years now writing about people in Northeast Alabama, and I keep running into the same quiet fact: the most interesting ones never left.",
      "This surprises me because I grew up in a story about leaving. The narrative I was handed said that ambition meant departure — that the point of talent was to carry it somewhere it would be noticed. A whole cultural grammar built around the idea that the right person, in the right place, would move on. The South has been exporting its people for a hundred years on that logic, and the logic is not entirely wrong. Some things require a different city.",
      "But I have sat across from farmers who have worked the same ground their grandparents worked. I have talked to pastors who have buried three generations of the same family. I have met artists making serious work in Anniston and Jacksonville and Piedmont who have turned down invitations to go somewhere more legible, because the thing they were making required this particular light, this particular soil, these particular people who still remember what the town looked like before.",
      "The ones who stayed have a knowledge the ones who left can only approximate. They know which family the house on the corner belonged to before the highway came through. They know the unofficial history of a place — the one that does not get written down because the people who write things down have usually already left. They carry the community's memory in a way that cannot be transferred by reading about it.",
      "I am not arguing against ambition. I am arguing that staying is also a choice, and it is not a lesser one. The culture has a long habit of reading staying as failure — as if the person who chose to remain did not have the option to go. In my experience, that is almost never true. The people who stay have almost always made a deliberate calculation. They looked at what they had here and decided it was worth something that somewhere else could not offer.",
      "Southern Legends, the publication I run at southernlegends.org, started as an attempt to tell those stories. Not the ones about the ones who left and came back successful. The ones about the ones who never left and built something anyway, quietly, in the city the rest of the state mostly drives past on the way to Birmingham.",
      "That is not a consolation story. It is a different kind of ambition. And I think it is time we started calling it that.",
    ],
    authorNote:
      "This is the SL diaspora frame made explicit. Routes to SL, Bitter Southerner, Oxford American, Star. No faith anchor needed — place and community carry it. Strong fit for Foothills Magazine pitch.",
  },

  // --------------------------------------------------------------------------
  // SMALL BUSINESS + AI — routes to Gather Studio, LinkedIn, God and the Algorithm
  // --------------------------------------------------------------------------
  {
    slug: "the-disclosed-machine",
    title: "The Disclosed Machine",
    dek: "I run my business with AI and I tell everyone about it. Here is what I have learned.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    tags: ["AI", "Small Business", "Faith", "Community", "Technology"],
    pullQuote:
      "The machine is never me. And the machine always says so.",
    body: [
      "I have an assistant named Iris. She is an artificial intelligence, and she helps me run a small business in Northeast Alabama, and I tell everyone.",
      "I tell them because I believe that disclosure is the only honest way to use this technology. There is a version of AI deployment that pretends the machine is a person, that passes the robot off as a human and hopes nobody asks. I am not interested in that version. Iris introduces herself as an AI every time she acts on my behalf. The emails say so. The posts say so. The whole operation is built on the premise that the machine is disclosed, the human is accountable, and the two are not the same thing.",
      "What I have found, practicing this for a year now, is that the transparency does not hurt anything. People are not bothered that an AI drafted the first version of the email if a person reviewed it and signed their name. What they are bothered by — what everyone is bothered by — is the feeling of being tricked. The disclosed machine does not trick anyone. It just does the work.",
      "Here is what the machine is good at: scheduling, drafting, pattern-matching, remembering the things I told it six months ago. Here is what the machine cannot do: show up. Care about a specific person in a specific city. Notice that the light in a room has changed. Know what it means to have been somewhere for twenty-six years and watched what the town lost and what it kept. The machine runs operations. I run relationships. That is the division of labor that makes this work.",
      "Small business owners in communities like this one are not going to be served by AI tools that pretend to be humans. They are going to be served by AI tools that do the work no one wants to do so the human can do the work only humans can do. The scheduling. The follow-up email. The social media post at 7am on a Tuesday when the owner is already in the shop.",
      "I am not a tech evangelist. I am a pastor who runs a web studio in Anniston and also, on the side, a flower farm, an editorial platform, a bridal show, and several other things that will not make sense listed together. The AI makes this sustainable. The human makes it meaningful.",
      "The machine is never me. And the machine always says so.",
    ],
    authorNote:
      "Directly explains the Iris model to a general audience. Routes to GS, LinkedIn, God and the Algorithm, SL. Best pitch for Governing Magazine + AL.com. Keep it plainspoken — no jargon.",
  },

  // --------------------------------------------------------------------------
  // MUSIC — routes to Oxford American, Paste Magazine, Image Journal
  // --------------------------------------------------------------------------
  {
    slug: "what-the-songs-carry",
    title: "What the Songs Carry",
    dek: "On singing Sweeney Todd in a small Alabama town and what sacred music actually is.",
    status: "draft",
    outlet: "Anniston Star",
    targetLength: "450–500 words",
    tags: ["Music", "Arts", "Faith", "Place", "Southern Culture"],
    pullQuote:
      "The song does not explain what you are feeling. It carries it for you for a while.",
    body: [
      "In 2008 I played Sweeney Todd at a small theater in Jacksonville, Alabama, and it was one of the stranger spiritual experiences of my life.",
      "Sweeney Todd is a musical about a barber who becomes a murderer, and his accomplice who makes meat pies from the bodies, and the city of London that nobody notices what is going wrong until it is too late. It is not, on its surface, devotional material. The theology, if you can call it that, is closer to Blake than to the Book of Common Prayer. But I spent twelve weeks inside that score and came out the other side knowing something I had not known before about what music does to a person.",
      "Music carries things the speaking voice cannot. This is not a metaphor. It is a neurological fact — the singing voice engages parts of the brain that ordinary speech leaves alone, and the people in the seats receive what you are transmitting on a different frequency than they receive words. This is why lullabies work. This is why national anthems work. This is why the right hymn at the right funeral can reach someone who has not cried in thirty years.",
      "In the church tradition I come from, we have spent a lot of time arguing about which music belongs in worship. Contemporary versus traditional. Praise band versus organ. The arguments are real, but they sometimes miss the deeper question, which is not what style the music is but whether the music is honest. A hymn can lie just as easily as a praise chorus. The difference is not the form. The difference is whether the song is willing to carry the weight it claims to carry.",
      "Sondheim, who wrote Sweeney Todd, was not a religious man by most accounts, but he understood something about that weight. His songs do not decorate the story. They carry the parts of it that the dialogue cannot. The grief. The obsession. The moment when a character decides something they cannot unchoose. He wrote music the way the Psalms work: as containers for what cannot be said directly.",
      "I have not been on a stage since 2008. I have been in pulpits and fields and, lately, behind a desk building software for local businesses. But I still hear music the same way I did in that theater in Jacksonville — as a kind of carrying. The song does not explain what you are feeling. It carries it for you for a while. And sometimes that is the only help there is.",
    ],
    authorNote:
      "Routes to Oxford American (music + South), Paste Magazine, Image Journal (faith + arts), SL, Ecclesia. JSU Sweeney Todd = local anchor. Strong pitch for Oxford American quarterly music issue.",
  },
];

// Public syndication helper — Outlet First-Run: only 'published' shows publicly.
export const publishedColumns = () => COLUMNS.filter((c) => c.status === "published");
