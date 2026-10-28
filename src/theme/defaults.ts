import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#B4532A',
  brand2: '#D9A23A',
  surface: '#EFE4D2',
  // Raised cards are the least favorable reading surface in dark mode.
  darkSurface: '#352A23',
  displayFont: '"Righteous", "Noto Sans", -apple-system, "Segoe UI", Roboto, sans-serif',
  bundledFonts: ['Righteous', 'Karla'],
  displayFallback: '-apple-system, "Segoe UI", Roboto, sans-serif',
};
