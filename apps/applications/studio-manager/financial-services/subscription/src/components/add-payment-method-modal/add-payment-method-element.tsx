import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Appearance, Stripe } from "@stripe/stripe-js";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";

import type { SetupIntentResponse } from "@bsport/api-financial-services";
import { Alert, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const STRIPE_APPEARANCE: Appearance = { theme: "stripe" };

export type SubmitFn = () => Promise<string | undefined>;

type PaymentElementInnerProps = {
  clientSecret: string;
  registerSubmitHandler: (fn: SubmitFn | null) => void;
  onPaymentElementReady: (ready: boolean) => void;
};

/**
 * Must live inside <Elements>. Registers the confirmSetup submit function
 * with the parent via onSubmitReady — same pattern as StripePaymentElementInner
 * in Kaizen's stripe-payment-method.tsx. Returns the new payment method ID on success.
 */
const PaymentElementInner: FC<PaymentElementInnerProps> = ({
  clientSecret,
  registerSubmitHandler,
  onPaymentElementReady,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
    onPaymentElementReady(true);
  }, [onPaymentElementReady]);

  useEffect(() => {
    if (!stripe || !elements) {
      registerSubmitHandler(null);
      return;
    }

    registerSubmitHandler(async () => {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message);
      }

      const result = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const paymentMethod = result.setupIntent?.payment_method;
      if (typeof paymentMethod === "string") return paymentMethod;
      if (
        typeof paymentMethod === "object" &&
        paymentMethod !== null &&
        "id" in paymentMethod
      )
        return paymentMethod.id;
      return undefined;
    });

    return () => {
      registerSubmitHandler(null);
      onPaymentElementReady(false);
    };
  }, [
    stripe,
    elements,
    clientSecret,
    registerSubmitHandler,
    onPaymentElementReady,
  ]);

  return (
    <div className="relative min-h-[220px]">
      <PaymentElement onReady={handleReady} />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      )}
    </div>
  );
};

type AddPaymentMethodElementProps = {
  setupIntentData: SetupIntentResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  stripePromise: Promise<Stripe | null> | null;
  registerSubmitHandler: (fn: SubmitFn | null) => void;
  onPaymentElementReady: (ready: boolean) => void;
};

const AddPaymentMethodElement: FC<AddPaymentMethodElementProps> = ({
  setupIntentData,
  isLoading,
  isError,
  stripePromise,
  registerSubmitHandler,
  onPaymentElementReady,
}) => {
  const { t } = useTranslation("subscription");

  const elementsOptions = useMemo(
    () =>
      setupIntentData
        ? {
            clientSecret: setupIntentData.client_secret,
            loader: "never" as const,
            appearance: STRIPE_APPEARANCE,
          }
        : undefined,
    [setupIntentData],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert status="critical">
        {t("billing.update-payment-method.error")}
      </Alert>
    );
  }

  if (!elementsOptions || !setupIntentData) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <PaymentElementInner
        clientSecret={setupIntentData.client_secret}
        registerSubmitHandler={registerSubmitHandler}
        onPaymentElementReady={onPaymentElementReady}
      />
    </Elements>
  );
};

export default AddPaymentMethodElement;
