export const getHexaColorFromNumbers = (
  color: [number, number, number],
): string => {
  const base10toHex = (value: number) => value?.toString(16);

  return `#${base10toHex(color[0])}${base10toHex(color[1])}${base10toHex(
    color[2],
  )}`;
};
