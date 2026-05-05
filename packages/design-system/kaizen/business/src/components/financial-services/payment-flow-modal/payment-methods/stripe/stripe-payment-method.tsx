import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

import { getCurrencyCode } from "@bsport/currency";
import type { Fetch } from "@bsport/fetch";
import { Alert, Checkbox, Loader, Title } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { i18nInstance, useTranslation } from "#src/i18n";

import {
  useDarkMode,
  useRequestPaymentClientSecret,
  useStripeAppearance,
} from "../../hooks";
import {
  STRIPE_METHOD_CONFIG,
  STRIPE_PAYMENT_METHOD_MIN_HEIGHT_CLASSNAME,
  type StripeMethod,
  buildStripeElementsOptions,
} from "./constants";

type StripePaymentMethodProps = {
  fetch: Fetch;
  invoiceId: string;
  member: {
    id: number;
    name: string;
    email: string;
  };
  method: StripeMethod;
};

export const StripePaymentMethod: React.FC<StripePaymentMethodProps> = ({
  fetch,
  invoiceId,
  member,
  method,
}: StripePaymentMethodProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const isDarkMode = useDarkMode();
  const stripeAppearance = useStripeAppearance(isDarkMode);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const methodConfig = STRIPE_METHOD_CONFIG[method];

  const clientSecretQuery = useRequestPaymentClientSecret({
    fetch,
    invoiceId,
    memberId: member.id,
    enabled: true,
  });

  const stripePromise = useMemo(
    () =>
      companyTheme?.stripe_pk_key
        ? loadStripe(companyTheme.stripe_pk_key)
        : null,
    [companyTheme?.stripe_pk_key],
  );

  const stripeLocale = i18nInstance.language?.replace("_", "-");
  const amountCts = clientSecretQuery.data?.price_cts ?? 0;
  const clientSecret = clientSecretQuery.data?.client_secret;
  const isLoadingClientSecret = clientSecretQuery.isLoading;
  const currency = getCurrencyCode();
  const onBehalfOf =
    companyTheme?.stripe_id && companyTheme.stripe_id.trim().length > 0
      ? companyTheme.stripe_id
      : undefined;

  const defaultBillingName = member?.name;
  const defaultBillingEmail = member?.email;

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [hasPaymentElementError, setHasPaymentElementError] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  useEffect(() => {
    setIsPaymentElementReady(false);
    setHasPaymentElementError(false);
    setSavePaymentMethod(false);
  }, [method, invoiceId, member.id]);

  const hasStripeConfiguration = Boolean(companyTheme?.stripe_pk_key);
  const hasClientSecretError =
    member.id && !clientSecret && !isLoadingClientSecret;
  const shouldShowPaymentErrorAlert =
    !hasStripeConfiguration || hasPaymentElementError || hasClientSecretError;

  const elementsOptions = buildStripeElementsOptions({
    amount: amountCts,
    currency,
    appearance: stripeAppearance,
    stripeLocale,
    onBehalfOf,
    paymentMethodTypes: [method],
  });
  const paymentElementOptions = {
    ...methodConfig.paymentElementOptions,
    defaultValues: {
      billingDetails: {
        name: defaultBillingName ?? "",
        email: defaultBillingEmail ?? "",
      },
    },
  };

  return (
    <>
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h4" color="default" weight="strong">
          {t(`${methodConfig.i18nRootKey}.title`)}
        </Title>

        {hasStripeConfiguration && clientSecret ? (
          <Elements
            key={`${stripeAppearance.theme}-${method}`}
            stripe={stripePromise}
            options={elementsOptions}
          >
            {!hasPaymentElementError ? (
              <div
                className={`relative ${STRIPE_PAYMENT_METHOD_MIN_HEIGHT_CLASSNAME}`}
              >
                <PaymentElement
                  onReady={() => {
                    setIsPaymentElementReady(true);
                    setHasPaymentElementError(false);
                  }}
                  onLoadError={() => setHasPaymentElementError(true)}
                  options={paymentElementOptions}
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
        onChange={setSavePaymentMethod}
      />
    </>
  );
};
