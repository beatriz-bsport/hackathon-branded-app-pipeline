import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import QuicksaleBasketPanel from './QuicksaleBasketPanel.component';
import { basketFactory } from '#src/libs/checkout/factories';
import { MemberFactory } from '#src/libs/member/factories/Member';

const actionData = {
  addToBasket: action('addToBasket'),
  removeFromBasket: action('removeFromBasket'),
  openChangePriceModal: action('openChangePriceModal'),
  openChangeMemberModal: action('openChangeMemberModal'),
  closeBasket: action('closeBasket'),
};

export default {
  title: 'Components/Quicksale/QuicksaleBasketPanel',
  component: QuicksaleBasketPanel,
  argTypes: {
    addToBasket: actionData.addToBasket,
    removeFromBasket: actionData.removeFromBasket,
    openChangePriceModal: actionData.openChangePriceModal,
    openChangeMemberModal: actionData.openChangeMemberModal,
    closeBasket: actionData.closeBasket,
  },
} as ComponentMeta<typeof QuicksaleBasketPanel>;

const Template: ComponentStory<typeof QuicksaleBasketPanel> = (args) => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: 400, height: '70vh' }}>
      <QuicksaleBasketPanel {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  basket: basketFactory(10),
  member: MemberFactory({}),
  isExcludingTax: false,
  canChangeMember: true,
};
