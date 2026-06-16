import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type BookingOption,
  type RegisterToWaitlistParams,
  registerToWaitlistAPI,
  sessionKeys,
  waitingListKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch.js";
import { useTranslation } from "#src/utils/i18n.js";

const registerToWaitlist = registerToWaitlistAPI.bind(null, fetch);

export const useRegisterToWaitlist = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  return useMutation<BookingOption, Error, RegisterToWaitlistParams>({
    mutationFn: (params) => registerToWaitlist(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: waitingListKeys.all });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(variables.offer),
      });
      toast({
        status: "default",
        description: t("bookingFlow.addToWaitlist.successToast"),
        icon: "user-plus-01",
      });
    },
    onError: (error) => {
      toast({
        status: "critical",
        description: error.message || t("bookingFlow.addToWaitlist.errorToast"),
        icon: "x-circle-solid",
      });
    },
  });
};
