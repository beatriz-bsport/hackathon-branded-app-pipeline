import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import VoucherCodesTable, { type Props } from '../VoucherCodesTable.component';
import { UniqueCodeStateStatus } from '@bsport/common/lib/master-data/coupon.js';

export default {
  title: 'Library/Coupon/VoucherCodesTable',
  component: VoucherCodesTable,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof VoucherCodesTable>;

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
};

const codes = Object.keys(availableUniqueCodes);

const Template: ComponentStory<typeof VoucherCodesTable> = (args: Props) => {
  const [displayedCodes, setDisplayedCodes] = useState([]);
  const [selectedVoucherCodes, setSelectedVoucherCodes] = useState([]);
  return (
    <VoucherCodesTable
      {...args}
      displayedCodes={displayedCodes}
      setDisplayedCodes={setDisplayedCodes}
      selectedVoucherCodes={selectedVoucherCodes}
      setSelectedVoucherCodes={setSelectedVoucherCodes}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  availableUniqueCodes: availableUniqueCodes,
  allCodes: codes,
};
