import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReferralMemberSumup from './ReferralMemberSumup.component';
import { referralProgramFactory } from '#src/libs/referral/factories/ReferralProgram';

const referralProgram = referralProgramFactory();

export default {
  title: 'Member/ReferralMemberSumup',
  component: ReferralMemberSumup,
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
} as ComponentMeta<typeof ReferralMemberSumup>;

const Template: ComponentStory<typeof ReferralMemberSumup> = (args) => (
  <ReferralMemberSumup
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
