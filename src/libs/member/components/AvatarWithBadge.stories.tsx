import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import AvatarWithBadge from './AvatarWithBadge.component';
import { MemberFactory } from '#libs/member/factories/Member';
import '#libs/member/components/TagBadge/TagBadge.css';

const CustomTemplate: ComponentStory<typeof AvatarWithBadge> = (
  args: React.ComponentProps<typeof AvatarWithBadge>,
) => <AvatarWithBadge {...args} />;

//15 Badges, `total_unpaid_amount` > `credit` > 0
export const MoreUnpaidInvoicesThanBalance = CustomTemplate.bind({});

MoreUnpaidInvoicesThanBalance.args = {
  member: MemberFactory({
    credit_account_balance: 20,
    total_unpaid_amount: '30',
    number_tags: 15,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

//15 Badges, `credit` > `total_unpaid_amount`>0

export const PositiveBalanceAndUnpaidInvoices = CustomTemplate.bind({});

PositiveBalanceAndUnpaidInvoices.args = {
  member: MemberFactory({
    credit_account_balance: 30,
    total_unpaid_amount: '20',
    number_tags: 15,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

//2 Badges, `credit` > 0, `total_unpaid_amount`=0

export const PositiveBalance = CustomTemplate.bind({});

PositiveBalance.args = {
  member: MemberFactory({
    credit_account_balance: 20,
    total_unpaid_amount: '0',
    number_tags: 2,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

//0 Badge, `credit` = 0, `total_unpaid_amount`>0

export const UnpaidInvoices = CustomTemplate.bind({});

UnpaidInvoices.args = {
  member: MemberFactory({
    credit_account_balance: 0,
    total_unpaid_amount: '20',
    number_tags: 0,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

//1 Badge, `credit` = `total_unpaid_amount` = 0

export const NoBalanceOrUnpaidInvoices = CustomTemplate.bind({});

NoBalanceOrUnpaidInvoices.args = {
  member: MemberFactory({
    credit_account_balance: 0,
    total_unpaid_amount: '0',
    number_tags: 0,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

export const NegativeBalance = CustomTemplate.bind({});

NegativeBalance.args = {
  member: MemberFactory({
    credit_account_balance: -20,
    total_unpaid_amount: '0',
    number_tags: 0,
  }),
  classes: { badge: 'currencyBadge' },
  bottomCredit: true,
};

export default {
  title: 'Library/Member/AvatarWithBadge',
  component: AvatarWithBadge,
  parameters: {
    docs: {
      page: null,
      inlineStories: true,
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof AvatarWithBadge>;
