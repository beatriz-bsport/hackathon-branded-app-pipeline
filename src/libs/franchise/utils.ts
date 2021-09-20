export const getHexaColorFromNumbers = (
  color: [number, number, number],
): string => {
  const base10toHex = (value: number) => value?.toString(16);

  return `#${base10toHex(color[0])}${base10toHex(color[1])}${base10toHex(
    color[2],
  )}`;
};

export const addressToReadableAddress = (address?: {
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  zipcode: string;
}): string => {
  if (!address) return '-';

  const { address_line_1, address_line_2, city, country } = address;
  let newString = '';
  const separator = ', ';

  if (address_line_1) {
    newString += address_line_1;
  }

  if (!address_line_1 && address_line_2) {
    newString += address_line_2;
  }

  if (city) {
    if (newString !== '') newString += separator;
    newString += city;
  }

  if (country) {
    if (newString !== '') newString += separator;
    newString += country;
  }
  return newString;
};
