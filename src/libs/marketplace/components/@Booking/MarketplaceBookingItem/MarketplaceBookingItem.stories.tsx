import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import MarketplaceBookingItem, {
  type Props,
  MarketplaceBookingItemForStorybook,
} from '.';
import { generateRandomName } from '../../../../../utils/factories';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';
import themeFactoryBot from '#libs/theme/factories';
import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { coachFactory } from '#libs/associated-coach/factories';
import { Coach } from '#libs/associated-coach/types';
import { levelFactory } from '#libs/level/factories';
import { Level } from '#libs/level/types';

import './styles.storybook.css';

const fakeCompanyTheme: CompanyTheme = themeFactoryBot.companyTheme.createOne();

const fakeEstablishment: Establishment =
  establishmentFactoryBot.Establishment.createOne();

const fakeCoach: Coach = coachFactory();

const fakeLevel: Partial<Level> = levelFactory();

export default {
  title: 'Components/Marketplace/BookingItem/MarketplaceBookingItem',
  component: MarketplaceBookingItem,
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MarketplaceBookingItemForStorybook>;

const Template: ComponentStory<typeof MarketplaceBookingItem> = (
  args: Props,
) => (
  // @ts-expect-error
  <MarketplaceBookingItemForStorybook {...args} />
);

export const Default = Template.bind({});
Default.args = {
  date: 'Wed 02 Aug • 09:30 AM - 10:30 AM',
  title: generateRandomName(faker),
  coach: fakeCoach,
  theme: fakeCompanyTheme,
  establishment: fakeEstablishment,
  hideCoach: false,
  spotName: 'Spot T6',
  isWaitingList: false,
  level: fakeLevel,
};

export const Unconvenient = Template.bind({});
Unconvenient.args = {
  date: 'Wed 02 Aug • 09:30 AM - 10:30 AM',
  title:
    'This is a super long title for an offer, just to test the behavior of the card',
  coach: {
    ...fakeCoach,
    name: 'Hery Martial Rakotoarimanana Rajonarimampianina',
  },
  theme: fakeCompanyTheme,
  establishment: {
    ...fakeEstablishment,
    title:
      'Paris, Porte de Clignancourt, les Geraniums, bâtiment D, Escalier 2, 3eme étage',
  },
  hideCoach: false,
  spotName:
    'This is a super long title for an offer, just to test the behavior of the card',
  isWaitingList: false,
  level: fakeLevel,
};
