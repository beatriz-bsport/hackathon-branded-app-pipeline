import React from 'react';

import { DateTime } from 'luxon';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { paymentPackFactory } from '#libs/payment-packs/factory';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerPassCardCss from './styles.css?raw';
import ConsumerPassCard, { ConsumerPassCardProps } from '.';

const fakeConsumerPass = consumerPaymentPackFactory();
const fakePaymentPack = paymentPackFactory();

const ConsumerPassCardVariationRegistry = [
  {
    label: 'isShared',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isSuspended',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isUnlimited',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'expiresSoon',
    choices: [
      { label: 'true', value: 'true' },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
];

type VariationsProps = Pick<
  ConsumerPassCardProps,
  'isShared' | 'isSuspended' | 'isUnlimited' | 'expirationDate'
>;

export const CONSUMER_PASS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.CONSUMER_PASS_CARD,
  css: ConsumerPassCardCss,
  pages: [MarketplacePage.CONSUMER_SPACE],
  defaultState: {},
  variations: ConsumerPassCardVariationRegistry,
};

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const isShared = variationsSelected?.isShared?.value === 'true';
  const isSuspended = variationsSelected?.isSuspended?.value === 'true';
  const isUnlimited = variationsSelected?.isUnlimited?.value === 'true';
  const expirationDate =
    variationsSelected?.expiresSoon?.value === 'true'
      ? DateTime.now().plus({ day: 1 }).toISODate()
      : DateTime.now().plus({ days: 10 }).toISODate();
  return { isShared, isSuspended, isUnlimited, expirationDate };
};

export const CONSUMER_PASS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyMethod = React.useCallback(() => {}, []);

  return (
    <ConsumerPassCard
      creditsLeft={(
        fakeConsumerPass.available_credits - fakeConsumerPass.used_credits
      ).toString()}
      expirationDate={fakeConsumerPass.ending_date}
      handleSeeDetails={emptyMethod}
      passName={fakePaymentPack.name}
      startDate={fakeConsumerPass.starting_date}
      totalCredits={fakeConsumerPass.available_credits.toString()}
      {...componentProps}
    />
  );
});
