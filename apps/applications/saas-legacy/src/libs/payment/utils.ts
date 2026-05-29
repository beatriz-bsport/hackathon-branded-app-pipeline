import { type PayPalScriptProviderOptions } from 'src/libs/payment/types';

// @ts-expect-error
import i18n from '#src/i18n/index';
import { TFunction } from 'i18next';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
} from '@bsport/common/lib/master-data/payment-group.js';
import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods.js';
import Config from '#src/config';
import type { Invoice } from '#src/libs/invoice/types';
import { getCurrencyCode } from '#src/libs/theme/selectors';
import { getLocaleFromLanguage } from '#src/utils/language';
import {
  PAYMENT_METHOD_BRAND_NAME_MAP,
  PAYMENT_METHOD_PNG_MAP,
  PaymentMethodBrands,
  STRIPE_MINMUM_AMOUNT_CTS_BY_CURRENCY,
} from '#src/libs/payment/constants';

export const fromPaymentGroupIdentifierToPaymentMethodIdentifier = (
  paymentGroupIdentifier: number,
) => {
  switch (paymentGroupIdentifier) {
    case PAYMENT_GROUP_METHOD_IDENTIFIER_CB:
      return 'card';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
      return 'sepa_debit';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT:
      return 'debt';
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT:
      return 'bacs_debit';
    default:
      return '';
  }
};

// This const is used to identify stripe terminal as a payment method in different dialogs
// The value 99 isn't sent to the backend, we replace this value with the appropriate one (CB)
// before calling the api
export const PAYMENT_STRIPE_TERMINAL_FAKE = 99;

export const getPaymentMethodsConcatenatedString = (
  paymentMethodIdentifierList: number[],
  t: TFunction,
) => {
  const string_payment_methods = (paymentMethodIdentifierList ?? []).map(
    (identifier: number) => t(`payment:paymentMethod.${identifier}`),
  );
  const nbMethods = string_payment_methods.length;
  if (nbMethods === 0) {
    return '';
  }
  return string_payment_methods
    .slice(1)
    .reduce(
      (acc: string, element: string) => `${acc}, ${element}`,
      string_payment_methods[0],
    );
};

interface GetBackofficeEnabledPaymentMethodsProps {
  currency: string;
  companyCountry: string;
  withCredit?: boolean;
  withTerminal?: boolean;
  stripeRegion?: string;
  paymentMethodAvailableBasket?: number[];
  paymentMethodAvailableSubscription?: number[];
}

export const getBackofficeBillingPlanEnabledPaymentMethods = ({
  currency,
  companyCountry,
  withCredit,
  withTerminal,
  stripeRegion,
  paymentMethodAvailableBasket,
  paymentMethodAvailableSubscription,
}: GetBackofficeEnabledPaymentMethodsProps) => {
  if (!companyCountry || !stripeRegion)
    throw new Error('Company country or Stripe region not provided');

  const isSepaEnabled =
    (paymentMethodAvailableBasket?.includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    ) ??
      true) ||
    (paymentMethodAvailableSubscription?.includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    ) ??
      true);

  const isBacsEnabled =
    paymentMethodAvailableSubscription?.includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
    ) ?? true;

  return [
    BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    ...((currency ?? '').toLowerCase() === 'eur' && isSepaEnabled
      ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]
      : []),
    ...(stripeRegion === 'Europe' && companyCountry === 'GB' && isBacsEnabled
      ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT]
      : []),
    ...(withCredit ? [BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT] : []),
    ...(withTerminal ? [PAYMENT_STRIPE_TERMINAL_FAKE] : []),
  ];
};

export const getBackofficeEnabledPaymentGroupMethods = ({
  currency,
  companyCountry,
  withCredit,
  withTerminal,
  stripeRegion,
}: GetBackofficeEnabledPaymentMethodsProps) => {
  if (!companyCountry || !stripeRegion)
    throw new Error('Company country or Stripe region not provided');
  return [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    ...(currency.toLowerCase() === 'eur'
      ? [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]
      : []),
    ...(stripeRegion === 'Europe' && companyCountry === 'GB'
      ? [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]
      : []),
    ...(withCredit ? [PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT] : []),
    ...(withTerminal ? [PAYMENT_STRIPE_TERMINAL_FAKE] : []),
  ];
};

interface GetMarketplaceEnabledPaymentMethodsProps {
  paymentMethodAvailableSubscription?: number[];
}

export const getMarketplaceEnabledPaymentMethods = ({
  paymentMethodAvailableSubscription,
}: GetMarketplaceEnabledPaymentMethodsProps) => [
  ...(paymentMethodAvailableSubscription?.includes(
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  )
    ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]
    : []),
  ...(paymentMethodAvailableSubscription?.includes(
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  )
    ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]
    : []),
  ...(paymentMethodAvailableSubscription?.includes(
    PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  )
    ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT]
    : []),
];

export const getPayPalScriptProviderOptions = (
  clientSecret: string,
): PayPalScriptProviderOptions => {
  const { language } = i18n;
  const buttonLocale = getLocaleFromLanguage(language);

  return {
    clientId: Config.REACT_APP_PAYPAL_CLIENT_ID,
    merchantId: clientSecret,
    components: 'buttons,funding-eligibility,marks',
    currency: getCurrencyCode().toUpperCase(),
    integrationDate: '2020-07-01',
    debug: false,
    commit: true,
    intent: 'capture',
    dataPartnerAttributionId: Config.REACT_APP_PAYPAL_PARTNER_ATTRIBUTION_ID,
    ...(buttonLocale ? { locale: buttonLocale } : {}),
  };
};

export const getPaymentMethodPng = (brandName: string) => {
  if (brandName in PAYMENT_METHOD_PNG_MAP) {
    return PAYMENT_METHOD_PNG_MAP[brandName as PaymentMethodBrands];
  }
  return '';
};

export const getPaymentMethodBrandName = (
  brandName: string,
  defaultBrandName: string,
) => {
  if (brandName in PAYMENT_METHOD_BRAND_NAME_MAP) {
    return PAYMENT_METHOD_BRAND_NAME_MAP[brandName as PaymentMethodBrands];
  }
  return defaultBrandName;
};

type InvoiceWithMember = Pick<Invoice, 'uuid'> & {
  member?: number | { id: number };
};

export type OpenPaymentFlowFromLegacyArgs = {
  invoice: InvoiceWithMember;
  paymentFlowModalEnabled: boolean;
  showRevampedSidebar: boolean;
  pathname?: string;
  pushRouter: (path: string) => void;
};

const resolveMemberId = (
  member: InvoiceWithMember['member'],
): number | undefined => {
  if (!member) return undefined;
  return typeof member === 'number' ? member : member.id;
};

/** Custom event listened to by the revamped navigation sidebar for URL updates. */
const PAYMENT_FLOW_NAVIGATION_EVENT = 'navigation';

/**
 * Opens the revamped payment flow by updating URL query params.
 * Uses `history.replaceState` (not React Router `push`) so route-level `<Prompt>`
 * guards on the current page are not triggered for query-only changes.
 * Returns true when the URL was updated (caller should not open legacy PaymentDialog).
 */
export const openPaymentFlowFromLegacy = ({
  invoice,
  paymentFlowModalEnabled,
  showRevampedSidebar,
  pathname,
  pushRouter,
}: OpenPaymentFlowFromLegacyArgs): boolean => {
  const memberId = resolveMemberId(invoice.member);

  if (
    !paymentFlowModalEnabled ||
    !showRevampedSidebar ||
    !pathname ||
    !invoice.uuid ||
    !memberId
  ) {
    return false;
  }

  const existingSearch =
    (typeof window !== 'undefined' && window.location.search) || '';
  const params = new URLSearchParams(existingSearch);
  params.set('pfOpen', '');
  params.set('invoiceId', invoice.uuid);
  params.set('memberId', String(memberId));
  const search = params.toString();
  const path = search ? `${pathname}?${search}` : pathname;

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', path);
    window.dispatchEvent(
      new CustomEvent(PAYMENT_FLOW_NAVIGATION_EVENT, { detail: { path } }),
    );
    return true;
  }

  pushRouter(path);
  return true;
};

/**
 * Returns the minimum amount in cents that Stripe requires for the current currency.
 * @returns The minimum amount in cents.
 */
export const getStripeMinimumAmountCts = (): number => {
  const currency = getCurrencyCode().toLowerCase();
  return (
    STRIPE_MINIMUM_AMOUNT_CTS_BY_CURRENCY[currency] ??
    STRIPE_MINIMUM_AMOUNT_CTS_BY_CURRENCY.default
  );
};
