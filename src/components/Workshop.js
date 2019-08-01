// @flow
import React, { Component } from 'react';
import MarketplaceWorkshopPage from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
class ShopWidget extends Component<Props> {
  render() {
    const { companyId, store, location } = this.props;
    return (
      <MarketplaceWorkshopPage
        companyId={companyId}
        location={location}
        store={store}
      />
    );
  }
}

export default ShopWidget;
