import React from 'react';
import { compose, lifecycle } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
// @ts-expect-error
import MarketplaceShopComponent from '#src/libs/marketplace/components/MarketplaceShop.component';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { fetchAllSubShop } from '#src/libs/shop/actions/subshop';
import { fetchShopItemAsConsumer } from '#src/libs/shop/actions/shopitem';
import { addItemToBasket } from '#src/libs/checkout/actions';
import { getCurrentBasket } from '#src/libs/checkout/selectors';
import shopSelectors from '#src/libs/shop/selectors';

import themeSelectors from '#src/libs/theme/selectors';
import withTitle from '#src/hocs/with-title.hoc';
import { RootState } from '../../reducers';

type OwnProps = {
  companyId: number;
  toggleCurrentBasketOpen?: (v: boolean) => void;
  requestSignUp?: () => void;
  onAddToCart?: (shopItemId: number) => void;
  store?: any;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

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
      this.props.toggleCurrentBasketOpen(true);
    }
  };

  render() {
    return (
      <MarketplaceShopComponent
        addToOrder={this.addToCart}
        isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
        subShops={this.props.subShops}
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
    .getSubShopsByCompany(state, parseInt(companyId), true)
    .filter((sub: any) => sub.shopItems.length),
  authenticated: state.auth.authenticated,
  theme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  fetchShopItems: fetchShopItemAsConsumer,
  fetchSubShops: fetchAllSubShop,
  addItemToBasket: (shopItemId: number, basketId: string) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
      quantity: 1,
      buyable_item_id: shopItemId,
      extra_data: {},
    }),
  push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const MarketplaceShopBase = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  connector,
  lifecycle({
    UNSAFE_componentWillMount() {
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
