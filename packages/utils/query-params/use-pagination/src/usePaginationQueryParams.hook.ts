import { useSearchParams } from "react-router";

import {
  getNumberSearchParam,
  stringifyParams,
  updateSearchParams,
} from "@bsport/base-query-params";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./constants";

const PARAMS_PAGE = "page";
const PARAMS_PAGE_SIZE = "page_size";

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

  // Retrieve pagination data from the searchParams
  const currentPage = getNumberSearchParam({
    searchParams,
    key: PARAMS_PAGE,
    defaultValue: DEFAULT_PAGE,
  });
  const currentPageSize = getNumberSearchParam({
    searchParams,
    key: PARAMS_PAGE_SIZE,
    defaultValue: DEFAULT_PAGE_SIZE,
  });

  // Define a generic setter to be used in handler
  const updatePaginationSearchParams = (
    updater: (prev: URLSearchParams) => void,
  ) => updateSearchParams({ setter: setSearchParams, updater, shouldReplace });

  const setPage = (nextPage: number) => {
    updatePaginationSearchParams((prev) =>
      prev.set(PARAMS_PAGE, nextPage.toString()),
    );
  };

  const setPageSize = (nextRowsPerPage: number) => {
    updatePaginationSearchParams((prev) =>
      prev.set(PARAMS_PAGE_SIZE, nextRowsPerPage.toString()),
    );
  };

  const setPageSettings = (nextPage: number, nextRowsPerPage: number) => {
    updatePaginationSearchParams((prev) => {
      prev.set(PARAMS_PAGE, nextPage.toString());
      prev.set(PARAMS_PAGE_SIZE, nextRowsPerPage.toString());
    });
  };

  return {
    currentPage,
    currentPageSize,
    setPage,
    setPageSettings,
    setPageSize,
  };
};
