import React from 'react';

import { paymentPackListFactory } from '#libs/payment-packs/factory';
import { paymentComboListFactory } from '#libs/payment-combo/factory';
import { privatePassListFactory } from '#libs/private-service/factory';
import { PassSearchForStorybook, Props } from './index';

const CustomTemplate = (args: Props) => {
  return (
    <PassSearchForStorybook
      {...args}
      //@ts-expect-error
      showPaymentPackDetail={() => {}}
      addPaymentPackToBasket={() => {}}
      showPrivatePassDetail={() => {}}
      addPrivatePassToBasket={() => {}}
      showPaymentComboDetail={() => {}}
      addPaymentComboToBasket={() => {}}
    />
  );
};

export const PassesSearch = CustomTemplate.bind({});
PassesSearch.args = {
  paymentPackList: paymentPackListFactory(5),
  privatePassList: privatePassListFactory(5),
  paymentComboList: paymentComboListFactory(5),
};

export default {
  title: 'Components/CssOnly/PassSearch',
  component: PassSearchForStorybook,
  argTypes: {
    showPaymentPackDetail: { action: 'showPaymentPackDetail' },
    addPaymentPackToBasket: { actions: 'addPaymentPackToBasket' },

    showPrivatePassDetail: { action: 'showPrivatePassDetail' },
    addPrivatePassToBasket: { actions: 'addPrivatePassToBasket' },

    showPaymentComboDetail: { action: 'showPaymentComboDetail' },
    addPaymentComboToBasket: { actions: 'addPaymentComboToBasket' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
