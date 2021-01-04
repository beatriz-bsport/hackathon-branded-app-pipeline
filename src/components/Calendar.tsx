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
import { RootState } from '../store/reducer';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';
const DATE_FORMAT = 'YYYY-MM-DD';


type OwnProps = {
  companyId: string;
  defaultFilters: {
    coaches: number[];
    establishments: number[];
    levels: number[];
    metaActivities: number[];
  },
  compactMode: any;
  filtersOpen: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {
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
      selectedDate: Moment().format(DATE_FORMAT),
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

  fetchOfferList = (params: any) => {
    this.props.fetchOfferList({
      ...(params || {}),
      company: this.props.companyId,
      filters: this.state.filters,
      ...(this.props.theme && this.props.theme.show_workshops_customer
        ? {}
        : { is_workshop: false }),
      ...(this.props.theme && this.props.theme.show_cancelled_offers_customer
        ? {}
        : { available: true }),
    });
  };

  setOtherParams = (key: string) => {
    return (arg: any) => {
      if (key === 'date') {
        this.setState({ selectedDate: arg });
      }
    };
  }

  render() {
    return (
      <MarketplaceCalendarStyled
        companyId={this.props.companyId}
        filtersOpen={this.state.filtersOpen}
        filters={this.state.filters}
        setFilters={this.setFilters}
        fetchOfferList={this.fetchOfferList}
        handleDateChange={this.handleDateChange}
        otherParams={{
          date: this.state.selectedDate,
        }}
        compactMode={this.props.compactMode}
        offers={this.props.offers}
        toogleFiltersOpen={() =>
          this.setState((prevState) => ({
            filtersOpen: !prevState.filtersOpen,
          }))
        }
        fetchEstablishmentBulk={this.props.fetchEstablishmentBulk}
        fetchMetaActivityBulk={this.props.fetchMetaActivityBulk}
        fetchAssociatedCoachBulkFromCoachIds={this.props.fetchCoachBulk}
        fetchCoachBulk={this.props.fetchCoachBulk}
        hideMap
        loading={this.props.offersLoading}
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
        setOtherParams={this.setOtherParams}
      />
    );
  }
}


const mapStateToProps = (state: RootState) => ({
  offers: withMetaActivity(
    withCoach(withEstablishment(getMarketplaceOfferList)))(state),
  offersLoading: state.offer.loading,
  // @ts-ignore
  coaches: getCoaches(state),
  // @ts-ignore
  establishments: getAllEstablishments(state),
  metaActivities: getMetaActivities(state),
  // @ts-ignore
  theme: themeSelectors.getTheme(state),
  compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
  compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
});

const mapDispatchToProps = {
  fetchOfferList: fetchOfferListAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
  fetchCompatiblePass: paymentActions.fetchCompatiblePass,
};

const mapWithProps = (props: ConnectProps & OwnProps) => ({
  goToPackPayment: (packId: number, offerId: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`
    );
  },
  onCompletePurchase: () => {
    window.open(`${BACKOFFICE_URI}/customer`);
  },
  goToBook: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
  goToBookOption: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
  fetchOfferList: (params: any) =>
    props.fetchOfferList(params, {
      onSuccess: (offerList: any) => {
        props.fetchEstablishmentBulk([
          ...offerList.map((o: any) => o.establishment),
          ...offerList.map((o: any) => o.establishment_override),
        ]);
        props.fetchCoachBulk([
          ...offerList.map((o: any) => o.coach),
          ...offerList.map((o: any) => o.coach_override),
        ]);
        props.fetchMetaActivityBulk([...offerList.map((o: any) => o.meta_activity)]);
      },
    }),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(mapWithProps)
)(CalendarWidget);
