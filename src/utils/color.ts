// @flow
export function getTextColorFromRGB([red, blue, green]: [
  number,
  number,
  number,
]): string {
  return red * 0.299 + blue * 0.587 + green * 0.114 > 186
    ? '#000000'
    : '#ffffff';
}
