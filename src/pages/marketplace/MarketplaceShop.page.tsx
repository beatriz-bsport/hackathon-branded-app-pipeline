import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import MarketplaceShopComponent from '../../libs/marketplace/components/MarketplaceShop.component';

import { fetchAllSubShop } from '../../libs/shop/actions/subshop';
import { fetchShopItemAsConsumer } from '../../libs/shop/actions/shopitem';
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import shopSelectors from '../../libs/shop/selectors';

import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';

type OwnProps = {
  companyId: number;
  toogleCurrentBasketOpen: (v: boolean) => void;
  requestSignUp: () => void;
  onAddToCart?: (shopItemId: number) => void;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export class MarketplaceShop extends React.PureComponent<Props> {
  addToCart = (shopItemId: number) => {
    if (this.props.onAddToCart) {
      this.props.onAddToCart(shopItemId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.requestSignUp();
    } else {
      this.props.addItemToBasket(shopItemId, this.props.currentBasket.id);
      this.props.toogleCurrentBasketOpen(true);
    }
  };

  render() {
    return (
      <MarketplaceShopComponent
        subShops={this.props.subShops}
        addToOrder={this.addToCart}
      />
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { companyId }: { companyId: string },
) => ({
  currentBasket: getCurrentBasket(state),
  subShops: shopSelectors
    .getSubShopsByCompany(state, companyId, true)
    .filter((sub: any) => sub.shopItems.length),
  authenticated: state.auth.authenticated,
});

const mapDispatchToProps = {
  fetchShopItems: fetchShopItemAsConsumer,
  fetchSubShops: fetchAllSubShop,
  addItemToBasket: (shopItemId: number, basketId: number) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
      quantity: 1,
      buyable_item_id: shopItemId,
      extra_data: {},
    }),
  push,
};

export const MarketplaceShopBase = compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      const { fetchShopItems, fetchSubShops, companyId } = this.props as any;
      fetchShopItems(companyId);
      fetchSubShops(companyId);
    },
  }),
  withTranslation(),
)(MarketplaceShop);

export default compose<any, OwnProps>(
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceShop'),
  ),
)(MarketplaceShopBase);
