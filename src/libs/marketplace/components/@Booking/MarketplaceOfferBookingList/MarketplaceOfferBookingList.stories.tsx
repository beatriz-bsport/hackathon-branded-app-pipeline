import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import MarketplaceOfferBookingList, {
  MarketplaceOfferBookingListForStorybook,
} from '.';
import { offerFactory } from '#libs/offer/factories';
import themeFactory from '#libs/theme/factories';
import type { Props } from '.';
import { OfferWithSpotInformation } from '#libs/offer/types';
import { CompanyTheme } from '#libs/theme/types';
import { levelFactory } from '#libs/level/factories';

const offer = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
  }),
  level: levelFactory(),
};

const offerWaitingList = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
    offerStatus: 'waitingList',
  }),
  level: levelFactory(),
};

const offerWithSpot = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
  }),
  spot_id: faker.number.int(),
  spot_information: {
    name: faker.word.noun(5),
    prefix: faker.word.noun(5),
    shape: faker.word.noun(5),
    fill: faker.word.noun(5),
    stroke: faker.word.noun(5),
    indexType: faker.number.int(),
  },
  level: levelFactory(),
};

const offers: OfferWithSpotInformation[] = [
  offer,
  offerWaitingList,
  offerWithSpot,
];

const companyTheme: CompanyTheme = {
  ...themeFactory.companyTheme.create(),
  show_establishment: true,
};

export default {
  title: 'Components/Marketplace/BookingItem/OfferBookingList',
  component: MarketplaceOfferBookingList,
  args: {
    offers: offers,
    hideCoach: false,
    companyTheme: companyTheme,
  },
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MarketplaceOfferBookingListForStorybook>;

const Template: ComponentStory<typeof MarketplaceOfferBookingList> = (
  args: Props,
) => (
  //@ts-expect-errorts
  <MarketplaceOfferBookingListForStorybook {...args} />
);

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
