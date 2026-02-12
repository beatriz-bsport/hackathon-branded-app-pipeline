// Supports #RGB and #RRGGBB, case-insensitive.
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Check if a string is a valid 3- or 6-digit hex color.
 * @example isHexColor("#abc") === true
 * @example isHexColor("#aabbcc") === true
 */
export const isHexColor = (value: string) => HEX_COLOR_REGEX.test(value);

/**
 * Normalize a hex color to 6 digits.
 * Expands #RGB to #RRGGBB; returns the input otherwise.
 * @example normalizeHex("#abc") === "#aabbcc"
 */
export const normalizeHex = (value: string) => {
  const shortMatch = /^#([0-9a-fA-F]{3})$/.exec(value);
  if (!shortMatch) {
    return value;
  }

  const expanded = shortMatch[1]
    .split("")
    .map((char) => `${char}${char}`)
    .join("");

  return `#${expanded}`;
};
