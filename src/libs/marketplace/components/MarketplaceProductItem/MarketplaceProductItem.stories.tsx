import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import ProductItem from '.';
import { MarketplaceProductItemForStoryBook } from '.';
import type { Props } from '.';

export default {
  title: 'Components/Marketplace/ProductItem',
  component: ProductItem,
  args: {
    quantity: 2,
    name: 'Gaiam Yoga Knee Pads',
    price: 30,
    tax: 21,
    isExcludingTax: false,
    isFirstItemInList: false,
    isLastItemInList: false,
    isUniqueItemInList: false,
  },
} as Meta<typeof MarketplaceProductItemForStoryBook>;

const Template: ComponentStory<typeof ProductItem> = (args: Props) => (
  // @ts-expect-error
  <MarketplaceProductItemForStoryBook {...args} />
);

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
