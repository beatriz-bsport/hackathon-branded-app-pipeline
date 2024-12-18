import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MemberReferralPanel from './MemberReferralPanel.component';
import { faker } from '@faker-js/faker';
import { Paper } from '@material-ui/core';

const referralLink = faker.internet.url();
const maxReferralUses = faker.number.int(20);
const nbRemainingReferralUses = faker.number.int(maxReferralUses);

export default {
  title: 'Member/Referral/MemberReferralPanel',
  component: MemberReferralPanel,
  args: {
    referralLink: referralLink,
    nbRemainingReferralUses: nbRemainingReferralUses,
    maxReferralUses: maxReferralUses,
  },
  argTypes: {},
  parameters: {
    docs: {
      page: null,
      description:
        'This panel displays the referral link of a member and its number of remaining uses. It appears in the member profile page of the backoffice.',
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof MemberReferralPanel>;

const Template: ComponentStory<typeof MemberReferralPanel> = (args) => (
  <Paper>
    <MemberReferralPanel {...args} />
  </Paper>
);

export const MemberReferralPanelDefault = Template.bind({});
MemberReferralPanelDefault.args = {};
