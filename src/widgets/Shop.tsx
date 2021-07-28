import React, { Component } from 'react';
import { Theme } from '@material-ui/core';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplaceShopBase } from 'bsport-saas/src/pages/marketplace/MarketplaceShop.page';
import { getEnv } from '../utils/utils';

const MarketplaceShopStyled = themify(MarketplaceShopBase);

type OwnProps = {
  companyId: number,
  config: any,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps;

class PassWidget extends Component<Props> {
  addToCart = (shopItemId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/shop-item/${shopItemId}?membership=${this.props.companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { companyId, store, theme } = this.props;
    return (
      <MarketplaceShopStyled
        companyId={companyId}
        theme={theme}
        store={store}
        onAddToCart={this.addToCart}
      />
    );
  }
}

export default PassWidget;
