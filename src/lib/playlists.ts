/**
 * YouTube playlist config for Southern Legends pages.
 * Each key is a slug (city, essay, profile, or category).
 *
 * playlistId: the part after ?list= in a YouTube URL (real IDs are ~18–34 chars, e.g. PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf)
 * videoId: optional — sets the thumbnail and starting video (11 chars, e.g. gHePXlmAOOo)
 *
 * SAFETY: getPlaylist() only returns an entry once it has a REAL id (see isReady()).
 * Placeholder ids like "PLanniston" render NOTHING — never a broken embed.
 * Fill in real ids progressively; the page starts showing the player the moment one is real.
 */

export interface PlaylistConfig {
  playlistId: string;
  videoId?: string;
  title: string;
  caption?: string;
}

// Real YouTube playlist ids are 18+ chars (usually 34, e.g. PLr4GH13ozhd...); a real video id
// is exactly 11. The old ">= 13" check let the 14-char placeholder "PLjacksonville" through and
// shipped a dead player on /places/jacksonville (fixed 2026-10-21).
function realPlaylistId(id?: string): boolean {
  return !!id && id.length >= 18;
}
function realVideoId(id?: string): boolean {
  return !!id && id.length === 11;
}
function isReady(pl: PlaylistConfig): boolean {
  return realPlaylistId(pl.playlistId) || realVideoId(pl.videoId);
}

const playlists: Record<string, PlaylistConfig> = {
  // ── ESSAYS ──────────────────────────────────────────────────
  "redbird-willow-farm": {
    playlistId: "PLRBWFarm", // TODO: replace with real RBWFarm playlist id
    videoId: "gHePXlmAOOo", // WVTM13 news segment — real id (renders now)
    title: "Redbird Willow Farm — on camera",
    caption: "News coverage and farm videos from Redbird Willow Farm, Anniston, AL.",
  },
  "michele-hornsby-redbird-willow": {
    playlistId: "PLRBWFarm",
    videoId: "gHePXlmAOOo",
    title: "Redbird Willow Farm — on camera",
    caption: "News coverage and farm videos from Redbird Willow Farm, Anniston, AL.",
  },

  // ── CITIES ── (search YouTube "[city] Alabama"; drop the real list= id here) ──
  anniston: {
    playlistId: "PLanniston", // TODO real id
    title: "Anniston, Alabama — on film",
    caption: "Local videos, events, and stories from Anniston.",
  },
  oxford: {
    playlistId: "PLoxford", // TODO real id
    title: "Oxford, Alabama — on film",
  },
  jacksonville: {
    playlistId: "", // no Jacksonville playlist yet
    videoId: "t_HdqRLdvKg", // public, SL channel: JSU Pirates of Penzance (2007), Stone Center, Jacksonville AL
    title: "Jacksonville, Alabama — on film",
    caption: "Jacksonville State University's 2007 Pirates of Penzance, filmed at the Ernest Stone Performing Arts Center.",
  },
  gadsden: {
    playlistId: "PLgadsden", // TODO real id
    title: "Gadsden, Alabama — on film",
  },
  talladega: {
    playlistId: "PLtalladega", // TODO real id
    title: "Talladega, Alabama — on film",
  },

  // ── CATEGORIES ──────────────────────────────────────────────
  music: {
    playlistId: "PLmusic", // TODO real id
    title: "NE Alabama Music — live sessions & stories",
  },
  arts: {
    playlistId: "PLarts", // TODO real id
    title: "Arts & Culture in Northeast Alabama",
  },
  faith: {
    playlistId: "PLfaith", // TODO real id
    title: "Faith & Community in the Alabama Foothills",
  },
  food: {
    playlistId: "PLfood", // TODO real id
    title: "Southern Food & Farm — Northeast Alabama",
  },
};

/** Returns the config only if it has a real, renderable id. Placeholders → null. */
export function getPlaylist(slug: string): PlaylistConfig | null {
  const pl = playlists[slug];
  if (!pl) return null;
  if (!isReady(pl)) return null;
  // Strip a placeholder playlist id so the embed never gets a bogus ?list= or "open playlist" link.
  return realPlaylistId(pl.playlistId) ? pl : { ...pl, playlistId: "" };
}

/** True only if a real, renderable playlist exists for the slug. */
export function hasPlaylist(slug: string): boolean {
  return getPlaylist(slug) !== null;
}
