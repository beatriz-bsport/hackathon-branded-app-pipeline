import type { PaymentIntent } from "@stripe/stripe-js";

import type { CompanyTheme } from "@bsport/api-core";

import type { StripeMethod } from "./constants";

export type StripePaymentMethodProps = {
  member: {
    id: number;
    name: string;
    email: string;
  };
  method: StripeMethod;
  amountCts: number;
  clientSecret: string | undefined;
  isClientSecretLoading: boolean;
  savePaymentMethod: boolean;
  onSavePaymentMethodChange: (value: boolean) => void;
  companyTheme?: CompanyTheme;
};

export type StripePaymentMethodSubmitResult = {
  paymentIntentStatus: PaymentIntent["status"];
};

export type StripePaymentMethodHandle = {
  submitPayment: (
    clientSecretOverride?: string,
  ) => Promise<StripePaymentMethodSubmitResult>;
};
