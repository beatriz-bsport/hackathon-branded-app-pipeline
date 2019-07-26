// @flow
import React, { Component } from 'react';
import { MarketplaceCalendarWidget } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
class CalendarWidget extends Component<Props> {
  render() {
    const { companyId, store, location } = this.props;
    return (
      <MarketplaceCalendarWidget
        companyId={companyId}
        location={location}
        store={store}
      />
    );
  }
}

export default CalendarWidget;
