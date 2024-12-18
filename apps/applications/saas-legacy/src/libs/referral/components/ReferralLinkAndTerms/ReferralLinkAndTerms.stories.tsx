import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ReferralLinkAndTerms, {
  ReferralLinkAndTermsForStorybook,
  Props,
} from './';
import { referralProgramFactory } from '#src/libs/referral/factories/ReferralProgram';

const ReferralLinkAndTermsStorybookTemplate: ComponentStory<
  typeof ReferralLinkAndTermsForStorybook
> = (args) => (
  <ReferralLinkAndTermsForStorybook {...args}>
    {args.children}
  </ReferralLinkAndTermsForStorybook>
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

ReferralLinkAndTermsForStorybook.displayName = 'ReferralLinkAndTerms';

export const BaseReferralLinkAndTerms =
  ReferralLinkAndTermsStorybookTemplate.bind({});
BaseReferralLinkAndTerms.args = baseArgs;

export const NoReferralProgram = ReferralLinkAndTermsStorybookTemplate.bind({});
NoReferralProgram.args = { ...baseArgs, referralProgram: null };

export const ReferringGetsNothing = ReferralLinkAndTermsStorybookTemplate.bind(
  {},
);
ReferringGetsNothing.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_reward_referring: '0',
  },
};

export const ReferredGetsNothing = ReferralLinkAndTermsStorybookTemplate.bind(
  {},
);
ReferredGetsNothing.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_off_referred: '0',
    percent_off_referred: 0,
  },
};

export const NoOneGetsAnythingReferralLinkAndTerms =
  ReferralLinkAndTermsStorybookTemplate.bind({});
NoOneGetsAnythingReferralLinkAndTerms.args = {
  ...baseArgs,
  referralProgram: {
    ...referralProgramFactory(),
    amount_off_referred: '0',
    percent_off_referred: 0,
    amount_reward_referring: '0',
  },
};

export const NoMoreReferralLinkUses =
  ReferralLinkAndTermsStorybookTemplate.bind({});
NoMoreReferralLinkUses.args = { ...baseArgs, nbRemainingReferralUses: 0 };

export const WidgetWithUnknownError =
  ReferralLinkAndTermsStorybookTemplate.bind({});
WidgetWithUnknownError.args = { ...baseArgs, hasUnknownError: true };

export const NoUserLoggedInReferralLinkAndTerms =
  ReferralLinkAndTermsStorybookTemplate.bind({});
NoUserLoggedInReferralLinkAndTerms.args = {
  ...baseArgs,
  isAuthenticated: false,
};

export const LoadingReferralLinkAndTerms =
  ReferralLinkAndTermsStorybookTemplate.bind({});
LoadingReferralLinkAndTerms.args = { ...baseArgs, isLoading: true };

const componentMeta: ComponentMeta<typeof ReferralLinkAndTermsForStorybook> = {
  title: 'ReferralLinkAndTerms',
  component: ReferralLinkAndTerms,
  argTypes: { onLoginClick: { action: 'clicked' } },
  parameters: {
    layout: 'centered',
  },
};

export default componentMeta;
