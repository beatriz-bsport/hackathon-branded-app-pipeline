import React from 'react';

import ConsumerSubscriptionDetailsCard, {
  ConsumerSubscriptionDetailsCardProps,
} from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerSubscriptionDetailsCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { subscriptionFactory } from '#libs/subscription/factory';
import { fakeFailedInvoices, fakeSuccessfulInvoices } from './fakeData';
import { MarketplacePaymentMethods } from '#libs/marketplace/types';
import { formatAsDate } from '#utils/datetime';

const SUBSCRIPTION = subscriptionFactory();
const SUBSCRIPTIONDATE = formatAsDate(SUBSCRIPTION.first_billing_date);
const SUBSCRIPTIONEXTPAYMENTDATE = formatAsDate(SUBSCRIPTION.next_billing_date);
const NEXTBILLINGDATE = formatAsDate(SUBSCRIPTION.next_billing_date);
const TERMSDATE = formatAsDate(SUBSCRIPTION.contract_terms_date_accepted);
const LASTINVOICEDATEBEFORERENWAL = formatAsDate(
  SUBSCRIPTION.next_billing_date,
);

const ConsumerSubscriptionDetailsCardVariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayPlaceholder',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'hasMissingPaymentMethod',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isPaused',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'withFuturePauses',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'hasAutoRenewal',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'WithBillingHistory',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'withFailedPayments',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'paymentMethodType',
    choices: [
      {
        label: 'card_payment_method',
        value: MarketplacePaymentMethods.card,
      },
      {
        label: MarketplacePaymentMethods.sepa,
        value: MarketplacePaymentMethods.sepa,
      },
      {
        label: MarketplacePaymentMethods.bacs,
        value: MarketplacePaymentMethods.bacs,
      },
    ],
    default: {
      label: 'card_payment_method',
      value: MarketplacePaymentMethods.card,
    },
  },
];

type VariationsProps = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'failedInvoices'
  | 'hasAutoRenewal'
  | 'hasMissingPaymentMethod'
  | 'isLoading'
  | 'isPaused'
  | 'paymentMethodType'
  | 'selectedSubscriptionInvoiceDetails'
  | 'selectedSubscriptionsFuturePauses'
  | 'showPlaceholder'
>;

export const CONSUMER_SUBSCRIPTION_DETAILS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_SUBSCRIPTION_DETAILS_CARD,
    css: ConsumerSubscriptionDetailsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerSubscriptionDetailsCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const hasMissingPaymentMethod =
    variationsSelected?.hasMissingPaymentMethod?.value === 'true';
  const isLoading = variationsSelected?.loading?.value === 'true';
  const isPaused = variationsSelected?.isPaused?.value === 'true';
  const displayPlaceholder =
    variationsSelected?.displayPlaceholder?.value === 'true';
  const WithBillingHistory =
    variationsSelected?.WithBillingHistory?.value === 'true';
  const withFailedPayments =
    variationsSelected?.withFailedPayments?.value === 'true';
  const withFuturePauses =
    variationsSelected?.withFuturePauses?.value === 'true';
  const hasAutoRenewal = variationsSelected?.hasAutoRenewal?.value === 'true';
  const paymentMethodType = variationsSelected?.paymentMethodType
    ?.value as MarketplacePaymentMethods;

  return {
    hasMissingPaymentMethod,
    isLoading,
    isPaused,
    paymentMethodType,
    selectedSubscriptionInvoiceDetails: WithBillingHistory
      ? fakeSuccessfulInvoices
      : null,
    // @ts-ignore creating fake data just to display some invoices
    failedInvoices: withFailedPayments ? fakeFailedInvoices : null,
    selectedSubscriptionsFuturePauses: withFuturePauses
      ? SUBSCRIPTION.pauses
      : null,
    showPlaceholder: displayPlaceholder,
    hasAutoRenewal,
  };
};

export const CONSUMER_SUBSCRIPTION_DETAILS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyFn = () => {};

  return (
    <ConsumerSubscriptionDetailsCard
      {...componentProps}
      areDetailsLoading={false}
      autoRenewalDate={NEXTBILLINGDATE}
      description={SUBSCRIPTION.description}
      handleInvoiceDetailsPaginationFetchMore={emptyFn}
      hasDetailsNextPage={false}
      invoiceRetryNumber={0}
      isMobile={false}
      isPaymentMethodSectionHidden={false}
      joiningFee={SUBSCRIPTION.flat_fee}
      lastInvoiceDateBeforeRenewal={
        componentProps.hasAutoRenewal && LASTINVOICEDATEBEFORERENWAL
      }
      onPaymentMethodActionClick={emptyFn}
      onSeeClick={emptyFn}
      pauseEndDate={NEXTBILLINGDATE}
      price={SUBSCRIPTION.recurrent_price.toString()}
      readableIdentifier="4242"
      recurrence={SUBSCRIPTION.recurrence_basis}
      recurrentPrice={
        componentProps.hasAutoRenewal && SUBSCRIPTION.recurrent_price.toString()
      }
      subscriptionInterval={SUBSCRIPTION.interval}
      subscriptionName={SUBSCRIPTION.name_without_member_name}
      subscriptionNextPaymentDate={SUBSCRIPTIONEXTPAYMENTDATE}
      subtitleDate={SUBSCRIPTIONDATE}
      termsDate={TERMSDATE}
    />
  );
});
