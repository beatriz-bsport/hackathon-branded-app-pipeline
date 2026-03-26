import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./constants";

type Primitive = string | number | boolean;

export type URLParams = Record<string, Primitive | Array<Primitive>>;

const DEFAULT_PAGINATION_PARAMS = {
  page: DEFAULT_PAGE,
  page_size: DEFAULT_PAGE_SIZE,
};

type BuildUrlParamsOptions = {
  withDefaultPagination?: boolean;
};

export function buildUrlParams(
  params: URLParams,
  options: BuildUrlParamsOptions = {},
): string {
  if (!params) {
    return "";
  }

  const mergedParams = options.withDefaultPagination
    ? { ...DEFAULT_PAGINATION_PARAMS, ...params }
    : params;

  const stringifiedParams = Object.fromEntries(
    Object.entries(mergedParams).map((entry) => {
      if (Array.isArray(entry[1])) {
        return [entry[0], entry[1].join(",")];
      }
      return [entry[0], entry[1].toString()];
    }),
  );

  const urlParams = new URLSearchParams(stringifiedParams).toString();

  return `?${urlParams}`;
}
