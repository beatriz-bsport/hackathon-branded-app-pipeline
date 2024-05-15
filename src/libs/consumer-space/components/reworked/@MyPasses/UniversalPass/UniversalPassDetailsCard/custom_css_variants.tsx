import React from 'react';

import { DateTime } from 'luxon';
import { faker } from '@faker-js/faker';

import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { generateRandomName, generateRandomNames } from '#utils/factories';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';

import UniversalPassDetailsCard, { UniversalPassDetailsCardProps } from '.';

import type {
  ConsumerPaymentPackCompatibility,
  DayOfWeekNumber,
  PrivateConsumerPassCompatibility,
  TimeSlot,
} from '#libs/consumer-space/types';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import UniversalPassDetailsCardCss from '!!raw-loader!./styles.css';

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
const fakeAppointmentCompatibilities: PrivateConsumerPassCompatibility[] =
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    name: generateRandomName(faker),
    sessions: faker.lorem
      .words(faker.number.int({ min: 1, max: 4 }))
      .split(' '),
  }));

const UniversalPassDetailsCardVariationRegistry = [
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
  UniversalPassDetailsCardProps,
  'isSuspended' | 'expirationDate' | 'startDate'
>;

export const UNIVERSAL_PASS_DETAILS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.UNIVERSAL_PASS_DETAILS_CARD,
    css: UniversalPassDetailsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: UniversalPassDetailsCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  // TODO: Add mobile variant
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

export const UNIVERSAL_PASS_DETAILS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <UniversalPassDetailsCard
      isCompatibleWithBookingForGuest
      isCompatibleWithVod
      activityCompatibilities={[
        ...fakeActivityCompatibilities,
        ...fakeCategoryCompatibilities,
        ...fakeRoomCompatibilities,
      ]}
      appointmentCompatibilities={[
        ...fakeAppointmentCompatibilities,
        { name: 'Appointment with all sessions', sessions: [] },
      ]}
      compatibleEstablishments={fakeEstablishments}
      creditsLeft={
        fakeConsumerPaymentPack.available_credits -
        fakeConsumerPaymentPack.used_credits
      }
      description={fakeConsumerPaymentPack.payment_pack.description}
      name={fakeConsumerPaymentPack.payment_pack.name}
      sharedWith={fakeMembers}
      timeSlots={fakeTimeSlots}
      totalCredits={fakeConsumerPaymentPack.available_credits}
      {...componentProps}
    />
  );
});
