import React from 'react';

import { ContractSearchForStorybook, Props } from './index';
import { contractListFactory } from '#libs/subscription/factory';

const CustomTemplate = (args: Props) => {
  // @ts-expect-error
  return <ContractSearchForStorybook {...args} />;
};

export const ContractsSearch = CustomTemplate.bind({});
ContractsSearch.args = {
  contractList: contractListFactory(10),
  isExcludingTax: false,
  onPressEnter: () => {},
  onClearInput: () => {},
  showContractDetail: () => {},
  addContractToBasket: () => {},
};

export default {
  title: 'Components/CssOnly/ContractSearch',
  component: ContractSearchForStorybook,
  argTypes: {
    onPressEnter: { action: 'onPressEnter' },
    onClearInput: { actions: 'onClearInput' },
    showContractDetail: { action: 'showContractDetail' },
    addContractToBasket: { actions: 'addContractToBasket' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
