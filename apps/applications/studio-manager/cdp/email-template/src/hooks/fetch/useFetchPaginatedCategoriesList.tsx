import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchEmailTemplateCategoriesAction,
  selectAllCategories,
  selectCategoriesCount,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

const DEFAULT_PAGE_SIZE = 300;

export const useFetchCategoriesPaginatedList = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      defaultValues: { page_size: DEFAULT_PAGE_SIZE, page: DEFAULT_PAGE },
    });

  const categoriesList = useEmailTemplateStore(selectAllCategories);
  const totalItems = useEmailTemplateStore(selectCategoriesCount);

  const _fetchCategories = useCallback(async () => {
    return fetchEmailTemplateCategoriesAction(fetch, {
      page: currentPage,
      page_size: currentPageSize,
    });
  }, [currentPage, currentPageSize]);

  const [{ isLoading }, fetchCategories] = useAsync<typeof _fetchCategories>({
    asyncFn: _fetchCategories,
    dependencies: [_fetchCategories],
  });

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };

  return {
    isLoading,
    paginationParams,
    categoriesList,
    fetchCategories,
    totalItems,
  };
};
