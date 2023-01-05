import React from 'react';

import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';
import { PaymentComboStorybookListFactory } from '#libs/payment-combo/factory';
import { private_services_passes_factory } from '#libs/private-service/factory';
import PassSearch, { Props } from './index';

const CustomTemplate = (args: Props) => {
  return (
    <PassSearch
      {...args}
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
  paymentPackList: PaymentPackStorybookListFactory(5),
  privatePassList: private_services_passes_factory(5),
  paymentComboList: PaymentComboStorybookListFactory(5),
};

export default {
  title: 'Components/CssOnly/PassSearch',
  component: PassSearch,
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
