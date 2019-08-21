// @flow
import React, { Component } from 'react';
import { MarketplaceWorkshopPageStyled } from 'bsport-saas/src/pages/marketplace/MarketplaceWorkshop.page';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import {
  getOffersWorkshop,
  getWorkshops,
  isOfferLoading,
} from 'bsport-saas/src/libs/marketplace/selectors';
import * as paymentActions from 'bsport-saas/src/actions/payment.actions';
import { fetchCompanyOffersWorkshopAction } from 'bsport-saas/src/libs/marketplace/actions';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';

type Props = {
  companyId: number,
};
class WorkshopWidget extends Component<Props> {
  render() {
    const {
      companyId,
      goToBookOption,
      goToBook,
      workshops,
      loading,
      fetchCompanyOffers,
      offers,
    } = this.props;
    return (
      <MarketplaceWorkshopPageStyled
        companyId={companyId}
        fetchCompanyOffers={fetchCompanyOffers}
        offers={offers}
        workshops={workshops}
        loading={loading}
        goToBookOption={goToBookOption}
        goToBook={goToBook}
        hideMap
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        fetchCompatiblePass={this.props.fetchCompatiblePass}
        compatibleConsumerPacks={this.props.compatibleConsumerPacks}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
      />
    );
  }
}

export default compose(
  connect(
    (state) => ({
      offers: getOffersWorkshop(state),
      workshops: getWorkshops(state),
      loading: isOfferLoading(state),
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
    }),
    {
      fetchCompanyOffers: fetchCompanyOffersWorkshopAction,
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
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
)(WorkshopWidget);
