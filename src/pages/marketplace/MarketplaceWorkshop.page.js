// @flow
import React from 'react';

import { compose } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Moment from 'moment';

import * as paymentActions from '../../actions/payment.actions';
import MarketplaceWorkshop from '../../libs/marketplace/components/MarketplaceWorkshop.component';
import {
  getOffersWorkshop,
  getWorkshops,
  isOfferLoading,
} from '../../libs/marketplace/selectors';
import { fetchCompanyOffersWorkshopAction } from '../../libs/marketplace/actions';

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
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,
  goToPackPayment: (offerId: number, companyId: number) => void,
};

export class MarketplaceWorkshopPage extends React.Component<Props> {
  componentDidMount() {
    const min_date = Moment()
      .startOf('month')
      .format('YYYY-MM-DD');
    const max_date = Moment()
      .startOf('month')
      .add('years', 1)
      .format('YYYY-MM-DD');
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  render() {
    const { classes, offers, workshops, loading } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <MarketplaceWorkshop
          offers={offers}
          workshops={workshops}
          fetchPaymentPacks={this.props.fetchPaymentPacks}
          fetchCompatiblePass={this.props.fetchCompatiblePass}
          compatibleConsumerPacks={this.props.compatibleConsumerPacks}
          compatiblePaymentPacks={this.props.compatiblePaymentPacks}
          hideMap={!!this.props.hideMap}
          onBook={(id) => this.props.goToBook(id, this.props.companyId)}
          goToPackPayment={(packId, offerId) =>
            this.props.goToPackPayment(packId, offerId, this.props.companyId)
          }
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
    }),
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      fetchCompanyOffers: fetchCompanyOffersWorkshopAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      goToPackPayment: (packId, offerId, companyId) =>
        push(
          `/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`,
        ),
    },
  ),
)(MarketplaceWorkshopPage);
