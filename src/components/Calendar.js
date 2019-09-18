// @flow

import { Moment } from 'bsport-saas/src/i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { MarketplaceCalendarStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

import {
  resetOffersAction,
  fetchCompanyOffersAction,
} from 'bsport-saas/src/libs/marketplace/actions';
import * as paymentActions from 'bsport-saas/src/actions/payment.actions';

import {
  getOffersFiltered,
  isOfferLoading,
} from 'bsport-saas/src/libs/marketplace/selectors';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';

type Props = {
  companyId: number,
  fetchCompanyOffers: () => void,
  getOffersFromFilter: (*) => void,
  loading: ?boolean,
  coaches: [],
  establishments: [],
  metaActivities: [],
  compatibleConsumerPacks: [],
  compatiblePaymentPacks: [],
  resetOffers: () => void,
  goToBook: (bookingId: number, companyId: number) => void,
  goToBookOption: (bookingId: number, companyId: number) => void,
  fetchPaymentPacks: () => void,
  fetchCompatiblePass: () => void,
  goToPackPayment: (packId: number, offerId: number, companyId: number) => void,
  onCompletePurchase: () => void,
  defaultFilters: {
    coaches: [],
    establishments: [],
    levels: [],
    metaActivities: [],
  },
  compactMode: boolean,
};

type State = {
  filtersOpen: boolean,
  filters: any,
  selectedDate: Moment,
};

export class CalendarWidget extends Component<Props, State> {
  state = {
    filtersOpen: false,
    filters: {},
    selectedDate: Moment(),
  };

  componentDidMount() {
    this.setFilters(this.props.defaultFilters);
  }

  setFilters = (filters: any) => {
    this.setState((prevState) => ({
      filters: { ...prevState.filters, ...filters },
    }));
  };

  handleDateChange = (selectedDate: Moment) => {
    this.setState({
      selectedDate: Moment(selectedDate, 'YYYY-MM-DD'),
    });
  };

  render() {
    return (
      <MarketplaceCalendarStyled
        companyId={this.props.companyId}
        filtersOpen={this.state.filtersOpen}
        filters={this.state.filters}
        setFilters={this.setFilters}
        fetchCompanyOffers={this.props.fetchCompanyOffers}
        handleDateChange={this.handleDateChange}
        selectedDate={this.state.selectedDate}
        compactMode={this.props.compactMode}
        offers={this.props.getOffersFromFilter(this.state.filters)}
        toogleFiltersOpen={() =>
          this.setState((prevState) => ({
            filtersOpen: !prevState.filtersOpen,
          }))
        }
        hideMap
        loading={this.props.loading}
        coaches={this.props.coaches}
        establishments={this.props.establishments}
        metaActivities={this.props.metaActivities}
        compatibleConsumerPacks={this.props.compatibleConsumerPacks}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        resetOffers={this.props.resetOffers}
        goToBook={this.props.goToBook}
        goToBookOption={this.props.goToBookOption}
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        fetchCompatiblePass={this.props.fetchCompatiblePass}
        goToPackPayment={this.props.goToPackPayment}
        onCompletePurchase={this.props.onCompletePurchase}
      />
    );
  }
}

export default compose(
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
  // for metaactivity dialog
  connect(
    (state) => ({
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
    }),
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
    },
  ),
  withProps(() => ({
    goToPackPayment: (packId, offerId, companyId) => {
      window.open(
        `${BACKOFFICE_URI}/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`,
      );
    },
    onCompletePurchase: () => {
      window.open(`${BACKOFFICE_URI}/customer`);
    },
    goToBook: (id, companyId) => {
      window.open(
        `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`,
      );
    },
    goToBookOption: (id, companyId) => {
      window.open(
        `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`,
      );
    },
  })),
)(CalendarWidget);
