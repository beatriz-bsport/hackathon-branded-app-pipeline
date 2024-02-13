import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import MarketplaceProductItemList, {
  MarketplaceProductItemListForStorybook,
  type Props,
} from '.';
import { checkoutItemsFactory } from '#libs/checkout/factories';
import { BuyableItemOptions } from '#libs/checkout/types';

const checkoutPassItems = checkoutItemsFactory(3);
const checkoutPrivatePassItems = checkoutItemsFactory(3, {
  buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS,
});
const checkoutShopItems = checkoutItemsFactory(4, {
  buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM,
});

export default {
  title: 'Components/Marketplace/ProductItemList',
  component: MarketplaceProductItemList,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof MarketplaceProductItemListForStorybook>;

const Template: ComponentStory<typeof MarketplaceProductItemList> = (
  args: Props,
) => (
  // @ts-expect-error
  <MarketplaceProductItemListForStorybook {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  title: 'My passes',
  items: checkoutPassItems,
};

export const ListOfPasses = Template.bind({});
ListOfPasses.args = {
  title: 'My passes',
  items: checkoutPassItems,
};

export const ListOfPrivatePasses = Template.bind({});
ListOfPrivatePasses.args = {
  title: 'My passes',
  items: checkoutPrivatePassItems,
};

export const ListOfShopItems = Template.bind({});
ListOfShopItems.args = {
  title: 'My products',
  items: checkoutShopItems,
};
