import React from 'react';
import { paymentPackListFactory } from '#src/libs/payment-packs/factory';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { ListForStorybook, Props } from '#src/components/css-only/Search/List';

const paymentPacks = paymentPackListFactory(10);

const CustomTemplate = (args: Props) => {
  // @ts-expect-error
  return <ListForStorybook {...args} />;
};

export const PaymentPackList = CustomTemplate.bind({});
PaymentPackList.args = {
  items: paymentPacks,
  renderItem: (item: Partial<PaymentPack>) => <li>- {item.name}</li>,
};

export default {
  title: 'Components/CssOnly/Search/List',
  component: ListForStorybook,
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
