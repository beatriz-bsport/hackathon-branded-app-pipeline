import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  paymentMethodKeys,
  requestSetupIntentMutationOptions,
  setCompanyPaymentMethodAsDefaultAPI,
} from "@bsport/api-financial-services";
import { toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { SubmitFn } from "./add-payment-method-element";

type UseAddPaymentMethodParams = {
  isOpen: boolean;
  onClose: () => void;
};

export function useAddPaymentMethod({
  isOpen,
  onClose,
}: UseAddPaymentMethodParams) {
  const { t } = useTranslation("subscription");
  const queryClient = useQueryClient();
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const submitPaymentMethodRef = useRef<SubmitFn | null>(null);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripePromise = useMemo(
    () =>
      companyTheme?.stripe_pk_key
        ? loadStripe(companyTheme.stripe_pk_key)
        : null,
    [companyTheme?.stripe_pk_key],
  );

  const {
    mutate: requestSetupIntent,
    data: setupIntentData,
    isPending: isSetupIntentPending,
    isError: isSetupIntentError,
    reset: resetMutation,
  } = useMutation(requestSetupIntentMutationOptions(fetch));

  useEffect(() => {
    if (isOpen) {
      setIsPaymentElementReady(false);
      setErrorMessage(null);
      submitPaymentMethodRef.current = null;
      requestSetupIntent();
    } else {
      resetMutation();
    }
  }, [isOpen, requestSetupIntent, resetMutation]);

  const registerSubmitHandler = useCallback((fn: SubmitFn | null) => {
    submitPaymentMethodRef.current = fn;
  }, []);

  const handleConfirm = useCallback(async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const paymentMethodId = await submitPaymentMethodRef.current?.();
      if (paymentMethodId) {
        await setCompanyPaymentMethodAsDefaultAPI(fetch, paymentMethodId);
      } else {
        throw new Error(t("billing.update-payment-method.error"));
      }

      await queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.company(),
      });
      onClose();
      toast({
        icon: "credit-card-02",
        title: t("billing.update-payment-method.success"),
        status: "default",
      });
    } catch (err) {
      setErrorMessage(
        (err instanceof Error && err.message) ||
          t("billing.update-payment-method.error"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [queryClient, onClose, t]);

  const isConfirmDisabled =
    !isPaymentElementReady || isSetupIntentError || isSubmitting;

  return {
    stripePromise,
    setupIntentData,
    isSetupIntentPending,
    isSetupIntentError,
    onPaymentElementReady: setIsPaymentElementReady,
    isSubmitting,
    errorMessage,
    registerSubmitHandler,
    handleConfirm,
    isConfirmDisabled,
  };
}
