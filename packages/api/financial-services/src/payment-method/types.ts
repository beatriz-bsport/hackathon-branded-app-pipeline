import type { PaymentMethodType } from "#src/types";

export const KNOWN_CARD_BRANDS = [
  "american_express",
  "cartes_bancaires",
  "diners_club",
  "discover",
  "eftpos_australia",
  "interac",
  "jcb",
  "mastercard",
  "union_pay",
  "visa",
] as const;

export type KnownCardBrand = (typeof KNOWN_CARD_BRANDS)[number];
export type CardBrand = KnownCardBrand | (string & {});

export type PaymentMethodBillingDetails = {
  address?: {
    city?: string | null;
    country?: string | null;
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    state?: string | null;
  };
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  tax_id?: string | null;
} & Record<string, unknown>;

type BaseSavedPaymentMethod = {
  id: string;
  type: PaymentMethodType;
  payment_backend_identifier?: number;
  is_default: boolean;
  billing_details: PaymentMethodBillingDetails;
};

type SavedCardPaymentMethod = BaseSavedPaymentMethod & {
  type: "card";
  readable_identifier: string;
  additional_info: string;
  brand: CardBrand;
  display_brand?: CardBrand;
  is_cobranded_card: boolean;
  mandate_status?: never;
};

type SavedSepaOrBacsPaymentMethod = BaseSavedPaymentMethod & {
  type: "sepa_debit" | "bacs_debit";
  readable_identifier: string;
  additional_info: string;
  brand: string;
  mandate_status?: string | null;
  display_brand?: never;
  is_cobranded_card?: never;
};

export type SavedPaymentMethod =
  | SavedCardPaymentMethod
  | SavedSepaOrBacsPaymentMethod;

export type FetchSavedPaymentMethodsRequest = {
  member: number;
};

export type RequestMemberSetupIntentRequest = {
  member: number;
};

export type SetupIntentResponse = {
  client_secret: string;
};
