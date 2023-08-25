import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MemberMarketplaceReferralPanel from './MemberMarketplaceReferralPanel.component';
import { referralProgramFactory } from '#libs/referral/factories/ReferralProgram';

const referralProgram = referralProgramFactory();

export default {
  title: 'Member/MemberMarketplaceReferralPanel',
  component: MemberMarketplaceReferralPanel,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This panel appears on the member profile of the marketplace to inform members about the referral program and give them their referral link.',
      },
    },
  },
} as ComponentMeta<typeof MemberMarketplaceReferralPanel>;

const Template: ComponentStory<typeof MemberMarketplaceReferralPanel> = (
  args,
) => (
  <MemberMarketplaceReferralPanel
    referralProgram={referralProgram}
    isLoading={false}
    {...args}
  />
);

export const MemberMarketplaceReferralPanelDefault = Template.bind({});
MemberMarketplaceReferralPanelDefault.args = {
  label: 'MemberMarketplaceReferralPanelDefault',
  nbRemainingReferralUses: 1,
};

export const MemberMarketplaceReferralPanelNoRemainingUses = Template.bind({});
MemberMarketplaceReferralPanelNoRemainingUses.args = {
  label: 'MemberMarketplaceReferralPanelNoRemainingUses',
  nbRemainingReferralUses: 0,
};
