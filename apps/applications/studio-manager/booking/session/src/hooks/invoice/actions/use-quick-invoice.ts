import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys, sessionKeys } from "@bsport/api-book";
import { consumerPaymentPackKeys } from "@bsport/api-buyables";
import { memberKeys } from "@bsport/api-cdp/member";
import {
  createQuickInvoiceMutationOptions,
  invoiceKeys,
} from "@bsport/api-financial-services";
import { dismissToast, toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch.js";
import { useTranslation } from "#src/utils/i18n";
import { useAddProcessingToast } from "#src/utils/processing-toast.js";

export const useQuickInvoice = () => {
  const { t } = useTranslation("sessionManagement");
  const queryClient = useQueryClient();
  const addProcessingToast = useAddProcessingToast();

  const { mutate: createQuickInvoice, isPending } = useMutation({
    ...createQuickInvoiceMutationOptions(fetch),

    onMutate: () => {
      const toastId = addProcessingToast();
      return { toastId };
    },

    onSuccess: (_data, _variables, onMutateResult) => {
      if (onMutateResult?.toastId) dismissToast(onMutateResult.toastId);
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: consumerPaymentPackKeys.all });
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast({
        status: "default",
        icon: "check",
        title: t("bookingFlow.confirmation.confirmationToast"),
      });
    },
    onError: (error, _variables, onMutateResult) => {
      console.error("Error registering booking:", error);
      if (onMutateResult?.toastId) dismissToast(onMutateResult.toastId);
      toast({
        status: "critical",
        title: t("bookingFlow.confirmation.quickInvoiceErrorToast"),
      });
    },
  });

  return { createQuickInvoice, isPending };
};
