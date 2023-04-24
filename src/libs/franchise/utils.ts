// @ts-nocheck
// @ts-ignore
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import { FranchiseCompany } from './types';

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
  state: string;
  zipcode: string;
}): string => {
  if (!address) return '-';

  const { address_line_1, address_line_2, city, country, state, zipcode } =
    address;
  let newString = '';
  const separator = ', ';

  if (address_line_1) {
    newString += address_line_1;
  }

  if (!address_line_1 && address_line_2) {
    newString += address_line_2;
  }

  if (state) {
    if (newString !== '') newString += separator;
    newString += state;
  }

  if (zipcode) {
    if (newString !== '') newString += state ? ' ' : separator;
    newString += zipcode;
  }

  if (city) {
    if (newString !== '') newString += zipcode ? ' ' : separator;
    newString += city;
  }

  if (country) {
    if (newString !== '') newString += separator;
    newString += country;
  }
  return newString;
};

export const sortCompanyListByIsAllowedAndName = memoize(
  (companyList: FranchiseCompany[]) => {
    return Immutable(
      [...companyList].sort((fc, _fc) => {
        if (fc.isAllowed === _fc.isAllowed) {
          return fc.name.localeCompare(_fc.name);
        }
        return _fc.isAllowed === false ? -1 : 1;
      }),
    );
  },
);
