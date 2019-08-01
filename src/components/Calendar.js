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
import 'bsport-saas/src/components/map/Map.css';

import {
  getOffersFiltered,
  isOfferLoading,
} from 'bsport-saas/src/libs/marketplace/selectors';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';

type Props = {
  companyId: number,
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
      selectedDate: selectedDate.clone(),
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
        offers={this.props.getOffersFromFilter(this.state.filters)}
        toogleFiltersOpen={() =>
          this.setState((prevState) => ({
            filtersOpen: !prevState.filtersOpen,
          }))
        }
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
