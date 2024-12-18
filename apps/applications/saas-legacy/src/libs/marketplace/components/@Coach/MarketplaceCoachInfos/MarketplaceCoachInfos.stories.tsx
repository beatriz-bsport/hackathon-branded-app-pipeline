import React from 'react';
import FactoryBotTheme from '#src/libs/theme/factories';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { coachFactory } from '#src/libs/associated-coach/factories';

import './styles.css';

import MarketplaceCoachInfos from '.';

import type { Props } from '.';

const fakeTheme = FactoryBotTheme.companyTheme.create();
const fakeCoach = coachFactory();

export default {
  title: 'Library/Marketplace/CoachInfos',
  component: MarketplaceCoachInfos,
  args: {
    hideCoach: false,
    coach: fakeCoach,
  },
} as ComponentMeta<typeof MarketplaceCoachInfos>;

const Template: ComponentStory<typeof MarketplaceCoachInfos> = (
  args: Props,
) => <MarketplaceCoachInfos {...args} />;

export const Default = Template.bind({});
Default.args = {
  theme: { ...fakeTheme, coach_display: 1 },
  classes: {
    coach_container: 'coach_container',
  },
  coachPictureClasses: {
    coach_container__left__icon: 'coach_container__left__icon',
  },
  coachNameClasses: {
    coach_container__name: 'coach_container__name',
  },
};

export const OnlyFirstName = Template.bind({});
OnlyFirstName.args = {
  theme: { ...fakeTheme, coach_display: 2 },
  classes: {
    coach_container: 'coach_container',
  },
  coachPictureClasses: {
    coach_container__left__icon: 'coach_container__left__icon',
  },
  coachNameClasses: {
    coach_container__name: 'coach_container__name',
  },
};

export const FirstNameWithPicture = Template.bind({});
FirstNameWithPicture.args = {
  theme: { ...fakeTheme, coach_display: 3 },
  classes: {
    coach_container: 'coach_container',
  },
  coachPictureClasses: {
    coach_container__left__icon: 'coach_container__left__icon',
  },
  coachNameClasses: {
    coach_container__name: 'coach_container__name',
  },
};

export const FullNameWithoutPicture = Template.bind({});
FullNameWithoutPicture.args = {
  theme: { ...fakeTheme, coach_display: 4 },
  classes: {
    coach_container: 'coach_container',
  },
  coachPictureClasses: {
    coach_container__left__icon: 'coach_container__left__icon',
  },
  coachNameClasses: {
    coach_container__name: 'coach_container__name',
  },
};
