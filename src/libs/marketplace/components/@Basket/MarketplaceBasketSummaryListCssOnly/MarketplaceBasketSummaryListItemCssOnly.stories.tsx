import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import ProductItem from '.';
import { MarketplaceBasketSummaryListCssOnlyForStoryBook } from '.';
import type { Props } from '.';
import { checkoutItemsFactory } from '#libs/checkout/factories';

const checkoutItems = checkoutItemsFactory(4);
export default {
  title: 'Components/Marketplace/MarketplaceBasketSummaryListCssOnly',
  component: ProductItem,
  args: {
    checkoutItems: checkoutItems,
    isItemEditionDisabled: false,
    isExcludingTax: false,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MarketplaceBasketSummaryListCssOnlyForStoryBook>;

const Template: ComponentStory<typeof ProductItem> = (args: Props) => (
  //@ts-expect-error
  <MarketplaceBasketSummaryListCssOnlyForStoryBook {...args} />
);

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isItemEditionDisabled: true,
};
