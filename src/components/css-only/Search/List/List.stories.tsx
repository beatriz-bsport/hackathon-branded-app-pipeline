// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import ClickableItem, { Props } from '#components/css-only/ClickableItem';
import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';
import { PaymentPack } from '#libs/payment-packs/types';
import List from '#components/css-only/Search/List';

const paymentPacks: Partial<PaymentPack>[] =
  PaymentPackStorybookListFactory(10);

const CustomTemplate = (args: Props) => {
  return <List {...args} />;
};

export const PaymentPackList = CustomTemplate.bind({});
PaymentPackList.args = {
  items: paymentPacks,
  renderItem: (item: Partial<PaymentPack>) => <li>- {item.name}</li>,
};

export default {
  title: 'Components/CssOnly/Search/List',
  component: ClickableItem,
  argTypes: {
    onClick: { action: 'onClick' },
    onActionClick: { actions: 'onActionClick' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
