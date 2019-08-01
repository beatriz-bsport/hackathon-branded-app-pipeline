// @flow

import { Moment } from 'bsport-saas/src/i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { MarketplaceCalendarStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

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
export class CalendarWidget extends Component<Props, State> {
  state = {
    filtersOpen: false,
    filters: {},
    selectedDate: Moment(),
  };

  setFilters = (filters) => {
    this.setState((prevState) => ({
      filters: { ...prevState.filters, ...filters },
    }));
  };

  handleDateChange = (selectedDate) => {
    this.setState({
      selectedDate,
    });
  };

  componentDidMount() {
    const { selectedDate } = this.state;
    this.props.fetchCompanyOffers(
      82,
      selectedDate.format('YYYY-MM-DD'),
      selectedDate.add('months', 1).format('YYYY-MM-DD'),
    );
  }

  render() {
    return (
      <MarketplaceCalendarStyled
        filtersOpen={this.state.filtersOpen}
        filters={this.state.filters}
        setFilters={this.setFilters}
        handleDateChange={this.handleDateChange}
        selectedDate={this.state.selectedDate}
        offers={this.props.getOffersFromFilter(this.state.filters)}
        toogleFiltersOpen={() =>
          this.setState((prevState) => ({
            filtersOpen: !prevState.filtersOpen,
          }))
        }
        {...this.props}
      />
    );
  }
}

export default compose(
  withProps(() => ({
    location: window.location,
    history: window.history,
  })),
  connect(
    (state) => ({
      getOffersFromFilter: (filters) => getOffersFiltered(state, filters),
      loading: isOfferLoading(state),
      coaches: state.marketplacev2.coaches.items,
      establishments: state.marketplacev2.establishments.items,
      metaActivities: state.marketplacev2.metaActivities.items,
    }),
    {
      resetOffers: resetOffersAction,
      fetchCompanyOffers: fetchCompanyOffersAction,
    },
  ),
)(CalendarWidget);
