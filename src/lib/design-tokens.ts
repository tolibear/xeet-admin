/**
 * Atomic Design System - Design Tokens
 * Foundation for all atomic components from atoms to galaxy scale
 */

// Atomic Spacing System (consistent at all scales)
export const spacing = {
  none: "0",
  xs: "0.25rem", // 4px - atomic spacing
  sm: "0.5rem", // 8px - molecule spacing
  md: "0.75rem", // 12px - default organism spacing
  lg: "1rem", // 16px - template spacing
  xl: "1.5rem", // 24px - system spacing
  "2xl": "2rem", // 32px - galaxy spacing
  "3xl": "3rem", // 48px - large galaxy spacing
  "4xl": "4rem", // 64px - massive galaxy spacing
} as const;

// Atomic Typography Scale
export const typography = {
  // Atoms
  xs: "text-xs", // 12px - micro atoms
  sm: "text-sm", // 14px - small atoms
  base: "text-base", // 16px - standard atoms

  // Molecules
  lg: "text-lg", // 18px - molecule headers
  xl: "text-xl", // 20px - molecule titles

  // Organisms
  "2xl": "text-2xl", // 24px - organism headers
  "3xl": "text-3xl", // 30px - organism titles

  // Templates
  "4xl": "text-4xl", // 36px - page headers
  "5xl": "text-5xl", // 48px - template heroes

  // Systems & Galaxy
  "6xl": "text-6xl", // 60px - system headers
  "7xl": "text-7xl", // 72px - galaxy headers
} as const;

// Atomic Motion System
export const motion = {
  // Atomic transitions (instant feedback)
  instant: {
    duration: "50ms",
    ease: "ease-out",
  },

  // Molecule transitions (component interactions)
  fast: {
    duration: "150ms",
    ease: "ease-out",
  },

  // Organism transitions (feature interactions)
  normal: {
    duration: "250ms",
    ease: "ease-in-out",
  },

  // Template transitions (page changes)
  slow: {
    duration: "350ms",
    ease: "ease-in-out",
  },

  // System transitions (major state changes)
  slower: {
    duration: "500ms",
    ease: "ease-in-out",
  },
} as const;

// Atomic Shadow System
export const shadows = {
  // Atoms
  none: "shadow-none",
  sm: "shadow-sm",

  // Molecules
  md: "shadow-md",

  // Organisms
  lg: "shadow-lg",
  xl: "shadow-xl",

  // Templates & Systems
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
} as const;

// Atomic Border Radius
export const radius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

// Atomic Z-Index Scale
export const zIndex = {
  auto: "z-auto",
  0: "z-0",
  10: "z-10", // molecules
  20: "z-20", // organisms
  30: "z-30", // templates
  40: "z-40", // systems
  50: "z-50", // galaxy overlays
} as const;
