import { useEffect } from "react";
import { useSearchParams } from "react-router";

import {
  getNumberSearchParam,
  stringifyParams,
  updateSearchParams,
} from "@bsport/base-query-params";

import {
  DEFAULT_ALLOWED_PAGE_SIZES,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PARAMS_PAGE,
  PARAMS_PAGE_SIZE,
} from "./constants";
import { getValidPage, getValidPageSize } from "./utils";

type PaginationQueryParams = {
  page: number;
  page_size: number;
};

type UsePaginationQueryParamsProps = {
  defaultValues?: PaginationQueryParams;
  shouldReplace?: boolean;
};

/**
 * Initialize and return variables and handlers required for paginated components
 * @param defaultValues [Optional] To provide default values to currentPage and rowsPerPage
 * @param shouldReplace [Optional] Whether to replace query params, or push a new entry in the URL history
 */
export const usePaginationQueryParams = ({
  defaultValues = { page: DEFAULT_PAGE, page_size: DEFAULT_PAGE_SIZE },
  shouldReplace = true,
}: UsePaginationQueryParamsProps = {}) => {
  // Stringify values to create search params
  const stringifiedValues = stringifyParams({
    page: defaultValues.page || DEFAULT_PAGE,
    page_size: defaultValues.page_size || DEFAULT_PAGE_SIZE,
  });
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams(stringifiedValues),
  );

  const rawPage = searchParams.get(PARAMS_PAGE);
  const rawPageSizeStr = searchParams.get(PARAMS_PAGE_SIZE);

  const currentPage = getValidPage(
    getNumberSearchParam({
      searchParams,
      key: PARAMS_PAGE,
      defaultValue: DEFAULT_PAGE,
    }),
  );
  const rawPageSize = getNumberSearchParam({
    searchParams,
    key: PARAMS_PAGE_SIZE,
    defaultValue: DEFAULT_PAGE_SIZE,
  });
  const currentPageSize = getValidPageSize(rawPageSize);

  // If currentPage is invalid (less than 1 or not a number), update the URL to fallback value
  useEffect(() => {
    const rawPageNum = rawPage ? Number(rawPage) : NaN;
    if (!rawPage || Number.isNaN(rawPageNum) || rawPageNum < 1) {
      updateSearchParams({
        setter: setSearchParams,
        updater: (prev) => {
          prev.set(PARAMS_PAGE, DEFAULT_PAGE.toString());
        },
        shouldReplace,
      });
    }
  }, [rawPage, currentPage, setSearchParams, shouldReplace]);

  // If page_size is not allowed, update the URL to fallback value
  useEffect(() => {
    const rawPageSizeNum = rawPageSizeStr ? Number(rawPageSizeStr) : NaN;
    if (String(rawPageSizeNum) !== String(currentPageSize)) {
      updateSearchParams({
        setter: setSearchParams,
        updater: (prev) => {
          prev.set(PARAMS_PAGE_SIZE, currentPageSize.toString());
        },
        shouldReplace,
      });
    }
  }, [rawPageSizeStr, currentPageSize, setSearchParams, shouldReplace]);

  // Define a generic setter to be used in handler
  const updatePaginationSearchParams = (
    updater: (prev: URLSearchParams) => void,
  ) => updateSearchParams({ setter: setSearchParams, updater, shouldReplace });

  const setPage = (nextPage: number) => {
    const validPage = getValidPage(nextPage);
    updatePaginationSearchParams((prev) =>
      prev.set(PARAMS_PAGE, validPage.toString()),
    );
  };

  const setPageSize = (nextRowsPerPage: number) => {
    const validSize = getValidPageSize(nextRowsPerPage);
    updatePaginationSearchParams((prev) =>
      prev.set(PARAMS_PAGE_SIZE, validSize.toString()),
    );
  };

  const setPageSettings = (nextPage: number, nextRowsPerPage: number) => {
    const validPage = getValidPage(nextPage);
    const validSize = getValidPageSize(nextRowsPerPage);
    updatePaginationSearchParams((prev) => {
      prev.set(PARAMS_PAGE, validPage.toString());
      prev.set(PARAMS_PAGE_SIZE, validSize.toString());
    });
  };

  return {
    currentPage,
    currentPageSize,
    setPage,
    setPageSettings,
    setPageSize,
    allowedPageSizes: DEFAULT_ALLOWED_PAGE_SIZES,
  };
};
