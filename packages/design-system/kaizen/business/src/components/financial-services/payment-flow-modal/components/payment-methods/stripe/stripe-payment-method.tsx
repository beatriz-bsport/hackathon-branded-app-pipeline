import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  PaymentIntentResult,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { getCurrencyCode } from "@bsport/currency";
import { Alert, Checkbox, Loader, Title } from "@bsport/kaizen-primitive-core";

import { useDarkMode } from "#src/components/financial-services/payment-flow-modal/hooks/use-dark-mode";
import { useStripeAppearance } from "#src/components/financial-services/payment-flow-modal/hooks/use-stripe-appearance";
import { i18nInstance, useTranslation } from "#src/i18n";

import {
  STRIPE_ELEMENT_VALIDATION_ERROR,
  STRIPE_METHOD_CONFIG,
  STRIPE_PAYMENT_METHOD_MIN_HEIGHT_CLASSNAME,
  buildStripeElementsOptions,
} from "./constants";
import type {
  StripePaymentMethodHandle,
  StripePaymentMethodProps,
} from "./types";

type StripePaymentMethodComponentProps = StripePaymentMethodProps & {
  ref?: Ref<StripePaymentMethodHandle>;
};

type StripePaymentElementInnerProps = {
  paymentElementOptions: StripePaymentElementOptions;
  clientSecret: string;
  onReadyStateChange: (value: boolean) => void;
  onElementError: () => void;
  onSubmitPaymentReady: (
    submitPayment: StripePaymentMethodHandle["submitPayment"] | null,
  ) => void;
};

const StripePaymentElementInner = ({
  paymentElementOptions,
  clientSecret,
  onReadyStateChange,
  onElementError,
  onSubmitPaymentReady,
}: StripePaymentElementInnerProps) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      onSubmitPaymentReady(null);
      return;
    }

    onSubmitPaymentReady(async (clientSecretOverride?: string) => {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(STRIPE_ELEMENT_VALIDATION_ERROR);
      }

      const result: PaymentIntentResult = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecretOverride ?? clientSecret,
        redirect: "if_required",
      });

      if (result.error || !result.paymentIntent) {
        throw new Error(
          result.error?.message ?? "Payment confirmation failed.",
        );
      }

      return {
        paymentIntentStatus: result.paymentIntent.status,
      };
    });

    return () => {
      onSubmitPaymentReady(null);
    };
  }, [clientSecret, elements, onSubmitPaymentReady, stripe]);

  return (
    <PaymentElement
      onReady={() => onReadyStateChange(true)}
      onLoadError={() => {
        onReadyStateChange(false);
        onElementError();
      }}
      options={paymentElementOptions}
    />
  );
};

export const StripePaymentMethod = ({
  member,
  method,
  amountCts,
  clientSecret,
  isClientSecretLoading,
  savePaymentMethod,
  onSavePaymentMethodChange,
  ref,
  companyTheme,
}: StripePaymentMethodComponentProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const isDarkMode = useDarkMode();
  const stripeAppearance = useStripeAppearance(isDarkMode);
  const methodConfig = STRIPE_METHOD_CONFIG[method];
  const submitPaymentRef = useRef<
    StripePaymentMethodHandle["submitPayment"] | null
  >(null);

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [hasPaymentElementError, setHasPaymentElementError] = useState(false);

  useEffect(() => {
    setIsPaymentElementReady(false);
    setHasPaymentElementError(false);
  }, [member.id, method]);

  const stripePromise = useMemo(
    () =>
      companyTheme?.stripe_pk_key
        ? loadStripe(companyTheme.stripe_pk_key)
        : null,
    [companyTheme?.stripe_pk_key],
  );
  const hasStripeConfiguration = Boolean(companyTheme?.stripe_pk_key);
  const hasClientSecretError =
    member.id > 0 && !isClientSecretLoading && !clientSecret;
  const shouldShowPaymentErrorAlert =
    !hasStripeConfiguration || hasPaymentElementError || hasClientSecretError;

  const elementsOptions = buildStripeElementsOptions({
    amount: amountCts,
    currency: getCurrencyCode(),
    appearance: stripeAppearance,
    stripeLocale: i18nInstance.language?.replace("_", "-"),
    onBehalfOf: companyTheme?.stripe_id?.trim() || undefined,
    paymentMethodTypes: [method],
  });
  const paymentElementOptions: StripePaymentElementOptions = {
    ...methodConfig.paymentElementOptions,
    defaultValues: {
      billingDetails: {
        name: member.name ?? "",
        email: member.email ?? "",
      },
    },
  };

  const handleSubmitPaymentReady = useCallback<
    StripePaymentElementInnerProps["onSubmitPaymentReady"]
  >((submitPayment) => {
    submitPaymentRef.current = submitPayment;
  }, []);

  useEffect(() => {
    submitPaymentRef.current = null;
  }, [member.id, method, clientSecret]);

  useImperativeHandle(ref, () => ({
    submitPayment: async (clientSecretOverride?: string) => {
      const submitPromise = submitPaymentRef.current?.(clientSecretOverride);
      if (!submitPromise) {
        throw new Error("Payment method is not ready.");
      }

      return submitPromise;
    },
  }));

  return (
    <>
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h4" color="default" weight="strong">
          {t(`${methodConfig.i18nRootKey}.title`)}
        </Title>

        {hasStripeConfiguration && clientSecret ? (
          <Elements
            key={`${stripeAppearance.theme}-${method}-${clientSecret}`}
            stripe={stripePromise}
            options={elementsOptions}
          >
            {!hasPaymentElementError ? (
              <div
                className={`relative ${STRIPE_PAYMENT_METHOD_MIN_HEIGHT_CLASSNAME}`}
              >
                <StripePaymentElementInner
                  paymentElementOptions={paymentElementOptions}
                  clientSecret={clientSecret}
                  onReadyStateChange={(value) => {
                    setIsPaymentElementReady(value);
                    if (value) setHasPaymentElementError(false);
                  }}
                  onElementError={() => setHasPaymentElementError(true)}
                  onSubmitPaymentReady={handleSubmitPaymentReady}
                />
                {!isPaymentElementReady && !hasPaymentElementError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader size="lg" />
                  </div>
                ) : null}
              </div>
            ) : null}
          </Elements>
        ) : null}
      </div>

      {shouldShowPaymentErrorAlert ? (
        <Alert status="critical">
          {t(`${methodConfig.i18nRootKey}.paymentError`)}
        </Alert>
      ) : null}

      <Checkbox
        id={`payment-flow-modal-save-${method}-checkbox-${member.id}`}
        label={t(`${methodConfig.i18nRootKey}.saveLabel`)}
        value={savePaymentMethod ? "checked" : "unchecked"}
        onChange={onSavePaymentMethodChange}
      />
    </>
  );
};
