import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PrivateBooking,
  type SwapTeacherParams,
  privateBookingKeys,
  swapTeacherAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const swapTeacher = swapTeacherAPI.bind(null, fetch);

export type SwapTeacherVariables = {
  id: number;
  params: SwapTeacherParams;
};

export const useSwapTeacher = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<PrivateBooking, Error, SwapTeacherVariables>({
    mutationKey: ["swap-teacher"],
    mutationFn: ({ id, params }) => swapTeacher(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: privateBookingKeys.listScope(),
      });
      toast({
        status: "default",
        description: t("swapTeacherModal.successMessage"),
        icon: "refresh-cw-04",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("swapTeacherModal.errorMessage"),
      });
    },
  });
};
