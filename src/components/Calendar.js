// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Moment } from 'bsport-saas/src/i18n';

import { MarketplaceCalendarStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

import { fetchMarketplaceOfferList as fetchOfferListAction } from 'bsport-saas/src/libs/offer/actions';
import * as paymentActions from 'bsport-saas/src/actions/payment.actions';
import { fetchCoachBulk as fetchCoachBulkAction } from 'bsport-saas/src/libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from 'bsport-saas/src/libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from 'bsport-saas/src/libs/meta-activity/actions';

import themeSelectors from 'bsport-saas/src/libs/theme/selectors';
import {
  getMarketplaceOfferList,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from 'bsport-saas/src/libs/offer/selectors';
import { getCoaches } from 'bsport-saas/src/libs/associated-coach/selectors';
import { getMetaActivities } from 'bsport-saas/src/libs/meta-activity/selectors';

import { getAllEstablishments } from 'bsport-saas/src/libs/establishment/selectors';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';
const DATE_FORMAT = 'YYYY-MM-DD';

type Props = {
  companyId: number,
  getOffersFromFilter: (*) => void,
  loading: ?boolean,
  coaches: [],
  establishments: [],
  metaActivities: [],
  compatibleConsumerPacks: [],
  compatiblePaymentPacks: [],
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
  selectedDate: Object,
};

export class CalendarWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filtersOpen: !!props.filtersOpen,
      filters: props.defaultFilters || {},
      selectedDate: Moment(),
    };
  }

  setFilters = (filters: any) => {
    this.setState((prevState) => ({
      filters: { ...prevState.filters, ...filters },
    }));
  };

  handleDateChange = (selectedDate: string) => {
    this.setState({
      selectedDate: Moment(selectedDate, DATE_FORMAT),
    });
  };

  render() {
    return (
      <MarketplaceCalendarStyled
        companyId={this.props.companyId}
        filtersOpen={this.state.filtersOpen}
        filters={this.state.filters}
        setFilters={this.setFilters}
        fetchOfferList={this.props.fetchOfferList}
        handleDateChange={this.handleDateChange}
        selectedDate={this.state.selectedDate}
        compactMode={this.props.compactMode}
        offers={this.props.offers}
        toogleFiltersOpen={() =>
          this.setState((prevState) => ({
            filtersOpen: !prevState.filtersOpen,
          }))
        }
        fetchEstablishmentBulk={this.props.fetchEstablishmentBulk}
        fetchMetaActivityBulk={this.props.fetchMetaActivityBulk}
        fetchCoachBulk={this.props.fetchCoachBulk}
        hideMap
        loading={this.props.loading}
        coaches={this.props.coaches}
        establishments={this.props.establishments}
        metaActivities={this.props.metaActivities}
        compatibleConsumerPacks={this.props.compatibleConsumerPacks}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        goToBook={this.props.goToBook}
        goToBookOption={this.props.goToBookOption}
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        fetchCompatiblePass={this.props.fetchCompatiblePass}
        goToPackPayment={this.props.goToPackPayment}
        onCompletePurchase={this.props.onCompletePurchase}
        theme={this.props.theme}
      />
    );
  }
}

export default compose(
  connect(
    (state) => ({
      offers: withMetaActivity(
        withCoach(withEstablishment(getMarketplaceOfferList)),
      )(state),
      coaches: getCoaches(state),
      establishments: getAllEstablishments(state),
      metaActivities: getMetaActivities(state),
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchOfferList: fetchOfferListAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
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
  withProps(
    ({
      fetchOfferList,
      fetchEstablishmentBulk,
      fetchCoachBulk,
      fetchMetaActivityBulk,
    }) => ({
      fetchOfferList: (params) =>
        fetchOfferList(params, {
          onSuccess: (offerList) => {
            fetchEstablishmentBulk([
              ...offerList.map((o) => o.establishment),
              ...offerList.map((o) => o.establishment_override),
            ]);
            fetchCoachBulk([
              ...offerList.map((o) => o.coach),
              ...offerList.map((o) => o.coach_override),
            ]);
            fetchMetaActivityBulk([...offerList.map((o) => o.meta_activity)]);
          },
        }),
    }),
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
