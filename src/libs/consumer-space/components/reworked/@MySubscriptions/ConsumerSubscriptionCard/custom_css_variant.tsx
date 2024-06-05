import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { subscriptionFactory } from '#libs/subscription/factory';
import { formatAsDate } from '#utils/datetime';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerSubscriptionCardCss from './styles.css?raw';
import ConsumerSubscriptionCard, { ConsumerSubscriptionCardProps } from '.';

const SUBSCRIPTION = subscriptionFactory();
const SUBSCRIPTIONDATE = formatAsDate(SUBSCRIPTION.first_billing_date);
const SUBSCRIPTIONEXTPAYMENTDATE = formatAsDate(SUBSCRIPTION.next_billing_date);

const ConsumerSubscriptionCardVariationRegistry = [
  {
    label: 'hasFailedPayments',
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
    label: 'addPaymentMethodDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isSelected',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isDetailsDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

type VariationsProps = Pick<
  ConsumerSubscriptionCardProps,
  | 'addPaymentMethodDisabled'
  | 'hasFailedPayments'
  | 'hasMissingPaymentMethod'
  | 'isLoading'
  | 'isPaused'
  | 'isSelected'
  | 'isDetailsDisabled'
>;

export const CONSUMER_SUBSCRIPTION_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_SUBSCRIPTION_CARD,
    css: ConsumerSubscriptionCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerSubscriptionCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const addPaymentMethodDisabled =
    variationsSelected?.addPaymentMethodDisabled?.value === 'true';
  const hasFailedPayments =
    variationsSelected?.hasFailedPayments?.value === 'true';
  const hasMissingPaymentMethod =
    variationsSelected?.hasMissingPaymentMethod?.value === 'true';
  const isLoading = variationsSelected?.loading?.value === 'true';
  const isPaused = variationsSelected?.isPaused?.value === 'true';
  const isSelected = variationsSelected?.isSelected?.value === 'true';
  const isDetailsDisabled =
    variationsSelected?.isDetailsDisabled?.value === 'true';
  return {
    addPaymentMethodDisabled,
    hasFailedPayments,
    hasMissingPaymentMethod,
    isLoading,
    isPaused,
    isSelected,
    isDetailsDisabled,
  };
};

export const CONSUMER_SUBSCRIPTION_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyFn = () => {};

  return (
    <ConsumerSubscriptionCard
      {...componentProps}
      onAddPaymentMethodClick={emptyFn}
      onDetailsClick={emptyFn}
      price={SUBSCRIPTION.recurrent_price.toString()}
      recurrenceBasis={SUBSCRIPTION.recurrence_basis}
      subscriptionDate={SUBSCRIPTIONDATE}
      subscriptionInterval={SUBSCRIPTION.interval}
      subscriptionName={SUBSCRIPTION.name_without_member_name}
      subscriptionNextPaymentDate={SUBSCRIPTIONEXTPAYMENTDATE}
    />
  );
});
