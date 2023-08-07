import React from 'react';
// @ts-expect-error
import OfferMinimalSummary, { Props } from './OfferMinimalSummary.component';
import { offerFactory } from '#libs/offer/factory';

const CustomTemplate = (args: Props) => <OfferMinimalSummary {...args} />;

export const CompleteDefaultState = CustomTemplate.bind({});

CompleteDefaultState.args = {
  offer: offerFactory(),
  getHasPendingReplacementRequest: () => true,
  showRollCall: true,
};

export default {
  title: 'Pages/Offer/OfferMinimalSummary',
  component: OfferMinimalSummary,
  parameters: {
    docs: {
      page: null,
    },
  },
};
