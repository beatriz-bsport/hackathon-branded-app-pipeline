// @flow
import React, { Component } from 'react';
import { MarketplaceWorkshopPageStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import * as paymentActions from 'bsport-saas/src/actions/payment.actions';
// import { fetchCompanyOffersWorkshopAction } from 'bsport-saas/src/libs/marketplace/actions';
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

const BACKOFFICE_URI = 'https://backoffice.bsport.io';

type Props = {
  companyId: number,
};
class WorkshopWidget extends Component<Props> {
  render() {
    const { companyId, goToBookOption, goToBook, loading, offers } = this.props;
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
          loading={loading}
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

export default compose(
  connect(
    (state) => ({
      offers: withMetaActivity(
        withCoach(withEstablishment(getListCalendarOfferFromNow)),
      )(state),
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
      theme: state.theme.theme,
    }),
    {
      fetchCompanyTheme,
      fetchOfferList: fetchOfferListAction,
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    },
  ),
  withProps(() => ({
    goToBookOption: (id: number, companyId: number) => {
      window.open(
        `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`,
      );
    },
    goToBook: (id: number, companyId: number) => {
      window.open(
        `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`,
      );
    },
  })),
  withProps(
    ({
      fetchOfferList,
      defaultFilters,
      fetchEstablishmentBulk,
      fetchCoachBulk,
      fetchMetaActivityBulk,
    }) => ({
      fetchOfferList: (params = {}) =>
        fetchOfferList(
          {
            ...params,
            activity__in: defaultFilters ? defaultFilters.metaActivities : [],
            coach__in: defaultFilters ? defaultFilters.coaches : [],
            establishment__in: defaultFilters
              ? defaultFilters.establishments
              : [],
            level__in: defaultFilters ? defaultFilters.levels : [],
          },
          {
            onSuccess: (offerList) => {
              fetchEstablishmentBulk([
                ...offerList.map((o) => o.establishment),
              ]);
              fetchCoachBulk([...offerList.map((o) => o.coach)]);
              fetchMetaActivityBulk([...offerList.map((o) => o.meta_activity)]);
            },
          },
        ),
    }),
  ),
)(WorkshopWidget);
