// @flow
import React, { Component } from 'react';
import { MarketplaceWorkshopPageStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import * as paymentActions from 'bsport-saas/src/actions/payment.actions';
import { fetchCoachBulk as fetchCoachBulkAction } from 'bsport-saas/src/libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from 'bsport-saas/src/libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from 'bsport-saas/src/libs/meta-activity/actions';
import { fetchMarketplaceOfferList as fetchOfferListAction } from 'bsport-saas/src/libs/offer/actions';
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import {
  withMetaActivity,
  withCoach,
  withEstablishment,
  getListCalendarOfferFromNow,
} from 'bsport-saas/src/libs/offer/selectors';
import { RootState } from '../store/reducer';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';


type OwnProps = {
  companyId: string;
  defaultFilters: any;
  filtersOpen: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {
};

class WorkshopWidget extends Component<Props> {
  render() {
    const { companyId, goToBookOption, goToBook, offers } = this.props;

    return (
      <div
        style={{
          display: 'flex !important',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <MarketplaceWorkshopPageStyled
          companyId={companyId}
          fetchOfferList={this.props.fetchOfferList}
          offers={offers}
          goToBookOption={goToBookOption}
          fetchCompanyTheme={this.props.fetchCompanyTheme}
          goToBook={goToBook}
          hideMap
          theme={this.props.theme}
          fetchPaymentPacks={this.props.fetchPaymentPacks}
          fetchCompatiblePass={this.props.fetchCompatiblePass}
          compatibleConsumerPacks={this.props.compatibleConsumerPacks}
          compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
    offers: withMetaActivity(
      withCoach(withEstablishment(getListCalendarOfferFromNow))
    )(state),
    compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
    compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
    theme: state.theme.theme,
  });

const mapDispatchToProps = {
  fetchCompanyTheme,
  fetchOfferList: fetchOfferListAction,
  fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
  fetchCompatiblePass: paymentActions.fetchCompatiblePass,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
};

const mapWithProps = (props: ConnectProps & OwnProps) => ({
  goToBookOption: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
    goToBook: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
  fetchOfferList: (params = {}) => {
    const { defaultFilters, theme } = props;

    props.fetchOfferList(
      {
        ...params,
        activity__in: defaultFilters ? defaultFilters.metaActivities : [],
        coach__in: defaultFilters ? defaultFilters.coaches : [],
        establishment__in: defaultFilters
          ? defaultFilters.establishments
          : [],
        level__in: defaultFilters ? defaultFilters.levels : [],
        ...(theme && theme.show_cancelled_offers_customer
          ? {}
          : { available: true }),
      },
      {
        onSuccess: (offerList: any) => {
          props.fetchEstablishmentBulk(
            offerList.map((o: any) => o.establishment)
          );
          props.fetchCoachBulk(offerList.map((o: any) => o.coach));
          props.fetchMetaActivityBulk(
            offerList.map((o: any) => o.meta_activity)
          );
        },
      }
    );
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(mapWithProps)
)(WorkshopWidget);
