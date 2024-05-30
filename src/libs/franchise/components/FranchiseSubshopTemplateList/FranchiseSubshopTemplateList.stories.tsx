import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FranchiseSubshopTemplateList from '.';
import { shopItemListFactory, subshopListFactory } from '#libs/shop/factory';
import { ShopItemTemplate, SubshopTemplate } from '#libs/shop/types';
import { ErrorAndLoading } from '#libs/types';
import { PaginatedResponse } from '#src/state/types';
import { SHOP_ITEM_TEMPLATE_PAGE_SIZE } from '#libs/shop/constants';

export default {
  title: 'Libs/Franchise/FranchiseSubshopTemplateList',
  component: FranchiseSubshopTemplateList,
  argTypes: {
    subshopTemplateList: {
      description: 'The list of subshop template to display',
    },
    getShopItemTemplateState: {
      description: 'Data state related to the current subshop template',
      action: 'getShopItemTemplateState',
    },
    fetchShopItemTemplateList: {
      description:
        'Action performed when expanding the shop item list for the first time',
      action: 'fetchShopItemTemplateList',
    },
    handleOpenSubshopTemplateDialog: {
      description:
        'Action performed when clicked on a subshop template menu list item',
      action: 'handleOpenSubshopTemplateDialog',
    },
  },
} as ComponentMeta<typeof FranchiseSubshopTemplateList>;

const Template: ComponentStory<typeof FranchiseSubshopTemplateList> = (
  args,
) => <FranchiseSubshopTemplateList {...args} />;

const SUBSHOP_TEMPLATE_LIST = subshopListFactory(
  faker.number.int({ min: 1, max: 3 }),
  { isFranchise: true },
);

export const Idle = Template.bind({});
Idle.args = {
  subshopTemplateList: SUBSHOP_TEMPLATE_LIST,
  getShopItemTemplateState: (subshopTemplateId: number) => {
    const state = SUBSHOP_TEMPLATE_LIST.reduce<{
      [key: number]: ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
    }>((acc, current: SubshopTemplate) => {
      const SHOPITEM_TEMPLATE_LIST = shopItemListFactory(
        faker.number.int(SHOP_ITEM_TEMPLATE_PAGE_SIZE),
        {
          isFranchise: true,
        },
      );
      return {
        ...acc,
        [current.id]: {
          error: null,
          loading: false,
          links: {
            next: 0,
            previous: 0,
          },
          next_page: 1,
          page: 1,
          count: SHOPITEM_TEMPLATE_LIST.length,
          results: SHOPITEM_TEMPLATE_LIST,
        },
      };
    }, {});
    return state[subshopTemplateId];
  },
};
