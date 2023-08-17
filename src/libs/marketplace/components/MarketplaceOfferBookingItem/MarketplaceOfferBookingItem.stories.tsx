import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import themeFactoryBot from '#libs/theme/factories';

import { MarketplaceOfferBookingItemForStorybook, type Props } from '.';

import MarketplaceOfferBookingItem from '.';
import { offerFactory } from '#libs/offer/factories';

const fakeTheme = themeFactoryBot.companyTheme.createOne();

const fakeOffer = offerFactory({
  withCoach: true,
  withEstablishment: true,
  withLevel: true,
});

export default {
  title: 'Components/Marketplace/BookingItem/OfferBookingItem',
  component: MarketplaceOfferBookingItem,
  parameters: {
    docs: {
      page: null,
    },
  },
  args: {
    offer: fakeOffer,
    companyTheme: fakeTheme,
    hideCoach: false,
  },
} as ComponentMeta<typeof MarketplaceOfferBookingItem>;

const Template: ComponentStory<typeof MarketplaceOfferBookingItem> = (
  args: Props,
) => (
  //@ts-expect-error
  <MarketplaceOfferBookingItemForStorybook {...args} />
);

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
