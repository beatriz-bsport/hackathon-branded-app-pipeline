import data from './data.json';

const getOffsetFromTimezone = (timeZone: string): number => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 6e4;
};

export type TimezoneAndOffset<offset extends boolean> = {
  name: string;
  offset: offset extends true ? number : undefined; // offset in minutes
};

export type OptionTimezonesForCountry = {
  // This allows to overwrite a countrie's timezone by adding extra timezones
  // that are not taken into account by the IANA foundation.
  // ex: adding Reunion's timezone to the country "FR"
  additionalTimezones?: { [countryCode: string]: string[] };
};

/**
 * Returns a list of imezones associated to a country.
 * @param countryCode 2 digits ISO 3166 country code (ex: FR, ES, CA)
 * @param includeOffset Default false. Returns in minutes the offset to UTC.
 * @param options
 * @param options.additionalTimezones Adds extra timezones by country codes that will taken into account in the function.
 * @returns
 */
export function getTimezonesForCountry(
  countryCode: string,
  includeOffset: true,
  options: OptionTimezonesForCountry,
): TimezoneAndOffset<true>[];
// eslint-disable-next-line no-redeclare
export function getTimezonesForCountry(
  countryCode: string,
  includeOffset: false,
  options?: OptionTimezonesForCountry,
): TimezoneAndOffset<false>[];
// eslint-disable-next-line no-redeclare
export function getTimezonesForCountry(
  countryCode: string,
  includeOffset?: boolean,
  options?: OptionTimezonesForCountry,
): TimezoneAndOffset<boolean>[] | null {
  const timezones = [].concat(
    (data as Record<string, string[]>)?.[countryCode] ?? [],
    options?.additionalTimezones?.[countryCode] || [],
  );

  if (!timezones.length) return null;

  return timezones.map((name) => ({
    name,
    offset: includeOffset ? getOffsetFromTimezone(name) : undefined,
  }));
}
