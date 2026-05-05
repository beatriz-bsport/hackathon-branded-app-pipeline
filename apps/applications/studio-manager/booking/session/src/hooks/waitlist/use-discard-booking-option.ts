import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type BookingOptionDetail,
  type DiscardBookingOptionParams,
  discardBookingOptionAPI,
  sessionKeys,
  waitingListKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch.js";
import { useTranslation } from "#src/utils/i18n.js";

type DiscardBookingOptionVariables = {
  bookingOptionId: number;
  params: DiscardBookingOptionParams;
};

const discardBookingOption = discardBookingOptionAPI.bind(null, fetch);

export const useDiscardBookingOption = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  return useMutation<BookingOptionDetail, Error, DiscardBookingOptionVariables>(
    {
      mutationFn: async ({ bookingOptionId, params }) =>
        discardBookingOption(bookingOptionId, params),
      onSuccess: (data) => {
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
