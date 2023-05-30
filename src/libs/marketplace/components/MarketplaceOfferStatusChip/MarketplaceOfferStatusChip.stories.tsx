import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MarketplaceOfferStatusChip from '.';

import { offersFactory } from '#libs/offer/factory';
import themeFactory from '#libs/theme/factories';

import type { Props } from '.';

import './styles.css';
import { CompanyTheme } from '#libs/theme/types';

const offer = offersFactory();
const fakeTheme: CompanyTheme = themeFactory.companyTheme.createOne();

const fakeOffer = {
  ...offer,
  available: true,
  full: false,
  date_start:
    'Tue Aug 30 2023 04:19:17 GMT+0200 (heure d’été d’Europe centrale)',
};

export default {
  title: 'Marketplace/MarketplaceOfferStatusChip',
  component: MarketplaceOfferStatusChip,
  args: {
    showLabel: true,
    companyTheme: { ...fakeTheme, hide_book_button: true },
  },
} as ComponentMeta<typeof MarketplaceOfferStatusChip>;

const Template: ComponentStory<typeof MarketplaceOfferStatusChip> = (
  args: Props,
) => <MarketplaceOfferStatusChip {...args} />;

export const Booked = Template.bind({});
Booked.args = {
  offer: fakeOffer,
  isRegistered: true,
};

export const Cancelled = Template.bind({});
Cancelled.args = {
  offer: {
    ...fakeOffer,
    available: false,
  },
  isRegistered: false,
};

export const WaitingList = Template.bind({});
WaitingList.args = {
  offer: { ...fakeOffer, full: true },
  isRegistered: false,
};

export const Completed = Template.bind({});
Completed.args = {
  offer: {
    ...fakeOffer,
    date_start:
      'Tue May 10 2020 22:02:48 GMT+0200 (heure d’été d’Europe centrale)',
  },
  isRegistered: false,
};

export const Soon = Template.bind({});
Soon.args = {
  offer: {
    ...fakeOffer,
    meta_activity: { first_booking_minutes_until: 90 },
  },
  isRegistered: false,
};
