import type React from "react";
import { computeCardFontSize } from "./card-font-size";

interface CardStyleInput {
  title: string;
  titleHtml?: string;
  cardTitle?: string;
  cardTitleHtml?: string;
  cardFont?: "serif" | "serif-bold" | "serif-italic" | "serif-caps" | "condensed";
  cardFontSize?: "sm" | "md" | "lg";
  cardTitleColor?: "white" | "gold";
}

export interface CardTitleMeta {
  displayTitle: string;
  resolvedHtml: string | undefined;
  useHtml: boolean;
  titleStyle: React.CSSProperties;
}

interface ResolveOptions {
  /** Inner content width in px — used for word-cap font sizing. */
  containerPx: number;
  /** Multiply the length-based size before applying word-cap. Default 1. Carousel uses 1.4. */
  scale?: number;
  /** font-variation-settings opsz value. Pass 72 for large editorial display. */
  opsz?: number;
  /** Override default title color (#FAFAF7). */
  defaultColor?: string;
  /** Extra style properties merged into titleStyle (e.g. lineHeight, overflowWrap). */
  extraStyle?: React.CSSProperties;
}

/**
 * Single source of truth for editorial card title styling.
 * Returns a ready-to-spread titleStyle object plus rendering helpers.
 *
 * Usage:
 *   const { displayTitle, resolvedHtml, useHtml, titleStyle } = resolveCardTitle(card, { containerPx: 456 });
 *   <h2 style={titleStyle} dangerouslySetInnerHTML={...} />
 *
 * containerPx values:
 *   FeaturedTilt desktop  → 456
 *   HeroCarousel mobile   → 346, scale: 1.4, opsz: 72
 */
export function resolveCardTitle(
  card: CardStyleInput,
  options: ResolveOptions
): CardTitleMeta {
  const {
    containerPx,
    scale = 1,
    opsz,
    defaultColor = "#FAFAF7",
    extraStyle,
  } = options;

  const { title, titleHtml, cardTitle, cardTitleHtml, cardFont, cardFontSize, cardTitleColor } = card;

  const displayTitle = cardTitle || title;
  const useHtml = !!cardTitleHtml || (!cardTitle && !!titleHtml);
  const resolvedHtml = cardTitleHtml || titleHtml;

  const isCondensed = cardFont === "condensed";
  // "condensed" cards now set in Fraunces bold caps (B-11: Barlow Condensed is no longer loaded).
  const fontFamily = "var(--font-heading)";
  const fontWeight = cardFont === "serif-bold" ? 700 : isCondensed ? 700 : 400;
  const fontStyle: React.CSSProperties["fontStyle"] = cardFont === "serif-italic" ? "italic" : "normal";
  const textTransform: React.CSSProperties["textTransform"] =
    isCondensed || cardFont === "serif-caps" ? "uppercase" : undefined;
  const letterSpacing = cardFont === "serif-caps" ? "0.08em" : undefined;
  const color = cardTitleColor === "gold" ? "var(--color-ll-accent)" : defaultColor;

  // Font size: length-based + word-cap
  const baseSizeRem = parseFloat(computeCardFontSize(displayTitle, cardFont, cardFontSize, containerPx));
  let finalSizeRem = baseSizeRem * scale;
  if (scale !== 1) {
    // Re-apply word-cap at the actual visual container width after scaling
    const stripped = (resolvedHtml || displayTitle).replace(/<[^>]+>/g, "");
    const maxWordLen = stripped.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0);
    const charWidthFactor = isCondensed ? 0.52 : cardFont === "serif-caps" ? 0.85 : 0.62;
    const wordCapRem = containerPx / (maxWordLen * charWidthFactor) / 16;
    finalSizeRem = Math.min(finalSizeRem, wordCapRem);
  }
  const fontSize = `${finalSizeRem.toFixed(2)}rem`;

  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    ...(textTransform ? { textTransform } : {}),
    ...(letterSpacing ? { letterSpacing } : {}),
    ...(opsz !== undefined ? { fontVariationSettings: `"opsz" ${opsz}` } : {}),
    color,
    ...extraStyle,
  };

  return { displayTitle, resolvedHtml, useHtml, titleStyle };
}
