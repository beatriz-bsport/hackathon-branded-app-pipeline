// @flow

import { Moment } from 'bsport-saas/src/i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withProps,
  withState,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { MarketplaceCalendarForWidget } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

import {
  resetOffersAction,
  fetchCompanyOffersAction,
} from 'bsport-saas/src/libs/marketplace/actions';

import {
  getOffersFiltered,
  isOfferLoading,
} from 'bsport-saas/src/libs/marketplace/selectors';

type Props = {
  companyId: number,
  store: any,
  location: Object,
};
type State = {
  filtersOpen: boolean,
};
export default class CalendarWidget extends Component<Props, State> {
  render() {
    console.log('bsport-widget', this.props);
    return <MarketplaceCalendar {...this.props} />;
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

const fromPropsToNewDateURL = (date, location) => {
  const params = location.search.slice(1).split('&');
  const filtered_params = params.filter((p) => !p.includes('date='));
  const newDate = Moment(date);
  return `${location.pathname}?${filtered_params.join(
    '&',
  )}&date=${newDate.format('YYYY-MM-DD')}`;
};

const fromPropsToURL = (filters: *, currentParams: string) => {
  // Rebuild the url parameters, keeping the old ones unrelated to filters

  // first we build our parameters based on provided filters
  const urlParamsArray = [];
  for (const filter_name in filters) {
    // eslint-disable-next-line
    if (filters.hasOwnProperty(filter_name)) {
      const filter_content = filters[filter_name];
      if (filter_content) {
        urlParamsArray.push(`f_${filter_name}=[${filter_content}]`);
      }
    }
  }
};

const fromURLtoDate = (search: string) => {
  try {
    const params = search.slice(1).split('&');
    const date_string = params.find((p) => p.includes('date='));
    return Moment(date_string.split('=')[1]);
  } catch (err) {
    return Moment();
  }
};

const MarketplaceCalendar = compose(
  withProps(() => ({
    location: window.location,
    history: window.history,
  })),
  withProps(({ location }) => ({
    filters: readFiltersFromURL(location.search),
  })),
  connect(
    (state, { filters }) => ({
      offers: getOffersFiltered(state, filters),
      loading: isOfferLoading(state),
      coaches: state.marketplacev2.coaches.items,
      establishments: state.marketplacev2.establishments.items,
      metaActivities: state.marketplacev2.metaActivities.items,
    }),
    {
      resetOffers: resetOffersAction,
      fetchCompanyOffers: fetchCompanyOffersAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      goToBookOption: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      onCompletePurchase: (dispatch) => {
        dispatch(push('/'));
        dispatch(snackbarSuccess('booking.success'));
      },
    },
  ),
  withProps(({ location, fetchCompanyOffers, companyId }) => ({
    handleDateChange: (newDate_: Object) => {
      const strDate = newDate_ ? newDate_.format('YYYY-MM-DD') : Moment();
      const newDate = Moment(strDate, 'YYYY-MM-DD');
      const pathname = fromPropsToNewDateURL(newDate, location);
      const oldDate = fromURLtoDate(location.search);

      // the condition mean simply the month has been changed
      if (!oldDate || newDate.month() !== oldDate.month()) {
        const min_date = newDate.startOf('month').format('YYYY-MM-DD');
        const max_date = newDate.endOf('month').format('YYYY-MM-DD');
        fetchCompanyOffers(companyId, min_date, max_date);
      }
      window.history.pushState({}, null, pathname);
    },
  })),
  withProps(({ location }) => ({
    selectedDate: fromURLtoDate(location.search),
  })),
  withProps(
    ({ filters, location, history, selectedDate, handleDateChange }) => ({
      setFilters: () => {
        const urlParams = fromPropsToURL(filters, location.search);
        history.pushState({}, null, location.pathname + urlParams);
      },
      onSelectDate: (newDate: Object) => {
        handleDateChange(newDate, selectedDate);
      },
    }),
  ),
)(MarketplaceCalendarForWidget);
