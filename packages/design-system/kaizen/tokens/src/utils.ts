import kebabCase from "lodash/kebabCase";

/**
 * Converts a color from RGBA to an hexadecimal value (removes the alpha part).
 * @param rgb
 * @returns Equivalent in HEX code (#RRGGBB)
 */
export const rgbToHex = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string =>
  "#" +
  [r, g, b]
    .map((x) => Math.round(x * 255).toString(16))
    .map((hex) => (hex.length === 1 ? `0${hex}` : hex))
    .join("")
    .toUpperCase();

/**
 * Converts a color from RGBA to an hexadecimal value (removes the alpha part).
 * @param rgb
 * @returns Equivalent in HEX code (#RRGGBB)
 */
export const hexToRGB = (
  hex: string,
): {
  r: number;
  g: number;
  b: number;
} => {
  const withoutHex = hex.replace("#", "");
  const r = parseInt(withoutHex.substring(0, 2), 16);
  const g = parseInt(withoutHex.substring(2, 4), 16);
  const b = parseInt(withoutHex.substring(4, 6), 16);
  return { r, g, b };
};

/**
 * Extracts all the CSS variables inside a CSS file as an dictionnary.
 * @param cssContent Content of the CSS file as a string
 */
export const extractCSSVariables = (
  cssContent: string,
): {
  [variableName: string]: string;
} => {
  const CSS_VARIABLE_REGEXP = /--([^\,\:\)]+):(.+)\;/g;

  const result: Record<string, string> = {};
  let match;

  while ((match = CSS_VARIABLE_REGEXP.exec(cssContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === CSS_VARIABLE_REGEXP.lastIndex) {
      CSS_VARIABLE_REGEXP.lastIndex++;
    }
    result[match[1]] = match[2];
  }
  return result;
};
