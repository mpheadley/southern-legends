/** City theme audio. Drop the .mp3 into public/audio/cities/ and add the slug here. */
export const CITY_THEMES: Record<string, { file: string; caption: string }> = {
  anniston: {
    file: "/audio/cities/anniston-theme.mp3",
    caption: "Anniston — original composition · Southern Legends",
  },
}

export function hasCityTheme(citySlug: string): boolean {
  return citySlug in CITY_THEMES
}
