import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import ProductItem from '.';
import { MarketplaceBasketSummaryItemCssOnlyForStoryBook } from '.';
import type { Props } from '.';
import { checkoutItemFactory } from '#libs/checkout/factories';
import './styles.storybook.css';

const checkoutItem = checkoutItemFactory();
export default {
  title: 'Components/Marketplace/MarketplaceBasketSummaryItemCssOnly',
  component: ProductItem,
  args: {
    checkoutItem: checkoutItem,
    isItemEditionDisabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MarketplaceBasketSummaryItemCssOnlyForStoryBook>;

const Template: ComponentStory<typeof ProductItem> = (args: Props) => (
  //@ts-expect-error
  <MarketplaceBasketSummaryItemCssOnlyForStoryBook {...args} />
);

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isItemEditionDisabled: true,
};
