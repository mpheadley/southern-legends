"use client"

import AudioPlayer from "./AudioPlayer"
import { CITY_THEMES } from "@/lib/city-themes"

interface Props {
  citySlug: string
}

export default function CityThemePlayer({ citySlug }: Props) {
  const theme = CITY_THEMES[citySlug]
  if (!theme) return null
  return (
    <AudioPlayer
      src={theme.file}
      title={`${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)} Theme`}
      caption={theme.caption}
    />
  )
}
