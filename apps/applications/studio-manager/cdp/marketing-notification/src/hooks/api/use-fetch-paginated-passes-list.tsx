import { useEffect } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type Pass,
  selectActivePasses,
  selectActivePassesCount,
  usePassStore,
} from "@bsport/store-buyables-pass";

import { useFetchPasses } from "#src/hooks/api/use-fetch-passes";

/**
 * Hook for fetching and paginating passes data.
 *
 * This hook fetches a paginated list of passes and provides pagination parameters
 * for use in UI components. It manages API calls, retrieves passes from the store,
 * and handles pagination state using query parameters.
 *
 * @returns Object containing the passes mapped by ID and pagination parameters.
 */
export function useFetchPaginatedPasses({
  page,
  page_size,
  setPageSettings,
  paymentPassesIds,
}: {
  page: number;
  page_size: number;
  setPageSettings: (page: number, rowsPerPage: number) => void;
  paymentPassesIds?: number[];
}) {
  const { handleFetchPasses } = useFetchPasses();

  const passes = usePassStore(selectActivePasses);

  const passesCount = usePassStore(selectActivePassesCount);

  useEffect(() => {
    handleFetchPasses({
      page: page,
      page_size: page_size,
      id__in: paymentPassesIds,
    });
  }, [page, page_size, paymentPassesIds]);

  const paginationParams: PaginationProps | undefined =
    passesCount > page_size
      ? {
          currentPage: page,
          rowsPerPage: page_size,
          totalItems: passesCount,
          onPageSettingsChange: setPageSettings,
          showRowsPerPageSelector: false,
        }
      : undefined;

  const passesById = passes.reduce(
    (acc, pass) => {
      acc[pass.id] = pass;
      return acc;
    },
    {} as Record<number, Pass>,
  );

  return { passesById, paginationParams };
}
