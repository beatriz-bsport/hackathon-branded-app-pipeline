export type ContrastLevel = "AAA" | "AA" | "AA+" | "F";

export type ContrastResult = {
  ratio: number;
  level: ContrastLevel;
};

type Rgb = { r: number; g: number; b: number };

function srgbToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

export function parseColor(value: string): Rgb | null {
  const trimmed = value.trim().toLowerCase();

  const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16),
      };
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/,
  );
  if (rgbMatch) {
    return {
      r: Math.round(Number(rgbMatch[1])),
      g: Math.round(Number(rgbMatch[2])),
      b: Math.round(Number(rgbMatch[3])),
    };
  }

  return null;
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return 1;

  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA+";
  return "F";
}

export function contrastOnBackground(
  background: string,
  foreground: string,
): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    level: contrastLevel(ratio),
  };
}

export function preferredForeground(background: string): "#000000" | "#ffffff" {
  const black = contrastOnBackground(background, "#000000");
  const white = contrastOnBackground(background, "#ffffff");
  return white.ratio >= black.ratio ? "#ffffff" : "#000000";
}

export function formatContrastRatio(ratio: number): string {
  return ratio >= 10 ? ratio.toFixed(1) : ratio.toFixed(1);
}

export function normalizeHex(value: string): string {
  const rgb = parseColor(value);
  if (!rgb) return value;

  return `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}
