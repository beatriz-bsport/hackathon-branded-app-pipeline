import type { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import ShopSupplierTable from '.';

import { shopSupplierListFactory } from '#src/libs/shop/factory';

const fakeSupplierList = shopSupplierListFactory(12);

export default {
  title: 'Library/Shop/ShopSupplierTable',
  component: ShopSupplierTable,
  argTypes: {
    supplierList: {
      description: 'A list of suppliers to display',
      control: 'object',
    },
    handleEditSupplier: {
      description: 'The action fired once the edit button has been clicked',
      action: 'handleEditSupplier',
    },
    handleSelectSupplierForDeletion: {
      description: 'The action fired once the delete button has been clicked',
      action: 'handleSelectSupplierForDeletion',
    },
  },
} as ComponentMeta<typeof ShopSupplierTable>;

const Template: ComponentStory<typeof ShopSupplierTable> = (args) => (
  <ShopSupplierTable {...args} />
);

export const Table = Template.bind({});
Table.args = {
  supplierList: fakeSupplierList,
};
