import type {
  Appearance,
  StripeElementLocale,
  StripeElementsOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

export type StripeMethod = "card" | "sepa_debit";

export const STRIPE_ELEMENT_VALIDATION_ERROR =
  "STRIPE_ELEMENT_VALIDATION_ERROR";

type BuildElementsOptionsParams = {
  amount: number;
  currency: string;
  appearance: Appearance;
  stripeLocale?: string;
  onBehalfOf?: string;
  paymentMethodTypes: StripeMethod[];
};

export const buildStripeElementsOptions = ({
  amount,
  currency,
  appearance,
  stripeLocale,
  onBehalfOf,
  paymentMethodTypes,
}: BuildElementsOptionsParams): StripeElementsOptions => ({
  mode: "payment",
  amount,
  currency,
  loader: "never",
  // Intentionally pinned to a single method selected in our custom selector above.
  // This avoids rendering a duplicate method choice UI inside PaymentElement.
  paymentMethodTypes,
  appearance,
  ...(stripeLocale ? { locale: stripeLocale as StripeElementLocale } : {}),
  ...(onBehalfOf ? { onBehalfOf } : {}),
});

const CARD_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: "tabs",
  // Wallets are intentionally disabled for this flow to keep method selection
  // fully controlled by our custom selector.
  wallets: {
    applePay: "never",
    googlePay: "never",
    link: "never",
  },
};

const SEPA_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  ...CARD_PAYMENT_ELEMENT_OPTIONS,
  fields: {
    billingDetails: {
      name: "auto",
      email: "auto",
      phone: "never",
      address: "never",
    },
  },
};

// Reserve a fixed vertical space before Stripe renders the PaymentElement.
// Stripe injects the element asynchronously and its final height is not known in advance
// (and can vary between methods/themes), so without this we get layout shift/flicker
// while the loader is replaced by the real element.
export const STRIPE_PAYMENT_METHOD_MIN_HEIGHT_CLASSNAME =
  "min-h-[252px] md:min-h-[150px]";

export const STRIPE_METHOD_CONFIG: Record<
  StripeMethod,
  {
    i18nRootKey: "paymentFlowModal.newCard" | "paymentFlowModal.newSepa";
    paymentElementOptions: StripePaymentElementOptions;
  }
> = {
  card: {
    i18nRootKey: "paymentFlowModal.newCard",
    paymentElementOptions: CARD_PAYMENT_ELEMENT_OPTIONS,
  },
  sepa_debit: {
    i18nRootKey: "paymentFlowModal.newSepa",
    paymentElementOptions: SEPA_PAYMENT_ELEMENT_OPTIONS,
  },
};
