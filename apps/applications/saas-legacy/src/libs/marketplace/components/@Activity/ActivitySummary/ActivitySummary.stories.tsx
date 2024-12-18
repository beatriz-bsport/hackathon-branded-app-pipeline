import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, Meta } from '@storybook/react';

import ActivitySummary, { ActivitySummaryForStorybook, type Props } from '.';
import { generateRandomName } from '../../../../../utils/factories';
import { CompanyTheme } from '#src/libs/theme/types';
import { Establishment } from '#src/libs/establishment/types';
import themeFactoryBot from '#src/libs/theme/factories';
import establishmentFactoryBot from '#src/libs/establishment/factories/Establishments';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { Coach } from '#src/libs/associated-coach/types';

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
  credits: '6 crédits',
};
