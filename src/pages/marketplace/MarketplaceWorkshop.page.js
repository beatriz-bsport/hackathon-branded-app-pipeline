// @flow
import React from 'react';

import { compose, withProps } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { snackbarSuccess as snackbarSuccessAction } from '../../actions/snackbar.actions';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';

import * as paymentActions from '../../actions/payment.actions';
import MarketplaceWorkshop from '../../libs/marketplace/components/MarketplaceWorkshop.component';
import {
  getOffersWorkshop,
  getWorkshops,
  isOfferLoading,
} from '../../libs/marketplace/selectors';
import { fetchCompanyOffersWorkshopAction } from '../../libs/marketplace/actions';
import { DATE_FORMAT } from '../../datetime';
import withTitle from '../../hocs/with-title.hoc';

import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';
import type { PaymentCombo } from '../../libs/payment-combo/types';

type Props = {
  // t: TFunction,
  companyId: number,
  loading: boolean,
  hideMap: boolean,
  offers: Array<Offer>,
  workshops: Array<MetaActivity>,
  classes: *,

  fetchCompanyOffers: (companyId: number, min_date: string) => void,
  goToBook: (offerId: number, companyId: number) => void,

  fetchPaymentPacks: (offerId: number) => void,
  fetchCompatiblePass: (offerId: number) => void,

  goToPaymentComboPayment: (
    comboId: number,
    offerId: number,
    companyId: number,
  ) => void,
  paymentComboList: Array<PaymentCombo>,

  onBookOfferFromPack: (offerId: number, consumerPaymentPack: number) => void,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,
  goToPackPayment: (offerId: number, companyId: number) => void,
};

export class MarketplaceWorkshopPage extends React.Component<Props> {
  componentDidMount() {
    const min_date = Moment()
      .startOf('month')
      .format(DATE_FORMAT);
    const max_date = Moment()
      .startOf('month')
      .add('years', 1)
      .format(DATE_FORMAT);
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  render() {
    const { classes, offers, workshops, loading } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <div className={classes.column}>
          <MarketplaceWorkshop
            offers={offers}
            workshops={workshops}
            fetchPaymentPacks={this.props.fetchPaymentPacks}
            fetchCompatiblePass={this.props.fetchCompatiblePass}
            compatibleConsumerPacks={this.props.compatibleConsumerPacks}
            compatiblePaymentPacks={this.props.compatiblePaymentPacks}
            paymentComboList={this.props.paymentComboList}
            hideMap={!!this.props.hideMap}
            onBook={(id) => this.props.goToBook(id, this.props.companyId)}
            onBookOfferFromPack={this.props.onBookOfferFromPack}
            goToPackPayment={(packId, offerId) =>
              this.props.goToPackPayment(packId, offerId, this.props.companyId)
            }
            goToPaymentComboPayment={(comboId, offerId) =>
              this.props.goToPaymentComboPayment(
                comboId,
                offerId,
                this.props.companyId,
              )
            }
          />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  column: {
    maxWidth: 800,
  },
});

export const MarketplaceWorkshopPageStyled = withStyles(styles)(
  MarketplaceWorkshopPage,
);

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      offers: getOffersWorkshop(state),
      workshops: getWorkshops(state),
      loading: isOfferLoading(state),
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
      paymentComboList: getPaymentComboListAvailableOnline(state),
    }),
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      fetchCompanyOffers: fetchCompanyOffersWorkshopAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      snackbarSuccess: snackbarSuccessAction,
      pushRouter: push,
      goToPackPayment: (packId, offerId, companyId) =>
        push(
          `/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`,
        ),
      goToPaymentComboPayment: (comboId, offerId, companyId) =>
        push(
          `/customer/payment/combo/${comboId}?nextOffer=${offerId}&membership=${companyId}`,
        ),
    },
  ),
  withProps(({ pushRouter, snackbarSuccess }) => ({
    onBookOfferFromPack: (offerId, packId) => {
      payWithConsumerPaymentPackAPI(packId, offerId, {})
        .then(() => {
          snackbarSuccess('booking.success');
          pushRouter('/');
        })
        .catch((err) => {
          console.error(err);
        });
    },
  })),
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceWorkshop'),
  ),
)(MarketplaceWorkshopPage);
