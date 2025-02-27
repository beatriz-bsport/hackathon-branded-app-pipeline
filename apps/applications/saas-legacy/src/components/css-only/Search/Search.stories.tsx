import React from 'react';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { Props, SearchForStorybook } from '#src/components/css-only/Search';
import ClickableItem from '#src/components/css-only/ClickableItem';
import { contractListFactory } from '#src/libs/subscription/factory';
import { useMarketplaceSearchContractData } from './hooks';
import { BaseAdditionalData, SearchItemData } from './Search.component';
import { ComponentStory } from '@storybook/react';

const contractList = contractListFactory(10);

/**
 * Fix "rendered more hooks than during previous render" in storybook preview
 */
const CustomTemplateComponent = (args: Props) => {
  const { contractItems } = useMarketplaceSearchContractData({
    contractList,
    actionIcon: <ShoppingCartIcon className="bs-search__item__icon" />,
    isExcludingTax: false,
    showContractDetail: () => {},
    addContractToBasket: () => {},
  });

  return (
    <SearchForStorybook
      {...args}
      // @ts-expect-error src/components/css-only/Search/Search.stories.tsx:18
      data={contractItems}
      renderItem={(item: SearchItemData<BaseAdditionalData>) => (
        <ClickableItem {...item.additionalData} />
      )}
    />
  );
};

const CustomTemplate: ComponentStory<typeof CustomTemplateComponent> = (
  args: Props,
) => {
  return <CustomTemplateComponent {...args} />;
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

export const SubscriptionsSearch = CustomTemplate.bind({});
