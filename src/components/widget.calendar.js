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
export default class CalendarWidget extends Component<Props, State> {
  state = {
    filtersOpen: false,
  };

  render() {
    return (
      <MarketplaceCalendar
        filtersOpen={this.state.filtersOpen}
        filters={this.props.filters}
        setFilters={this.props.setFilters}
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

const MarketplaceCalendar = compose(
  withProps(() => ({
    location: window.location,
    history: window.history,
  })),
  withState('filters', 'setFilters', {}),
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
    },
  ),
  withProps(() => ({
    handleDateChange: () => {},
  })),
  withProps(() => ({
    selectedDate: Moment(),
  })),
  withProps(() => ({
    setFilters: () => {},
    onSelectDate: () => {},
  })),
)(MarketplaceCalendarStyled);
