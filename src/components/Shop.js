// @flow
import React, { Component } from 'react';
import MarketplaceShopPage from 'bsport-saas/src/pages/marketplace/MarketplaceShop.page';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
class PassWidget extends Component<Props> {
  render() {
    const { companyId, store, location } = this.props;
    return (
      <MarketplaceShopPage
        companyId={companyId}
        store={store}
        location={location}
      />
    );
  }
}

export default PassWidget;
