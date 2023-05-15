// @ts-nocheck
import React from 'react';

import { Props, SelectForStorybook } from '#components/css-only/Select';
import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';

const options: { label: string; value: string }[] =
  PaymentPackStorybookListFactory(20).map((paymentPack) => ({
    label: paymentPack.name,
    value: paymentPack.id.toString(),
  }));

const CustomTemplate = (args: Props) => <SelectForStorybook {...args} />;

export const IdleSelect = CustomTemplate.bind({});
IdleSelect.args = {
  placeholder: 'Select your pass',
  options,
  value: null,
  onChange: () => {},
};

export const SelectWithValue = CustomTemplate.bind({});
SelectWithValue.args = {
  placeholder: 'Select your pass',
  options,
  isClearable: true,
  value: '1',
  onChange: () => {},
};

export default {
  title: 'Components/CssOnly/Select',
  component: SelectForStorybook,
  argTypes: {
    onChange: { action: 'onChange' },
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      page: null,
    },
  },
};
