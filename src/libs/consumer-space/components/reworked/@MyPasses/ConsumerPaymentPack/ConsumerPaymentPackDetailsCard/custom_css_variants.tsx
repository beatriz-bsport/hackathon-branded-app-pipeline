import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import { DateTime } from 'luxon';
import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { generateRandomName, generateRandomNames } from '#utils/factories';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';

import type {
  ConsumerPaymentPackCompatibility,
  DayOfWeekNumber,
  FrequencyOption,
  TimeSlot,
} from '#libs/consumer-space/types';
import ConsumerPaymentPackDetailsCard, {
  ConsumerPaymentPackDetailsCardProps,
} from '.';

// @ts-expect-error
import ConsumerPaymentPackDetailsCardCss from './styles.css?raw';

const fakeEstablishments = establishmentFactoryBot.Establishment.create(2);
const fakeMembers = generateRandomNames(faker, { count: 2 });
const fakeConsumerPaymentPack = consumerPaymentPackFactory({
  availableCredits: faker.number.int({ min: 5, max: 10 }),
  usedCredits: faker.number.int(5),
});
const fakeActivityCompatibilities: ConsumerPaymentPackCompatibility[] =
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    type: 'activity',
    label: generateRandomName(faker),
  }));
const fakeCategoryCompatibilities: ConsumerPaymentPackCompatibility[] =
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    type: 'category',
    label: generateRandomName(faker),
  }));
const fakeRoomCompatibilities: ConsumerPaymentPackCompatibility[] = Array.from(
  { length: faker.number.int({ min: 1, max: 4 }) },
  () => ({
    type: 'room',
    label: generateRandomName(faker),
  }),
);
const fakeTimeSlots: TimeSlot[] = Array.from(
  { length: faker.number.int({ min: 1, max: 8 }) },
  () => ({
    dayOfWeek: faker.number.int(6) as DayOfWeekNumber,
    from: `${faker.number.int(23)}:${faker.number.int(59)}`,
    to: `${faker.number.int(23)}:${faker.number.int(59)}`,
  }),
);
const fakeRestriction: {
  frequency: FrequencyOption;
  amount: number;
} = {
  frequency: ['month', 'day', 'week'][faker.number.int({ min: 0, max: 2 })] as
    | 'month'
    | 'day'
    | 'week',
  amount: faker.number.int(5),
};

const ConsumerPaymentPackDetailsCardVariationRegistry = [
  {
    label: 'isSuspended',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isExpired',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isFuture',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

type VariationsProps = Pick<
  ConsumerPaymentPackDetailsCardProps,
  'isSuspended' | 'expirationDate' | 'startDate'
>;

export const CONSUMER_PAYMENT_PACK_DETAILS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_PAYMENT_PACK_DETAILS_CARD,
    css: ConsumerPaymentPackDetailsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerPaymentPackDetailsCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const isSuspended = variationsSelected.isSuspended?.value === 'true';
  const expirationDate =
    variationsSelected.isExpired?.value === 'true'
      ? DateTime.now().minus({ day: 1 }).toFormat('D')
      : DateTime.now().plus({ day: 1 }).toFormat('D');
  const startDate =
    variationsSelected.isFuture?.value === 'true'
      ? DateTime.now().plus({ day: 1 }).toFormat('D')
      : DateTime.now().minus({ day: 1 }).toFormat('D');
  return {
    isSuspended,
    expirationDate,
    startDate,
  };
};

export const CONSUMER_PAYMENT_PACK_DETAILS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <ConsumerPaymentPackDetailsCard
      isCompatibleWithBookingForGuest
      isCompatibleWithVod
      activityCompatibilities={[
        ...fakeActivityCompatibilities,
        ...fakeCategoryCompatibilities,
        ...fakeRoomCompatibilities,
      ]}
      compatibleEstablishments={fakeEstablishments}
      creditsLeft={
        fakeConsumerPaymentPack.available_credits -
        fakeConsumerPaymentPack.used_credits
      }
      description={fakeConsumerPaymentPack.payment_pack.description}
      name={fakeConsumerPaymentPack.payment_pack.name}
      restriction={fakeRestriction}
      sharedWith={fakeMembers}
      timeSlots={fakeTimeSlots}
      totalCredits={fakeConsumerPaymentPack.available_credits}
      {...componentProps}
    />
  );
});
