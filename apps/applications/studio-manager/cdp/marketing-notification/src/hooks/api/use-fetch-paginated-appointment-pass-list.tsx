import { useEffect } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  selectAppointmentPassesById,
  selectAppointmentPassesCount,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";

import { useFetchAppointmentPasses } from "#src/hooks/api/use-fetch-appointment-passes";

/**
 * Custom hook for fetching and paginating appointment passes data.
 *
 * This hook manages the retrieval of a paginated list of appointment passes,
 * synchronizing pagination state with query parameters and providing
 * pagination configuration for UI components.
 *
 * - Fetches appointment passes based on the current page and page size.
 * - Retrieves passes mapped by ID and the total count from the store.
 * - Provides pagination parameters compatible with UI pagination components.
 *
 * @returns An object containing:
 * - `appointmentPassesById`: A record of appointment passes indexed by their IDs.
 * - `paginationParams`: Pagination configuration for UI components, or `undefined` if pagination is not needed.
 */
export function useFetchPaginatedAppoinmentPasses({
  page,
  page_size,
  setPageSettings,
  appointmentPassesIds,
}: {
  page: number;
  page_size: number;
  setPageSettings: (page: number, rowsPerPage: number) => void;
  appointmentPassesIds?: number[];
}) {
  const { handleFetchAppointmentPasses } = useFetchAppointmentPasses();

  const appointmentPassesById = useAppointmentPassStore(
    selectAppointmentPassesById,
  );

  const appointmentPassesCount = useAppointmentPassStore(
    selectAppointmentPassesCount,
  );

  useEffect(() => {
    handleFetchAppointmentPasses({
      page: page,
      page_size: page_size,
      id__in: appointmentPassesIds,
    });
  }, [page, page_size, appointmentPassesIds]);

  const paginationParams: PaginationProps | undefined =
    appointmentPassesCount > page_size
      ? {
          currentPage: page,
          rowsPerPage: page_size,
          totalItems: appointmentPassesCount,
          onPageSettingsChange: setPageSettings,
          showRowsPerPageSelector: false,
        }
      : undefined;

  return { appointmentPassesById, paginationParams };
}
