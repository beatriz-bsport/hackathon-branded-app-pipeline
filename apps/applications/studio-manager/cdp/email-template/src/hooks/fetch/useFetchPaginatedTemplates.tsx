import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type FetchEmailTemplateSummaryParams,
  fetchEmailTemplateSummariesAction,
  fuzzySearchEmailTemplateAction,
  selectEmailTemplateSummariesCount,
  selectFlatEmailTemplateSummaries,
  selectFuzzySearchEmailTemplateSummaries,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";
import type { PossibleEmailTemplateType } from "#src/utils/types";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export const useFetchPaginatedTemplateList = ({
  templatesToFetch,
  searchInput,
}: {
  templatesToFetch: PossibleEmailTemplateType;
  searchInput?: string;
}) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      shouldReplace: false,
      defaultValues: { page_size: DEFAULT_PAGE_SIZE, page: DEFAULT_PAGE },
    });

  const flatEmailTemplateList = useEmailTemplateStore(
    selectFlatEmailTemplateSummaries,
  );
  const fuzzyEmailTemplateList = useEmailTemplateStore(
    selectFuzzySearchEmailTemplateSummaries,
  );
  const totalItems = useEmailTemplateStore(selectEmailTemplateSummariesCount);

  const _fetchEmailTemplates = useCallback(async () => {
    let params: FetchEmailTemplateSummaryParams = {
      page: currentPage,
      page_size: currentPageSize,
    };
    if (templatesToFetch === "bsport") {
      params = {
        ...params,
        is_default_bsport_template: true,
      };
    } else if (templatesToFetch === "master") {
      params = {
        ...params,
        is_franchise: true,
      };
    }
    return fetchEmailTemplateSummariesAction(fetch, params);
  }, [currentPage, currentPageSize, templatesToFetch]);

  const [{ isLoading: isLoadingFlat }, fetchEmailTemplates] = useAsync<
    typeof _fetchEmailTemplates
  >({
    asyncFn: _fetchEmailTemplates,
    dependencies: [_fetchEmailTemplates],
  });

  // Fuzzy fetcher
  const _fuzzySearchEmailTemplate = useCallback(async () => {
    return fuzzySearchEmailTemplateAction(fetch, {
      queryString: searchInput ?? "",
      page_size: currentPageSize,
      page: currentPage,
    });
  }, [currentPage, currentPageSize, searchInput]);

  const [{ isLoading: isLoadingFuzzy }, fuzzySearchEmailTemplate] = useAsync<
    typeof _fuzzySearchEmailTemplate
  >({
    asyncFn: _fuzzySearchEmailTemplate,
    dependencies: [_fuzzySearchEmailTemplate],
    onFailure: console.error,
  });

  const paginationParams: PaginationProps = {
    currentPage: currentPage,
    rowsPerPage: currentPageSize,
    totalItems: totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };
  const emailTemplateList = searchInput
    ? fuzzyEmailTemplateList
    : flatEmailTemplateList;
  const isLoading = searchInput ? isLoadingFuzzy : isLoadingFlat;
  const isEmpty = searchInput
    ? fuzzyEmailTemplateList.length === 0
    : totalItems === 0;
  const isEmptySearch = isEmpty && !!searchInput;

  return {
    isLoading,
    paginationParams,
    emailTemplateList,
    fetchEmailTemplates,
    fuzzySearchEmailTemplate,
    totalItems,
    isEmpty,
    isEmptySearch,
  };
};
