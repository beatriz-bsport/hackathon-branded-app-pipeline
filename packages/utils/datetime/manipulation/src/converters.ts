import { type DateTime, LuxonDateTime } from "./constants";

/**
 * Converts a Timestamp into a DateTime
 *
 * @param timestamp - A datetime formatted as a timestamp number
 * @returns The DateTime object transformed
 */
export const fromSeconds = (timestamp: number): DateTime => {
  if (!Number.isFinite(timestamp) || timestamp < 0) {
    throw new Error("Invalid timestamp: must be a non-negative finite number");
  }
  return LuxonDateTime.fromSeconds(timestamp);
};

/**
 * Converts a DateTime object into a string
 *
 * @param datetime - The DateTime object to convert
 * @param formatOptions - Additional parameters to customize the conversion
 * @returns The stringified DateTime
 */
export const toLocaleString = ({
  datetime,
  formatOptions,
  overrideOptions,
}: {
  datetime: DateTime;
  formatOptions?: Intl.DateTimeFormatOptions;
  overrideOptions?: object;
}) => datetime.toLocaleString(formatOptions, overrideOptions);
