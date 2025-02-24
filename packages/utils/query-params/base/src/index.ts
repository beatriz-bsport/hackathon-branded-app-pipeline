import { type SetURLSearchParams } from "react-router";

// Stringify all values of a Record / object
export const stringifyParams = (
  params: Record<string, string | number | boolean>,
) => {
  if (!params) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(params).map((entry) => [entry[0], entry[1].toString()]),
  );
};

/**
 * @param searchParams Object created by useSearchParams
 * @param key Name of the param to retrieve
 * @param defaultValue Fallback value in case the value is a NaN
 * @returns The number value retrieved from URL if it's not a NaN, or the default value
 */
export const getNumberSearchParam = ({
  searchParams,
  key,
  defaultValue,
}: {
  searchParams: URLSearchParams;
  key: string;
  defaultValue: number;
}): number => {
  const value = searchParams.get(key);
  return value && !Number.isNaN(Number(value)) ? Number(value) : defaultValue;
};

/**
 * Abstract logic to update search params.
 * @param setter setSearchParams from react-router useSearchParams
 * @param updater A handler to set params value on the prev state
 * @param shouldReplace Whether the changes should replace params or create a new entry in the history
 */
export const updateSearchParams = ({
  setter,
  updater,
  shouldReplace,
}: {
  setter: SetURLSearchParams;
  updater: (prev: URLSearchParams) => void;
  shouldReplace: boolean;
}) => {
  setter(
    (prev) => {
      updater(prev);
      return prev;
    },
    { replace: shouldReplace },
  );
};
