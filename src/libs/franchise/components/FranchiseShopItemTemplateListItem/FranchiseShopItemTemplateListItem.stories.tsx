import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import FranchiseShopItemTemplateListItem from '.';
import FranchiseShopItemTemplateListItemSkeleton from './FranchiseShopItemTemplateListItemSkeleton.component';
import { shopItemFactory } from '#libs/shop/factory';

export default {
  title: 'Library/Franchise/FranchiseShopItemTemplateListItem',
  component: FranchiseShopItemTemplateListItem,
  argTypes: {
    className: {
      description: 'An optional class name for styling purposes',
      control: 'text',
    },
    shopItemTemplate: {
      description: 'The current shop item template to render in the list item',
    },
    handleDelete: {
      description: 'Action triggered when delete button is clicked',
      action: 'handleDelete',
    },
  },
} as ComponentMeta<typeof FranchiseShopItemTemplateListItem>;

const SHOP_ITEM_TEMPLATE = shopItemFactory({ isFranchise: true });

const Template: ComponentStory<typeof FranchiseShopItemTemplateListItem> = (
  args,
) => <FranchiseShopItemTemplateListItem {...args} />;

const LoadingTemplate: ComponentStory<
  typeof FranchiseShopItemTemplateListItemSkeleton
> = () => <FranchiseShopItemTemplateListItemSkeleton />;

export const Idle = Template.bind({});
Idle.args = {
  className: '',
  shopItemTemplate: SHOP_ITEM_TEMPLATE,
};

export const Loading = LoadingTemplate.bind({});
