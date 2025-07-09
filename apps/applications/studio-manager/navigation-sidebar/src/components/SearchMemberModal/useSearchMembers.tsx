import { useEffect, useState } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MEMBER_FIXTURE } from "./constants";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

export const useSearchMembers = ({
  searchInput,
  searchArchived,
}: {
  searchInput: string;
  searchArchived: boolean;
}) => {
  const { t } = useTranslation("features");

  // ----- State management -----

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  const count = 21;
  const members = Array(20).fill(MEMBER_FIXTURE);

  // ----- List configuration -----

  const paginationParams: PaginationProps | undefined =
    count > DEFAULT_PAGE_SIZE
      ? {
          currentPage: currentPage,
          rowsPerPage: DEFAULT_PAGE_SIZE,
          totalItems: count,
          onPageChange: setCurrentPage,
          showRowsPerPageSelector: false,
        }
      : undefined;

  const loadingParams = {
    isLoading: false,
    message: t("searchMembers.loading"),
    className: "self-center",
  };

  const emptyStateParams = {
    // API forces us to configure empty state
    isEmpty: false,
    emptyConfig: {},
    // We want to show empty search state only
    /** @todo Change this to count === 0 when connected to backend */
    isEmptySearch: searchInput.length === 0,
    emptySearchConfig: {
      title: "", // Avoid default title
      subtitle: t("searchMembers.emptySearch"),
    },
  };

  // ----- Auto data fetching -----

  useEffect(() => {
    /**
     * @todo Find a way to trigger :
     * - a search when the search input change, + changing to page 1
     * - a search when changing page (easy => deps to currentPage)
     * - but it should not trigger a search for both change in input and page (automatically triggers by the input change)
     */
  }, [currentPage, searchInput, searchArchived]);

  return {
    emptyStateParams,
    loadingParams,
    paginationParams,
    members,
    isShowingList: !loadingParams.isLoading && !emptyStateParams.isEmptySearch,
  };
};
