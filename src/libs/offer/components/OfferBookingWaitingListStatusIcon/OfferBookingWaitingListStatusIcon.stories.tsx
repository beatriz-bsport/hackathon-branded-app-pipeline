import React from 'react';

import { OfferBookingWaitingListStatusIconForStorybook, Props } from '.';

const OfferBookingWaitingListStatusIconTemplate = (args: Props) => {
  // @ts-expect-error
  return <OfferBookingWaitingListStatusIconForStorybook {...args} />;
};

export const IdleWaitingListStatus =
  OfferBookingWaitingListStatusIconTemplate.bind({});
IdleWaitingListStatus.args = {
  isErrorIcon: false,
};

export default {
  title: 'Library/Offer/OfferBookingWaitingListStatusIcon',
  component: OfferBookingWaitingListStatusIconForStorybook,
  argTypes: {},
  parameters: {
    docs: {
      page: null,
    },
  },
};
