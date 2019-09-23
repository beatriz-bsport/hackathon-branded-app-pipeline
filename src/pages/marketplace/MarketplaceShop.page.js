// @flow

import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import MarketplaceShopComponent from '../../libs/marketplace/components/MarketplaceShop.component';

import { fetchAllSubShop } from '../../libs/shop/actions/subshop';
import { fetchAll as fetchAllShopItem } from '../../libs/shop/actions/shopitem';
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import type { SubShop } from '../../libs/shop/types';
import shopSelectors from '../../libs/shop/selectors';

import withTitle from '../../hocs/with-title.hoc';

type Props = {
  subShops: Array<SubShop>,
  currentBasket: Basket,

  toogleCurrentBasketOpen: (boolean) => void,
  authenticated: boolean,
  requestSignUp: () => void,
  addItemToBasket: (shopItemId: number, basketId: string) => void,
};

export function MarketplaceShop(props: Props) {
  return (
    <MarketplaceShopComponent
      subShops={props.subShops}
      addToOrder={(shopItemId) => {
        if (!props.authenticated) {
          props.requestSignUp();
        } else {
          props.addItemToBasket(shopItemId, props.currentBasket.id);
          props.toogleCurrentBasketOpen(true);
        }
      }}
    />
  );
}

export default compose(
  connect(
    (state, { companyId }) => ({
      currentBasket: getCurrentBasket(state),
      subShops: shopSelectors
        .getSubShopsByCompany(state, companyId, true)
        .filter((sub) => sub.shopItems.length),
      authenticated: state.auth.authenticated,
    }),
    {
      fetchShopItems: fetchAllShopItem,
      fetchSubShops: fetchAllSubShop,
      addItemToBasket: (shopItemId, basketId) =>
        addItemToBasket(basketId, {
          buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
          quantity: 1,
          buyable_item_id: shopItemId,
          extra_data: {},
        }),
    },
  ),
  lifecycle({
    componentWillMount() {
      const { fetchShopItems, fetchSubShops, companyId } = this.props;
      fetchShopItems(companyId);
      fetchSubShops(companyId);
    },
  }),
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceShop'),
  ),
)(MarketplaceShop);
