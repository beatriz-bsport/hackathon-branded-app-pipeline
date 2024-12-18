import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import MarketplaceBookingItem, {
  MarketplaceBookingItemForStorybook,
  type Props,
} from '.';
import { generateRandomName } from '../../../../../utils/factories';
import { CompanyTheme } from '#src/libs/theme/types';
import { Establishment } from '#src/libs/establishment/types';
import themeFactoryBot from '#src/libs/theme/factories';
import establishmentFactoryBot from '#src/libs/establishment/factories/Establishments';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { Coach } from '#src/libs/associated-coach/types';
import { levelFactory } from '#src/libs/level/factories';
import { Level } from '#src/libs/level/types';

import i18n from 'i18next';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';

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
      <div className="bs-booking-item-storybook__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MarketplaceBookingItem>;

const Template: ComponentStory<typeof MarketplaceBookingItem> = (
  args: Props,
  // @ts-expect-error
) => <MarketplaceBookingItemForStorybook {...args} />;

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

export const WithAddGuestButton = Template.bind({});
WithAddGuestButton.args = {
  date: 'Wed 02 Aug • 09:30 AM - 10:30 AM',
  title: generateRandomName(faker),
  coach: fakeCoach,
  theme: fakeCompanyTheme,
  establishment: fakeEstablishment,
  hideCoach: false,
  spotName: 'Spot T6',
  isWaitingList: false,
  level: fakeLevel,
  shouldDisplayAddGuestButton: true,
  guestName: faker.person.fullName(),
  addGuestTooltipText: i18n.t(
    `booking:offer.bookingForAGuest.bookingStatus.${OFFER_BOOKABLE_STATUS_BOOKABLE}`,
  ),
};
