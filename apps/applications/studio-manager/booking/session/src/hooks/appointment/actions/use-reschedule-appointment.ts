import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PrivateBooking,
  type RescheduleAppointmentParams,
  privateBookingKeys,
  rescheduleAppointmentAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const rescheduleAppointment = rescheduleAppointmentAPI.bind(null, fetch);

export type RescheduleAppointmentVariables = {
  id: number;
  params: RescheduleAppointmentParams;
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation<PrivateBooking, Error, RescheduleAppointmentVariables>({
    mutationKey: ["reschedule-appointment"],
    mutationFn: ({ id, params }) => rescheduleAppointment(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: privateBookingKeys.listScope(),
      });
      toast({
        status: "default",
        description: t("rescheduleAppointmentModal.successMessage"),
        icon: "calendar",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("rescheduleAppointmentModal.errorMessage"),
      });
    },
  });
};
