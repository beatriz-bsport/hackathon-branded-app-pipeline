// @flow
import React from 'react';

import { compose, withProps } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '../../actions/snackbar.actions';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import * as paymentActions from '../../actions/payment.actions';
import MarketplaceWorkshop from '../../libs/marketplace/components/MarketplaceWorkshop.component';

import {
  getListCalendarOfferFromNow,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';
import { DATE_FORMAT } from '../../datetime';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketplaceOfferList as fetchOfferListAction } from '../../libs/offer/actions';

import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';
import type { PaymentCombo } from '../../libs/payment-combo/types';
import Analytics from '../../components/analytics/Analytics.component';

type Props = {
  // t: TFunction,
  companyId: number,
  loading: boolean,
  hideMap: boolean,
  offers: Array<Offer>,
  classes: *,
  activityLoading: boolean,
  establishmentLoading: boolean,
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

  fetchOfferList: () => void,
};

export class MarketplaceWorkshopPage extends React.Component<Props> {
  componentDidMount() {
    const min_date = Moment().startOf('month').format(DATE_FORMAT);
    const max_date = Moment()
      .startOf('month')
      .add('years', 1)
      .format(DATE_FORMAT);
    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      is_workshop: true,
    });
  }

  goToBook = (offer: Offer) => {
    Analytics.workshopClick(offer);
    this.props.goToBook(offer.id, this.props.companyId);
  };

  render() {
    const { classes, offers, loading } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <div className={classes.column}>
          <MarketplaceWorkshop
            offers={offers}
            activityLoading={this.props.activityLoading}
            establishmentLoading={this.props.establishmentLoading}
            fetchPaymentPacks={this.props.fetchPaymentPacks}
            fetchCompatiblePass={this.props.fetchCompatiblePass}
            compatibleConsumerPacks={this.props.compatibleConsumerPacks}
            compatiblePaymentPacks={this.props.compatiblePaymentPacks}
            paymentComboList={this.props.paymentComboList}
            hideMap={!!this.props.hideMap}
            onBook={this.goToBook}
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
      offers: withMetaActivity(
        withCoach(withEstablishment(getListCalendarOfferFromNow)),
      )(state),
      loading: state.offer.marketplace.loading,
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
      paymentComboList: getPaymentComboListAvailableOnline(state),
      coachLoading: state.coach.loading,
      establishmentLoading: state.establishment.bulkRetrieve.loading,
      activityLoading: state.metaActivity.loading,
    }),
    {
      fetchOfferList: fetchOfferListAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchAssociatedCoachBulkFromCoachIds: fetchAssociatedCoachBulkFromCoachIdsAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      snackbarSuccess: snackbarSuccessAction,
      snackbarError: snackbarErrorAction,
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
  withProps(
    ({
      fetchOfferList,
      fetchEstablishmentBulk,
      fetchAssociatedCoachBulkFromCoachIds,
      fetchMetaActivityBulk,
      companyId,
    }) => ({
      fetchOfferList: (params) =>
        fetchOfferList(params, {
          onSuccess: (offerList) => {
            fetchEstablishmentBulk([...offerList.map((o) => o.establishment)]);
            fetchAssociatedCoachBulkFromCoachIds(
              [...offerList.map((o) => o.coach)],
              companyId,
            );
            fetchMetaActivityBulk([...offerList.map((o) => o.meta_activity)]);
          },
        }),
    }),
  ),
  withTranslation(['booking', 'titles']),
  withProps(({ pushRouter, snackbarSuccess, snackbarError, t }) => ({
    onBookOfferFromPack: (offerId, packId) => {
      payWithConsumerPaymentPackAPI(packId, offerId, {})
        .then(() => {
          snackbarSuccess('booking.register.success');
          pushRouter('/');
        })
        .catch((err) => {
          console.error(err);
          if (err && err.response && err.response.status === 423) {
            switch (err.response.data) {
              case 'unavailable for female':
                snackbarError(
                  t('booking:bookingModule.messages.femaleUnavailable'),
                );
                break;
              case 'unavailable for male':
                snackbarError(
                  t('booking:bookingModule.messages.maleUnavailable'),
                );
                break;
              default:
                snackbarError(t('booking:bookingModule.messages.offerLocked'));
                break;
            }
          }
        });
    },
  })),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceWorkshop'),
  ),
)(MarketplaceWorkshopPage);
