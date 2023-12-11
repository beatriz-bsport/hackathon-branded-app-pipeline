import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import {
  ConsumerBookingDetailsCardStorybook,
  Props as ConsumerBookingDetailsCard,
} from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerBookingDetailsCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { establishment_factory } from '#libs/establishment/factory';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { consumerBookingListFactory } from '#libs/booking/factories';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { ConsumerBooking } from '#libs/booking/types';

const DAYS_IN_FUTURE = 3;
const OFFER_DATE_START = moment().add(DAYS_IN_FUTURE, 'days').format();
const LEVEL_NAME = faker.word.adjective({ length: { min: 5, max: 10 } });
const RANDOM_URL = faker.internet.url();
const COACH_PICTURE = faker.internet.avatar();
const COACH_NAME = faker.person.fullName();
const COACH_OVERRIDE_PICTURE = faker.internet.avatar();
const COACH_OVERRIDE_NAME = faker.person.fullName();
const META_ACTIVITY = meta_activity_factory(1)[0];
const ESTABLISHMENT = establishment_factory(1)[0];
const CONSUMER_PAYMENT_PACK = consumerPaymentPackFactory();
const PAYMENT_PACK = paymentPackFactory({ isUnlimited: false });
const CREDITS_TO_REFUND = faker.number.int({ min: 1, max: 3 });
const CANCELLATION_DATE = moment()
  .add(DAYS_IN_FUTURE - 1, 'days')
  .format('L');
const DESCRIPTION = faker.lorem.sentences(5);
const WAITLIST_POSITION = faker.number.int({ min: 1, max: 5 });
const TIMEZONE = moment.tz.guess();
// @ts-expect-error factories to refactor.
const WORKSHOP_LINKED_OFFERS: ConsumerBooking[] = consumerBookingListFactory(5);

const consumerBookingDetailsCardVariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isBookingCancelled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showEstablishmentRoom',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showCancellationPolicy',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showWaitlistPosition',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'hasCoachOverride',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showWorkshopLinkedOffers',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  theme?: CompanyTheme,
): ConsumerBookingDetailsCard => {
  const isLoadingSelected = variationsSelected?.loading?.value === 'true';
  const isCancelledSelected =
    variationsSelected?.isBookingCancelled?.value === 'true';
  const showEstablishmentRoomSelected =
    variationsSelected?.showEstablishmentRoom?.value === 'true';
  const showWaitlistPositionSelected =
    variationsSelected?.showWaitlistPosition?.value === 'true';
  const showCancellationPolicySelected =
    variationsSelected?.showCancellationPolicy?.value === 'true';
  const hasCoachOverrideSelected =
    variationsSelected?.hasCoachOverride?.value === 'true';
  const showWorkshopLinkedOffersSelected =
    variationsSelected?.showWorkshopLinkedOffers?.value === 'true';

  return {
    date: OFFER_DATE_START,
    isLoading: isLoadingSelected,
    isCancelled: isCancelledSelected,
    creditsToRefund: CREDITS_TO_REFUND,
    cancellationDate: CANCELLATION_DATE,
    isCancelledFromManager: false,
    establishmentRoomName: showEstablishmentRoomSelected && 'Cycling Room',
    establishmentAddress: ESTABLISHMENT.location.address,
    sessionTimeDisplay: theme.session_time_display,
    timezoneName: TIMEZONE,
    levelName: LEVEL_NAME,
    metaActivityPicture: META_ACTIVITY.cover_main,
    metaActivityName: META_ACTIVITY.name,
    description: DESCRIPTION,
    waitlistPosition: showWaitlistPositionSelected && WAITLIST_POSITION,
    coachDescription: DESCRIPTION,
    metaActivityLastDiscardMinutes:
      showCancellationPolicySelected && META_ACTIVITY.last_discard_minutes,
    coachPicture: COACH_PICTURE,
    coachName: COACH_NAME,
    coachOverrideDescription: hasCoachOverrideSelected && DESCRIPTION,
    coachOverridePicture: hasCoachOverrideSelected && COACH_OVERRIDE_PICTURE,
    coachOverrideName: hasCoachOverrideSelected && COACH_OVERRIDE_NAME,
    coachInstagramURL: RANDOM_URL,
    coachFacebookURL: RANDOM_URL,
    paymentPackName: PAYMENT_PACK.name,
    isConsumerPaymentPackDisabled: CONSUMER_PAYMENT_PACK.disabled,
    consumerPaymentPackPenaltyDisabledFrom:
      CONSUMER_PAYMENT_PACK.penalty_disabled_from,
    consumerPaymentPackPenaltyDisabledUntil:
      CONSUMER_PAYMENT_PACK.penalty_disabled_until,
    consumerPaymentPackAvailableCredits:
      CONSUMER_PAYMENT_PACK.available_credits,
    consumerPaymentPackUsedCredits: CONSUMER_PAYMENT_PACK.used_credits,
    paymentPackTotalCredits: PAYMENT_PACK.credits,
    isPaymentPackUnlimited: PAYMENT_PACK.unlimited,
    workshopLinkedOffers:
      showWorkshopLinkedOffersSelected && WORKSHOP_LINKED_OFFERS,
  };
};

export const CONSUMER_BOOKING_DETAILS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_BOOKING_DETAILS_CARD,
    css: ConsumerBookingDetailsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: consumerBookingDetailsCardVariationRegistry,
  };

export const CONSUMER_BOOKING_DETAILS_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return (
    <div style={{ flex: 1 }}>
      <ConsumerBookingDetailsCardStorybook {...componentProps} />
    </div>
  );
});
