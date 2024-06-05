import React from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { paymentPackListFactory } from '#libs/payment-packs/factory';
import { privatePassListFactory } from '#libs/private-service/factory';
import { paymentComboListFactory } from '#libs/payment-combo/factory';
import { contractListFactory } from '#libs/subscription/factory';
import ClickableItem from '../ClickableItem';
import { BaseAdditionalData, SearchItemData } from './Search.component';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import SearchCss from './style.css?raw';
import Search, { Props as SearchProps } from '.';
import {
  useMarketplaceSearchPaymentComboData,
  useMarketplaceSearchPaymentPackData,
  useMarketplaceSearchPrivatePassData,
  useMarketplaceSearchContractData,
} from './hooks';

const paymentPackList = paymentPackListFactory(10);
const paymentComboList = paymentComboListFactory(10);
const privatePassList = privatePassListFactory(10);
const contractList = contractListFactory(10);

const actionIcon = <ShoppingCartIcon className="bs-search__item__icon" />;

const usePropsFromVariation = (): Omit<SearchProps, 'data'> => {
  return {
    renderItem: (item: SearchItemData<BaseAdditionalData>) => (
      <ClickableItem {...item.additionalData} />
    ),
    onClearInput: () => {},
  };
};

export const MARKETPLACE_SEARCH_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.MARKETPLACE_SEARCH,
  css: SearchCss,
  pages: [MarketplacePage.COMMON],
  defaultState: {},
  variations: [],
};

export const MARKETPLACE_SEARCH_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme }) => {
  const componentProps = { ...usePropsFromVariation() };

  const { paymentPackItems } = useMarketplaceSearchPaymentPackData({
    paymentPackList,
    actionIcon,
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    showPaymentPackDetail: () => {},
    addPaymentPackToBasket: () => {},
  });

  const { privatePassItems } = useMarketplaceSearchPrivatePassData({
    privatePassList,
    actionIcon,
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    showPrivatePassDetail: () => {},
    addPrivatePassToBasket: () => {},
  });

  const { paymentComboItems } = useMarketplaceSearchPaymentComboData({
    paymentComboList,
    actionIcon,
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    showPaymentComboDetail: () => {},
    addPaymentComboToBasket: () => {},
  });

  const { contractItems } = useMarketplaceSearchContractData({
    contractList,
    actionIcon,
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    showContractDetail: () => {},
    addContractToBasket: () => {},
  });

  const data = [
    ...paymentPackItems,
    ...privatePassItems,
    ...paymentComboItems,
    ...contractItems,
  ];

  return <Search data={data} {...componentProps} />;
});
