import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type DisableAppointmentParams,
  type PrivateBooking,
  disableAppointmentAPI,
  privateBookingKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const disableAppointment = disableAppointmentAPI.bind(null, fetch);

export type CancelAppointmentVariables = {
  id: number;
  params?: DisableAppointmentParams;
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<PrivateBooking, Error, CancelAppointmentVariables>({
    mutationKey: ["cancel-appointment"],
    mutationFn: ({ id, params }) => disableAppointment(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: privateBookingKeys.listScope(),
      });
      toast({
        status: "default",
        description: t("cancelAppointmentModal.successMessage"),
        icon: "x-circle-solid",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("cancelAppointmentModal.errorMessage"),
      });
    },
  });
};
