import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import QuicksaleBasketListBar from './QuicksaleBasketListBar.component';
import { createManyBaskets } from '#libs/checkout/factories';
import { MemberFactory } from '#libs/member/factories/Member';
import type { Member } from '#libs/member/types';
import type { Basket } from '#libs/checkout/types';

const basketList = createManyBaskets(10);
const memberById: { [memberId: number]: Member } = {};
basketList.forEach((basket) => {
  memberById[basket.member] = MemberFactory({}, false, basket.member);
});

const actionData = {
  onBasketAdd: action('onBasketAdd'),
};

export default {
  title: 'Components/Quicksale/QuicksaleBasketListBar',
  component: QuicksaleBasketListBar,
  argTypes: {
    onBasketAdd: actionData.onBasketAdd,
  },
} as ComponentMeta<typeof QuicksaleBasketListBar>;

const Template: ComponentStory<typeof QuicksaleBasketListBar> = (args) => {
  const [selectedBasket, setSelectedBasket] = React.useState<Basket>();
  return (
    <QuicksaleBasketListBar
      {...args}
      selectedBasket={selectedBasket}
      onBasketClick={setSelectedBasket}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  basketList,
  memberById,
};
