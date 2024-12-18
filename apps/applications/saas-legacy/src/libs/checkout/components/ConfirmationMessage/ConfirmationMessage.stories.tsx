import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import ConfirmationMessage, {
  ConfirmationMessageForStorybook,
  type Props,
} from '.';
import { ConfirmationStatus } from '#src/libs/checkout/types';
import { offerFactory } from '#src/libs/offer/factories';
import { subscriptionFactory } from '#src/libs/subscription/factory';
import { checkoutItemsFactory } from '#src/libs/checkout/factories';

const offers = [offerFactory({})];
const billingPlan = subscriptionFactory();
const checkoutItems = checkoutItemsFactory(5);

export default {
  title: 'Checkout/ConfirmationPage/ConfirmationMessage',
  component: ConfirmationMessage,
  parameters: {
    layout: 'centered',
  },
  args: {
    offers: offers,
    isLoading: false,
    subscription: undefined,
    checkoutItems: checkoutItems,
    goToCalendar: () => {},
    goToMemberProfile: () => {},
    goBack: () => {},
  },
} as Meta<typeof ConfirmationMessageForStorybook>;

const Template: ComponentStory<typeof ConfirmationMessage> = (args: Props) => (
  //@ts-expect-error
  <ConfirmationMessageForStorybook {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
  status: ConfirmationStatus.GENERIC_ERROR,
  isLoading: true,
};

export const GenericError = Template.bind({});
GenericError.args = {
  status: ConfirmationStatus.GENERIC_ERROR,
};

export const GenericOfferError = Template.bind({});
GenericOfferError.args = {
  status: ConfirmationStatus.GENERIC_OFFER_ERROR,
};

export const OfferOnlyBookingError = Template.bind({});
OfferOnlyBookingError.args = {
  status: ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR,
};

export const OfferGenericErrorWithPurchase = Template.bind({});
OfferGenericErrorWithPurchase.args = {
  status: ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE,
};

export const OfferBookingErrorWithPurchase = Template.bind({});
OfferBookingErrorWithPurchase.args = {
  status: ConfirmationStatus.OFFER_BOOKING_ERROR_WITH_PURCHASE,
};

export const OfferAndPurchaseSuccess = Template.bind({});
OfferAndPurchaseSuccess.args = {
  status: ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS,
};

export const OfferAndSubscriptionSuccess = Template.bind({});
OfferAndSubscriptionSuccess.args = {
  status: ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS,
  billingPlan: billingPlan,
};

export const OfferOnlySuccess = Template.bind({});
OfferOnlySuccess.args = {
  status: ConfirmationStatus.OFFER_ONLY_SUCCESS,
};

export const WaitingList = Template.bind({});
WaitingList.args = {
  status: ConfirmationStatus.WAITING_LIST,
};

export const PurchaseOnlySuccess = Template.bind({});
PurchaseOnlySuccess.args = {
  status: ConfirmationStatus.PURCHASE_ONLY_SUCCESS,
};
