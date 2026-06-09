import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookingKeys, sessionKeys } from "@bsport/api-book";
import { consumerPaymentPackKeys } from "@bsport/api-buyables";
import { memberKeys } from "@bsport/api-cdp";
import {
  createQuickInvoiceMutationOptions,
  invoiceKeys,
} from "@bsport/api-financial-services";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch.js";
import { useTranslation } from "#src/utils/i18n";

export const useQuickInvoice = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { t } = useTranslation("sessionManagement");
  const queryClient = useQueryClient();

  const { mutate: createQuickInvoice, isPending } = useMutation({
    ...createQuickInvoiceMutationOptions(fetch),
    onSuccess: () => {
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
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error registering booking:", error);
      toast({
        status: "critical",
        title: t("bookingFlow.confirmation.quickInvoiceErrorToast"),
      });
      onError?.();
    },
  });

  return { createQuickInvoice, isPending };
};
