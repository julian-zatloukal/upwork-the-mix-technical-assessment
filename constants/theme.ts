/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// ─── Color math utilities ────────────────────────────────────────────────────

/** Converts a 6-digit hex color to [h (0–360), s (0–100), l (0–100)]. */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else                h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

/** Converts h (0–360), s (0–100), l (0–100) to a 6-digit hex string. */
function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Returns a new hex color with the same hue & saturation as `hex`
 * but with `targetLightness` (0–100) as the lightness.
 */
function withLightness(hex: string, targetLightness: number): string {
  const [h, s] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, targetLightness)));
}

// ─── Primary brand color ────────────────────────────────────────────────────
// ✏️  This is the ONLY value you need to change — everything else is derived.
export const PRIMARY = '#fab005';

const [, , PRIMARY_L] = hexToHsl(PRIMARY);

// Derived shades — same hue & saturation, only lightness shifts
export const PRIMARY_DARK   = withLightness(PRIMARY, PRIMARY_L - 13); // pressed states, borders
export const PRIMARY_DARKER = withLightness(PRIMARY, PRIMARY_L - 27); // focus rings, active borders
export const PRIMARY_MUTED  = withLightness(PRIMARY, 15);             // subtle dark backgrounds

/**
 * Full 10-100 scale for the primary hue.
 * Amplify's interactive tokens (buttons, links, focus rings) reference
 * colors.primary.80 / .90 / .100 — overriding these is what changes the UI.
 */
export const PRIMARY_SCALE = {
  10:  withLightness(PRIMARY, 96), // very light tint
  20:  withLightness(PRIMARY, 88),
  40:  withLightness(PRIMARY, 78),
  60:  withLightness(PRIMARY, 73), // lighter accent
  80:  PRIMARY,                    // button backgrounds, link text
  90:  PRIMARY_DARK,               // hover / pressed
  100: PRIMARY_DARKER,             // focus rings, active borders
} as const;

// ─── Semantic aliases used across sign-in / auth UI ─────────────────────────
export const AuthColors = {
  /** Main brand color — used for ActivityIndicator, overlay glow, etc. */
  brand:            PRIMARY,
  brandPressed:     PRIMARY_DARK,
  brandFocusRing:   PRIMARY_DARKER,

  /** Background layers for the auth screens */
  bgPrimary:        '#0a0a0a',
  bgSecondary:      '#111111',
  bgTertiary:       '#1a1a1a',

  /** Loading-overlay card */
  overlayCard:      '#1a1a1a',
  overlayBorder:    PRIMARY_DARK,

  /** Text inside auth screens */
  fontPrimary:      '#ffffff',
  fontSecondary:    '#e0e0e0',
  fontTertiary:     '#a0a0a0',

  /** Borders (non-interactive) */
  borderPrimary:    '#333333',
  borderSecondary:  '#222222',
} as const;

const tintColorLight = PRIMARY;
const tintColorDark  = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
