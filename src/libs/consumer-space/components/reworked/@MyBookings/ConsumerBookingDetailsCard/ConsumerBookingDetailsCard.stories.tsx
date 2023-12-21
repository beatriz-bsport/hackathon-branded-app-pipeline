import { fakerEN as faker } from '@faker-js/faker';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import moment from 'moment-timezone';
import React, { useState } from 'react';

import { BottomDrawerStorybook } from '#Fabrique/BottomDrawer';
import { ButtonStorybook } from '#Fabrique/ButtonV2';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { establishment_factory } from '#libs/establishment/factory';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import themeFactoryBot from '#libs/theme/factories';
import { consumerBookingListFactory } from '#libs/booking/factories';

import { ConsumerBookingDetailsCardStorybook } from '.';

import type { ConsumerBooking } from '#libs/booking/types';

const DAYS_IN_FUTURE = 3;
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
// @ts-expect-error factories to refactor.
const WORKSHOP_LINKED_OFFERS: ConsumerBooking[] = consumerBookingListFactory(5);

const CardDetailsStorybookTemplate: ComponentStory<
  typeof ConsumerBookingDetailsCardStorybook
> = (args) => <ConsumerBookingDetailsCardStorybook {...args} />;

const BottomDrawerCardDetailsStorybookTemplate: ComponentStory<
  typeof ConsumerBookingDetailsCardStorybook
> = (args) => {
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const handleOpenBottomDrawer = () => setIsBottomDrawerOpen(true);
  const handleCloseBottomDrawer = () => setIsBottomDrawerOpen(false);
  return (
    <div>
      <ButtonStorybook size="md" onClick={handleOpenBottomDrawer}>
        Open drawer
      </ButtonStorybook>
      <BottomDrawerStorybook
        blanketProps={{
          isOpen: isBottomDrawerOpen,
          onClick: handleCloseBottomDrawer,
        }}
        modalDialogProps={{
          title: faker.lorem.words(3),
          cancelLabel: 'Back',
          onClose: handleCloseBottomDrawer,
          onCancel: handleCloseBottomDrawer,
        }}
      >
        <ConsumerBookingDetailsCardStorybook {...args} />
      </BottomDrawerStorybook>
    </div>
  );
};

const defaultArgs = {
  showPlaceholder: false,
  isLoading: false,
  establishmentTimezoneName: 'Europe/London',
  establishmentRoomName: 'Cycling Room',
  establishmentAddress: ESTABLISHMENT.location.address,
  sessionTimeDisplay:
    themeFactoryBot.companyTheme.createOne().session_time_display,
  timezoneName: moment.tz.guess(),
  levelName: faker.word.words(3),
  metaActivityPicture: META_ACTIVITY.cover_main,
  metaActivityName: META_ACTIVITY.name,
  description: DESCRIPTION,
  metaActivityLastDiscardMinutes: META_ACTIVITY.last_discard_minutes,
  waitlistPosition: WAITLIST_POSITION,
  coachDescription: DESCRIPTION,
  coachPicture: COACH_PICTURE,
  coachName: COACH_NAME,
  coachInstagramURL: RANDOM_URL,
  coachFacebookURL: RANDOM_URL,
  paymentPackName: PAYMENT_PACK.name,
  isConsumerPaymentPackDisabled: CONSUMER_PAYMENT_PACK.disabled,
  consumerPaymentPackPenaltyDisabledFrom:
    CONSUMER_PAYMENT_PACK.penalty_disabled_from,
  consumerPaymentPackPenaltyDisabledUntil:
    CONSUMER_PAYMENT_PACK.penalty_disabled_until,
  consumerPaymentPackAvailableCredits: CONSUMER_PAYMENT_PACK.available_credits,
  consumerPaymentPackUsedCredits: CONSUMER_PAYMENT_PACK.used_credits,
  paymentPackTotalCredits: PAYMENT_PACK.credits,
  isPaymentPackUnlimited: PAYMENT_PACK.unlimited,
};

export const DetailsCardLoading = CardDetailsStorybookTemplate.bind({});
DetailsCardLoading.args = { ...defaultArgs, isLoading: true };

export const DetailsCardPlaceholder = CardDetailsStorybookTemplate.bind({});
DetailsCardPlaceholder.args = { ...defaultArgs, showPlaceholder: true };

export const DetailsCardSelectedBooking = CardDetailsStorybookTemplate.bind({});
DetailsCardSelectedBooking.args = { ...defaultArgs };

export const DetailsCardCancelledBooking = CardDetailsStorybookTemplate.bind(
  {},
);
DetailsCardCancelledBooking.args = {
  ...defaultArgs,
  isCancelled: true,
  isLateCancellation: false,
  creditsToRefund: CREDITS_TO_REFUND,
  cancellationDate: CANCELLATION_DATE,
  isCancelledFromManager: false,
};

export const DetailsCardAbsentTeacher = CardDetailsStorybookTemplate.bind({});
DetailsCardAbsentTeacher.args = {
  ...defaultArgs,
  coachOverrideName: COACH_OVERRIDE_NAME,
  coachOverridePicture: COACH_OVERRIDE_PICTURE,
  coachOverrideDescription: DESCRIPTION,
};

export const DetailsCardLinkedToWorkshop = CardDetailsStorybookTemplate.bind(
  {},
);
DetailsCardLinkedToWorkshop.args = {
  ...defaultArgs,
  workshopLinkedOffers: WORKSHOP_LINKED_OFFERS,
};

export const DetailsCardInBottomDrawer =
  BottomDrawerCardDetailsStorybookTemplate.bind({});
DetailsCardInBottomDrawer.args = { ...defaultArgs };

export default {
  title: 'Library/Consumer-space/ConsumerBookingCardDetails',
  component: ConsumerBookingDetailsCardStorybook,
  argTypes: {
    className: {
      description: 'Optional CSS class name to pass to the root element',
      control: 'text',
    },
    showPlaceholder: {
      description: 'If `true` the placeholder will be displayed instead',
      control: 'boolean',
    },
    isLoading: {
      description: 'Whether the card is in loading state or not',
      control: 'boolean',
    },
    isCancelled: {
      description: 'Whether the booking has been cancelled or not',
      control: 'boolean',
    },
    isCancelledFromManager: {
      description:
        'Whether the booking has been cancelled by the manager or not',
      control: 'boolean',
    },
    isLateCancellation: {
      description:
        'Whether the booking has been cancelled lately and is not eligible for a refund',
      control: 'boolean',
    },
    creditsToRefund: {
      description:
        'The number of credits to refund after the booking cancellation',
      control: { type: 'number' },
    },
    cancellationDate: {
      description: 'The date of when the booking has been cancelled',
      control: 'text',
    },
    date: {
      description: 'The formatted date of the offer',
      control: 'text',
    },
    establishmentTimezoneName: {
      description:
        'The establishment timezone retrieved from the company theme',
      control: 'text',
    },
    establishmentRoomName: {
      description:
        'Optional room name to display above of the establishment address',
      control: 'text',
    },
    establishmentAddress: {
      description: 'The address of the establishment related to the offer',
      control: 'text',
    },
    sessionTimeDisplay: {
      description:
        'The time display configuration retrieved from the company offer',
      control: 'text',
    },
    timezoneName: {
      description: 'The name of the timezone retrieved from the company offer',
      control: 'text',
    },
    levelName: {
      description: 'The level name associated to the offer',
      control: 'text',
    },
    metaActivityPicture: {
      description: "Optional picture from the offer's activity",
      control: 'text',
    },
    metaActivityName: {
      description: 'The name of the activity related to the offer',
      control: 'text',
    },
    description: {
      description: "The description related to the offer's activity",
      control: 'text',
    },
    metaActivityLastDiscardMinutes: {
      description:
        "The number of minutes used to display the policy for cancellations from the offer's activity",
      control: { type: 'number' },
    },
    waitlistPosition: {
      description: 'Optional member position in the waitlist if any',
      control: { type: 'number' },
    },
    coachDescription: {
      description: 'Optional description of the original teacher',
      control: 'text',
    },
    coachPicture: {
      description: 'Optional picture of the original teacher',
      control: 'text',
    },
    coachName: {
      description: 'Name of the original teacher',
      control: 'text',
    },
    coachOverrideDescription: {
      description: 'Optional description of the substitute teacher',
      control: 'text',
    },
    coachOverridePicture: {
      description: 'Optional picture of the substitute teacher',
      control: 'text',
    },
    coachOverrideName: {
      description: 'Optional mame of the substitute teacher',
      control: 'text',
    },
    coachInstagramURL: {
      description: "Optional URL of the teacher's instagram profile",
      control: 'text',
    },
    coachFacebookURL: {
      description: "Optional URL of the teacher's facebook profile",
      control: 'text',
    },
    paymentPackName: {
      description: 'Name of the pass the member booked with',
      control: 'text',
    },
    isConsumerPaymentPackDisabled: {
      description: 'Whether the pass of the member is disabled or not',
      control: 'boolean',
    },
    consumerPaymentPackPenaltyDisabledFrom: {
      description: "Optional penalty start date on the member's pass",
      control: 'text',
    },
    consumerPaymentPackPenaltyDisabledUntil: {
      description: "Optional penalty end date on the member's pass",
      control: 'text',
    },
    consumerPaymentPackAvailableCredits: {
      description: "The number of remaining credits on the member's pass",
      control: { type: 'number' },
    },
    consumerPaymentPackUsedCredits: {
      description: "The number of used credits on the member's pass",
      control: { type: 'number' },
    },
    paymentPackTotalCredits: {
      description: 'The initial number of the pass bought by the member',
      control: { type: 'number' },
    },
    isPaymentPackUnlimited: {
      description: "Whether the member's pass has unlimited credits or not",
      control: 'boolean',
    },
    workshopLinkedOffers: {
      description:
        "If the offer's meta activity is from a workshop, these are the similar offers from the same workshop",
    },
  },
} as ComponentMeta<typeof ConsumerBookingDetailsCardStorybook>;
