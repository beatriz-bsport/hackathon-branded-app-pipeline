import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import VoucherCodesDialog from './VoucherCodesDialog.component';
import {
  CouponKind,
  UniqueCodeStateStatus,
} from '@bsport/common/master-data/coupon.js';
import { Coupon } from '#src/libs/coupon/types';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Library/Coupon/VoucherCodesDialog',
  component: VoucherCodesDialog,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof VoucherCodesDialog>;

const actionsData = {
  onClick: action('onClick'),
  onclose: action('onClose'),
};

const availableUniqueCodes = {
  '12341': { status: UniqueCodeStateStatus.AVAILABLE },
  '12342': { status: UniqueCodeStateStatus.REDEEMED },
  '12343': { status: UniqueCodeStateStatus.USED },
  '12344': { status: UniqueCodeStateStatus.AVAILABLE },
  '12345': { status: UniqueCodeStateStatus.REDEEMED },
  '12346': { status: UniqueCodeStateStatus.USED },
  '12347': { status: UniqueCodeStateStatus.AVAILABLE },
  '12348': { status: UniqueCodeStateStatus.REDEEMED },
  '12349': { status: UniqueCodeStateStatus.USED },
  '12350': { status: UniqueCodeStateStatus.AVAILABLE },
  '12351': { status: UniqueCodeStateStatus.REDEEMED },
  '12352': { status: UniqueCodeStateStatus.USED },
  '12353': { status: UniqueCodeStateStatus.AVAILABLE },
  '12354': { status: UniqueCodeStateStatus.REDEEMED },
  '12355': { status: UniqueCodeStateStatus.USED },
  '12356': { status: UniqueCodeStateStatus.USED },
  '12357': { status: UniqueCodeStateStatus.USED },
  '12358': { status: UniqueCodeStateStatus.USED },
  '12359': { status: UniqueCodeStateStatus.USED },
  '1235': { status: UniqueCodeStateStatus.USED },
  '1231': { status: UniqueCodeStateStatus.USED },
  '1232': { status: UniqueCodeStateStatus.USED },
  '12365': { status: UniqueCodeStateStatus.USED },
};

const fakeCoupon: Coupon = {
  id: 1,
  available: true,
  company: 1,
  percent_off: 100,
  amount_off: 100,
  whitelist_tags: [],
  blacklist_tags: [],
  combinable: false,
  voucher_type: 1,
  only_on_first_checkout: false,
  whitelist_members: [],
  discounts: [],
  usage_per_member: 1,
  usage_total: 0,
  expiration_date: '16/03/1990',
  is_active: true,
  minimum_amount: 1,
  name: 'Fake coupon',
  subscription_mode: 1,
  coupon_template_instance: {
    id: 1,
    disabled: true,
    company: 1,
    coupon: 1,
    coupon_template: 1,
  },
  coupon_type: CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE,
  available_unique_codes: availableUniqueCodes,
  coupon_cost_for_company: 100,
  nb_unique_codes: Object.keys(availableUniqueCodes).length,
  nb_discounts: 0,
};

const Template: ComponentStory<typeof VoucherCodesDialog> = (args) => (
  <VoucherCodesDialog {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  uniqueCodeCoupon: fakeCoupon,
  isOpen: true,
  onclose: actionsData.onclose,
  isLoading: false,
  markCodeAsRedeemed: () => {},
  exportAsCsv: () => {},
};
