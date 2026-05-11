import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type BookingOptionDetail,
  type BookingOptionListParams,
  type DiscardBookingOptionParams,
  discardBookingOptionAPI,
  sessionKeys,
  waitingListKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useSessionManagementStore } from "#src/stores/session-management/store";
import { adjustPageOnDelete } from "#src/utils/adjust-page-on-delete";
import { fetch } from "#src/utils/fetch.js";
import { getWaitlistFilterParams } from "#src/utils/get-waitlist-filter-params";
import { useTranslation } from "#src/utils/i18n.js";

type DiscardBookingOptionVariables = {
  bookingOptionId: number;
  params: DiscardBookingOptionParams;
};

const discardBookingOption = discardBookingOptionAPI.bind(null, fetch);

export const useDiscardBookingOption = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  const waitlistFilters = useSessionManagementStore(
    (state) => state.waitlistFilters,
  );

  const { currentPage, currentPageSize, setPage } = usePaginationQueryParams({
    namespace: waitlistFilters,
  });

  return useMutation<BookingOptionDetail, Error, DiscardBookingOptionVariables>(
    {
      mutationFn: async ({ bookingOptionId, params }) =>
        discardBookingOption(bookingOptionId, params),
      onSuccess: (data) => {
        const listParams: BookingOptionListParams = {
          offer: data.offer.id,
          page: currentPage,
          page_size: currentPageSize,
          ...getWaitlistFilterParams(waitlistFilters),
        };

        adjustPageOnDelete({
          queryClient,
          queryKey: waitingListKeys.list(listParams),
          currentPage,
          setPage,
        });

        queryClient.invalidateQueries({ queryKey: waitingListKeys.all });
        queryClient.invalidateQueries({
          queryKey: sessionKeys.detail(data.offer.id),
        });
        toast({
          status: "default",
          description: t("modals.removeFromWaitlist.confirmation"),
          icon: "user-x-01",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          description: t("modals.removeFromWaitlist.error"),
          icon: "x-circle-solid",
        });
      },
    },
  );
};
