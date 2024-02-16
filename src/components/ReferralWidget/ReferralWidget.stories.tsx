import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ReferralWidget, { ReferralWidgetForStorybook, Props } from './';
import { referralProgramFactory } from '#libs/referral/factories/ReferralProgram';

const ReferralWidgetStorybookTemplate: ComponentStory<
  typeof ReferralWidgetForStorybook
> = (args) => (
  <ReferralWidgetForStorybook {...args}>
    {args.children}
  </ReferralWidgetForStorybook>
);

const baseArgs: Props = {
  referralProgram: referralProgramFactory(),
  referralLink: 'mock/link',
  isLoading: false,
  nbRemainingReferralUses: 1,
  hasUnknownError: false,
  onLoginClick: () => {},
  isAuthenticated: true,
};

ReferralWidgetForStorybook.displayName = 'ReferralWidget';

export const BaseReferralWidget = ReferralWidgetStorybookTemplate.bind({});
BaseReferralWidget.args = baseArgs;

export const NoReferralProgram = ReferralWidgetStorybookTemplate.bind({});
NoReferralProgram.args = { ...baseArgs, referralProgram: null };

export const ReferringGetsNothing = ReferralWidgetStorybookTemplate.bind({});
ReferringGetsNothing.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_reward_referring: '0',
  },
};

export const ReferredGetsNothing = ReferralWidgetStorybookTemplate.bind({});
ReferredGetsNothing.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_off_referred: '0',
    percent_off_referred: 0,
  },
};

export const NoOneGetsAnythingReferralWidget =
  ReferralWidgetStorybookTemplate.bind({});
NoOneGetsAnythingReferralWidget.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_off_referred: '0',
    percent_off_referred: 0,
    amount_reward_referring: '0',
  },
};

export const NoMoreReferralLinkUses = ReferralWidgetStorybookTemplate.bind({});
NoMoreReferralLinkUses.args = { ...baseArgs, nbRemainingReferralUses: 0 };

export const WidgetWithUnknownError = ReferralWidgetStorybookTemplate.bind({});
WidgetWithUnknownError.args = { ...baseArgs, hasUnknownError: true };

export const NoUserLoggedInReferralWidget =
  ReferralWidgetStorybookTemplate.bind({});
NoUserLoggedInReferralWidget.args = { ...baseArgs, isAuthenticated: false };

export const LoadingReferralWidget = ReferralWidgetStorybookTemplate.bind({});
LoadingReferralWidget.args = { ...baseArgs, isLoading: true };

const componentMeta: ComponentMeta<typeof ReferralWidgetForStorybook> = {
  title: 'ReferralWidget',
  component: ReferralWidget,
  argTypes: { onLoginClick: { action: 'clicked' } },
  parameters: {
    layout: 'centered',
  },
};

export default componentMeta;
