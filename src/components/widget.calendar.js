// @flow
import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { MarketplaceCalendarWidget } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
class CalendarWidget extends Component<Props> {
  render() {
    return <MarketplaceCalendarWidget {...this.props} />;
  }
}

const readFiltersFromURL = (search) => {
  // URL parameters starting with f_ are considered as ID filters for
  // offers, we parse ?f_levels=[1,2] to replace with { levels: [1,2] }
  try {
    const params = search.slice(1).split('&');
    const filters = params
      .map((param) => param.split('='))
      .filter((param) => param[0].includes('f_'))
      .map((param) => [param[0].split('f_')[1], JSON.parse(param[1])]);
    return filters.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
  } catch (err) {
    return {};
  }
};

const urlParams = new URLSearchParams(window.location.search).toString();

export default compose(
  withProps(({ urlParams }) => ({
    filters: readFiltersFromURL(location.search),
    filtersOpen: location.search.includes('filtersOpen=true'),
  })),
)(CalendarWidget);
