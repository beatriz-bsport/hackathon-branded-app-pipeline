/**
 * Converts a color from an hexadecimal value to RGBA.
 * @param hex Hexadecimal value of a color
 * @returns An object containing the red, green, blue and alpha value of a color.
 */
export const hexToRGBA = (
  hex: string,
): {
  red: number;
  green: number;
  blue: number;
  alpha: number;
} | null => {
  const match = hex
    .trim()
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m, r, g, b) => "#" + r + r + g + g + b + b,
    )
    .substring(1)
    .match(/.{2}/g);
  if (!match) return null;
  return {
    red: parseInt(match[0], 16),
    green: parseInt(match[1], 16),
    blue: parseInt(match[2], 16),
    alpha: match[3] ? parseInt(match[3], 16) : 1,
  };
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
  const CSS_VARIABLE_REGEXP = /--([^,:)]+):[\s|\n]*(([^;]|\n)*);/g;
  const result: Record<string, string> = {};
  let match;

  while ((match = CSS_VARIABLE_REGEXP.exec(cssContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === CSS_VARIABLE_REGEXP.lastIndex) {
      CSS_VARIABLE_REGEXP.lastIndex++;
    }
    result[match[1]] = match[2].replace(/(\n|\s)+/g, " ");
  }
  return result;
};
