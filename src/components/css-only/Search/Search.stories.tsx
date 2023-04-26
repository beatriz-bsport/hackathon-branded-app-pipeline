// @ts-nocheck
import React from 'react';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { Props, SearchForStorybook } from '#components/css-only/Search';
import ClickableItem from '#components/css-only/ClickableItem';
import { ContractStorybookListFactory } from '#libs/subscription/factory';
import { Contract } from '#libs/subscription/types';
import { useMarketplaceSearchContractData } from './hooks';
import { BaseAdditionalData, SearchItemData } from './Search.component';

const contractList: Partial<Contract>[] = ContractStorybookListFactory(10);

/**
 * Fix "rendered more hooks than during previous render" in storybook preview
 */
const CustomTemplateComponent = (args: Props) => {
  const { contractItems } = useMarketplaceSearchContractData({
    contractList,
    actionIcon: <ShoppingCartIcon className="bs-search__item__icon" />,
    showContractDetail: () => {},
    addContractToBasket: () => {},
  });

  return (
    <SearchForStorybook
      data={contractItems}
      renderItem={(item: SearchItemData<BaseAdditionalData>) => (
        <ClickableItem {...item.additionalData} />
      )}
      {...args}
    />
  );
};

const CustomTemplate = (args: Props) => {
  return <CustomTemplateComponent {...args} />;
};

export const SubscriptionsSearch = CustomTemplate.bind({});
SubscriptionsSearch.args = {
  contractList,
  showContractDetail: () => {},
  addContractToBasket: () => {},
};

export default {
  title: 'Components/CssOnly/Search',
  component: SearchForStorybook,
  argTypes: {
    showContractDetail: { action: 'showContractDetail' },
    addContractToBasket: { actions: 'addContractToBasket' },
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      page: null,
    },
  },
};
