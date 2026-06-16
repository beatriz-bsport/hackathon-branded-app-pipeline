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
import { getErrorMessageFromCodes } from "#src/utils/get-error-message-from-codes";
import { useTranslation } from "#src/utils/i18n.js";

const registerToWaitlist = registerToWaitlistAPI.bind(null, fetch);

export const useRegisterToWaitlist = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionManagement");

  const CODE_MAP: Partial<Record<number, string>> = {
    4505: t("bookingFlow.addToWaitlist.errors.4505"),
    6002: t("bookingFlow.addToWaitlist.errors.6002"),
    6003: t("bookingFlow.addToWaitlist.errors.6003"),
    6005: t("bookingFlow.addToWaitlist.errors.6005"),
    23001: t("bookingFlow.addToWaitlist.errors.23001"),
    23002: t("bookingFlow.addToWaitlist.errors.23002"),
  };

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
        description: getErrorMessageFromCodes(
          error,
          CODE_MAP,
          t("bookingFlow.addToWaitlist.errors.generic"),
        ),
        icon: "x-circle-solid",
      });
    },
  });
};
