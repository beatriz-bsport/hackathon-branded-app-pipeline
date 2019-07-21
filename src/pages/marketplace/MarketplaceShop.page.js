// @flow

import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-models';
import MarketplaceShopComponent from '../../libs/marketplace/components/MarketplaceShop.component';

import { fetchAllSubShop } from '../../libs/shop/actions/subshop';
import { fetchAll as fetchAllShopItem } from '../../libs/shop/actions/shopitem';
import { addProductToOrder as addProductToOrderAction } from '../../libs/order/actions';
import type { Order, ProductData } from '../../libs/order/types';
import type { SubShop } from '../../libs/shop/types';
import shopSelectors from '../../libs/shop/selectors';

const SHOP_ITEM_CONTENTTYPE = SHOP_ITEM.id;

type Props = {
  subShops: Array<SubShop>,
  currentOrder: ?Order,

  addToOrder: (ProductData, orderId: number) => void,
  toogleCurrentOrderOpen: (boolean) => void,
  authenticated: boolean,
  requestSignUp: () => void,
};

const buildProductData = (shopItemId: number): ProductData => ({
  quantity: 1,
  product_type: SHOP_ITEM_CONTENTTYPE,
  product_id: shopItemId,
});

export function MarketplaceShop(props: Props) {
  return (
    <MarketplaceShopComponent
      subShops={props.subShops}
      addToOrder={(shopItemId) => {
        if (!props.authenticated) {
          props.requestSignUp();
        } else {
          props.addToOrder(buildProductData(shopItemId), props.currentOrder.id);
          props.toogleCurrentOrderOpen(true);
        }
      }}
    />
  );
}

export default compose(
  connect(
    (state, { companyId }) => ({
      subShops: shopSelectors
        .getSubShopsByCompany(state, companyId, true)
        .filter((sub) => sub.shopItems.length),
      authenticated: state.auth.authenticated,
    }),
    {
      fetchShopItems: fetchAllShopItem,
      fetchSubShops: fetchAllSubShop,
      addToOrder: addProductToOrderAction,
    },
  ),
  lifecycle({
    componentWillMount() {
      const { fetchShopItems, fetchSubShops, companyId } = this.props;
      fetchShopItems(companyId);
      fetchSubShops(companyId);
    },
  }),
)(MarketplaceShop);
