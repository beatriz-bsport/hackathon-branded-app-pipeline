import React from 'react';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import Search from '#components/css-only/Search';
import ClickableItem from '#components/css-only/ClickableItem';
import { useMarketplaceSearchContractData } from '../hooks';
import { BaseAdditionalData, SearchItemData } from '../Search.component';

import { Contract } from '#libs/subscription/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  contractList: Contract[];
  isExcludingTax: boolean;
  onPressEnter: (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => void;
  onClearInput: () => void;

  showContractDetail: (id: number) => void;
  addContractToBasket: (contract: Contract) => void;
};

export const ContractSearch: React.FC<Props> = ({
  contractList,
  isExcludingTax,
  onPressEnter,
  onClearInput,
  showContractDetail,
  addContractToBasket,
}) => {
  const actionIcon = <ShoppingCartIcon className="bs-search__item__icon" />;

  const { contractItems } = useMarketplaceSearchContractData({
    contractList,
    actionIcon,
    isExcludingTax,
    showContractDetail,
    addContractToBasket,
  });

  return (
    <Search
      data={contractItems}
      onClearInput={onClearInput}
      onPressEnter={onPressEnter}
      renderItem={(item: SearchItemData<BaseAdditionalData>) => (
        <ClickableItem {...item.additionalData} />
      )}
    />
  );
};

export const ContractSearchForStorybook = marketplaceCssHoc()(ContractSearch);

export default React.memo(ContractSearch);
