// @flow
import React, { Component } from 'react';
import MarketplacePassPage from 'bsport-saas/src/pages/marketplace/MarketplacePass.page';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
class CalendarWidget extends Component<Props> {
  render() {
    const { companyId, store, location } = this.props;
    return (
      <MarketplacePassPage
        companyId={companyId}
        store={store}
        location={location}
      />
    );
  }
}

export default CalendarWidget;
