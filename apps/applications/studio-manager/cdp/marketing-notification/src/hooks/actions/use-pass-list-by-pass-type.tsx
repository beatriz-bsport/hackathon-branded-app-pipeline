import { useFetchPaginatedAppoinmentPasses } from "#src/hooks/api/use-fetch-paginated-appointment-pass-list";
import { useFetchPaginatedPasses } from "#src/hooks/api/use-fetch-paginated-passes-list";

type UsePassListByPassType = {
  passType: "appointment" | "payment";
  passIds?: number[];
  currentPage: number;
  currentPageSize: number;
  setPageSettings: (page: number, rowsPerPage: number) => void;
};

/**
 * This hook is used to be able to manage in a single place the logic to fetch the correct pass list and
 * also to return a single pagination params object depending on the pass type.
 * @param passType - Type of pass to fetch, either "appointment" or "payment".
 * @param passIds - Optional array of pass IDs to filter the fetched passes.
 * @param currentPage - Current page number for pagination.
 * @param currentPageSize - Number of items per page for pagination.
 * @param setPageSettings - Function to update the pagination settings.
 * @returns
 */
export const usePassListByPassType = ({
  passType,
  passIds,
  currentPage,
  currentPageSize,
  setPageSettings,
}: UsePassListByPassType) => {
  const { passesById, paginationParams: passesPaginationParams } =
    useFetchPaginatedPasses({
      page: currentPage,
      page_size: currentPageSize,
      setPageSettings,
      paymentPassesIds: passIds,
    });
  const {
    appointmentPassesById,
    paginationParams: appointmentPassesPaginationParams,
  } = useFetchPaginatedAppoinmentPasses({
    page: currentPage,
    page_size: currentPageSize,
    setPageSettings,
    appointmentPassesIds: passIds,
  });

  return {
    passesById,
    appointmentPassesById,
    paginationParams:
      passType === "appointment"
        ? appointmentPassesPaginationParams
        : passesPaginationParams,
  };
};
