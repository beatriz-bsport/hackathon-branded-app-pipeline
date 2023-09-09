import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import ActivitySummary, { ActivitySummaryForStorybook, type Props } from '.';
import { generateRandomName } from '../../../../../utils/factories';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';
import themeFactoryBot from '#libs/theme/factories';
import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { coachFactory } from '#libs/associated-coach/factories';
import { Coach } from '#libs/associated-coach/types';

const fakeCompanyTheme: CompanyTheme = themeFactoryBot.companyTheme.createOne();

const fakeEstablishment: Establishment =
  establishmentFactoryBot.Establishment.createOne();

const fakeCoach: Coach = coachFactory();

export default {
  title: 'Components/Marketplace/BookingItem/ActivitySummary',
  component: ActivitySummary,
} as Meta<typeof ActivitySummaryForStorybook>;

const Template: ComponentStory<typeof ActivitySummary> = (args: Props) => (
  // @ts-expect-error
  <ActivitySummaryForStorybook {...args} />
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
};
