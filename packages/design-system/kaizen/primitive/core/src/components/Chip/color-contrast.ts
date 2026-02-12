/**
 * Color contrast utilities for generating accessible chip colors
 * Based on WCAG 2.1 guidelines
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ChipColors {
  text: string;
  background: string;
  border: string;
}

const HEX_PREFIX = "#";
const HEX_BASE = 16;
const RGB_CHANNEL_MAX = 255;
const PERCENT_DIVISOR = 100;
const BLACK_HEX = "#000000";

const SRGB_LINEAR_THRESHOLD = 0.03928;
const SRGB_LINEAR_DIVISOR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_EXPONENT = 2.4;
const LUMINANCE_RED_WEIGHT = 0.2126;
const LUMINANCE_GREEN_WEIGHT = 0.7152;
const LUMINANCE_BLUE_WEIGHT = 0.0722;

const CONTRAST_LUMINANCE_OFFSET = 0.05;
const MIN_TEXT_CONTRAST = 4.5;

const CHIP_BACKGROUND_ALPHA = 0.12;
const LIGHT_TEXT_LUMINANCE_THRESHOLD = 0.5;
const LUMINANCE_DARKEN_BASELINE = 0.3;
const INITIAL_DARKEN_SCALE = 60;
const MAX_INITIAL_DARKEN_PERCENT = 40;
const MAX_DARKEN_ITERATIONS = 8;
const DARKEN_STEP_PERCENT = 7;

const toPercentageFactor = (percent: number): number =>
  percent / PERCENT_DIVISOR;

/**
 * Convert hex color to RGB
 * @example hexToRgb('#5EB44B') => { r: 94, g: 180, b: 75 }
 */
export function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace(HEX_PREFIX, "");
  const bigint = parseInt(sanitized, HEX_BASE);

  return {
    r: (bigint >> HEX_BASE) & RGB_CHANNEL_MAX,
    g: (bigint >> (HEX_BASE / 2)) & RGB_CHANNEL_MAX,
    b: bigint & RGB_CHANNEL_MAX,
  };
}

/**
 * Convert RGB to hex
 * @example rgbToHex({ r: 94, g: 180, b: 75 }) => '#5eb44b'
 */
export function rgbToHex({ r, g, b }: RGB): string {
  const digitsPerChannel = 2;

  const hexNumberText = [r, g, b]
    .map((channel) =>
      channel.toString(HEX_BASE).padStart(digitsPerChannel, "0"),
    )
    .join("");

  return HEX_PREFIX + hexNumberText;
}

/**
 * Get relative luminance per WCAG 2.1
 * Returns a value between 0 (darkest) and 1 (lightest)
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const [red, green, blue] = [r, g, b].map((channel) => {
    const normalized = channel / RGB_CHANNEL_MAX;
    return normalized <= SRGB_LINEAR_THRESHOLD
      ? normalized / SRGB_LINEAR_DIVISOR
      : Math.pow((normalized + SRGB_OFFSET) / SRGB_SCALE, SRGB_EXPONENT);
  });

  return (
    LUMINANCE_RED_WEIGHT * red +
    LUMINANCE_GREEN_WEIGHT * green +
    LUMINANCE_BLUE_WEIGHT * blue
  );
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Returns a value between 1 (no contrast) and 21 (maximum contrast)
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (
    (lighter + CONTRAST_LUMINANCE_OFFSET) / (darker + CONTRAST_LUMINANCE_OFFSET)
  );
}

/**
 * Darken a hex color by percentage
 * @param hex - Hex color string (e.g., '#5EB44B')
 * @param percent - Percentage to darken (0-100)
 * @example darken('#5EB44B', 30) => '#41793'
 */
export function darken(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - toPercentageFactor(percent);

  return rgbToHex({
    r: Math.round(r * factor),
    g: Math.round(g * factor),
    b: Math.round(b * factor),
  });
}

/**
 * Lighten a hex color by percentage
 * @param hex - Hex color string (e.g., '#5EB44B')
 * @param percent - Percentage to lighten (0-100)
 * @example lighten('#5EB44B', 30) => '#9ecf93'
 */
export function lighten(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = toPercentageFactor(percent);

  return rgbToHex({
    r: Math.round(r + (RGB_CHANNEL_MAX - r) * factor),
    g: Math.round(g + (RGB_CHANNEL_MAX - g) * factor),
    b: Math.round(b + (RGB_CHANNEL_MAX - b) * factor),
  });
}

/**
 * Blend a base color over white with alpha
 */
export function blendOverWhite(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  const alphaFactor = Math.min(1, Math.max(0, alpha));

  return rgbToHex({
    r: Math.round(r * alphaFactor + RGB_CHANNEL_MAX * (1 - alphaFactor)),
    g: Math.round(g * alphaFactor + RGB_CHANNEL_MAX * (1 - alphaFactor)),
    b: Math.round(b * alphaFactor + RGB_CHANNEL_MAX * (1 - alphaFactor)),
  });
}

/**
 * Generate accessible chip color scheme from a base color
 *
 * Design pattern:
 * - Background: Very light tint (12% opacity of the base color)
 * - Text: The original color (darkened if too light for readability)
 * - Border: Same as text color
 *
 * This ensures WCAG AA compliance (4.5:1 contrast) on white backgrounds
 *
 * @param baseColor - Hex color (e.g., '#5EB44B')
 * @returns Object with text, background, and border CSS values
 */
export function getAccessibleChipColors(baseColor: string): ChipColors {
  const { r, g, b } = hexToRgb(baseColor);
  const baseLuminance = getRelativeLuminance(baseColor);

  const background = `rgba(${r}, ${g}, ${b}, ${CHIP_BACKGROUND_ALPHA})`;
  const blendedBackground = blendOverWhite(baseColor, CHIP_BACKGROUND_ALPHA);

  let textColor = baseColor;

  if (baseLuminance > LIGHT_TEXT_LUMINANCE_THRESHOLD) {
    const darkenAmount = Math.min(
      MAX_INITIAL_DARKEN_PERCENT,
      Math.round(
        (baseLuminance - LUMINANCE_DARKEN_BASELINE) * INITIAL_DARKEN_SCALE,
      ),
    );
    textColor = darken(baseColor, darkenAmount);
  }

  let steps = 0;
  let backgroundContrast = getContrastRatio(textColor, blendedBackground);

  while (
    backgroundContrast < MIN_TEXT_CONTRAST &&
    steps < MAX_DARKEN_ITERATIONS
  ) {
    textColor = darken(textColor, DARKEN_STEP_PERCENT);
    backgroundContrast = getContrastRatio(textColor, blendedBackground);
    steps += 1;
  }

  if (backgroundContrast < MIN_TEXT_CONTRAST) {
    textColor = BLACK_HEX;
  }

  return {
    text: textColor,
    background,
    border: textColor,
  };
}
