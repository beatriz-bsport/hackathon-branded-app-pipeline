// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose, withStateHandlers, withProps } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import OfferListItemV2 from '../../../offer/components/OfferListItemV2.component';

import { getPaymentPackTimeLimitation } from '../../../payment-packs/utils';
import type { ConsumerPaymentPack } from '../../../consumer-payment-pack/types';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  t: TFunction,
  offerId: number,
  offer: Offer,

  registererObject: {
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  },

  offersSelected: Array<number>,
  similarOffers: Array<Offer>,
  similarOfferLoading: boolean,
  classes: Object,
  toogleChecked: (number) => void,
  registerToOffer: (offerIds: Array<number>) => void,
  fetchSimilarOffers: (id: number) => void,
  goBack: () => void,
};

const getLimitation = (
  {
    paymentPack,
    consumerPaymentPack,
  }: { paymentPack?: PaymentPack, consumerPaymentPack?: ConsumerPaymentPack },
  baseDate: string,
) => {
  if (consumerPaymentPack) {
    return {
      start: consumerPaymentPack.starting_date,
      end: consumerPaymentPack.ending_date,
      credits: consumerPaymentPack.available_credits,
    };
  }
  if (paymentPack) {
    let credits = 0;
    if (paymentPack.unlimited) {
      credits = 1000;
    } else {
      // eslint-disable-next-line
      credits = paymentPack.credits;
    }
    const { start, end } = getPaymentPackTimeLimitation(paymentPack, baseDate);
    return { start, end, credits };
  }
  return {};
};

export class BookingModuleOfferChoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSimilarOffers(this.props.offerId);
  }

  render() {
    const { paymentPack, consumerPaymentPack } = this.props.registererObject;
    const { start, end, credits } = getLimitation(
      {
        paymentPack,
        consumerPaymentPack,
      },
      this.props.offer.date_start,
    );
    const creditToBeConsumed = this.props.similarOffers.reduce((acc, v) => {
      if (this.props.offersSelected.includes(v.id)) return acc + v.credit_price;
      return acc;
    }, 0);
    const { t, classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <Typography variant="h6">
            {t('bookingModule.recurrent.title')}
          </Typography>
          {!!this.props.similarOfferLoading && <CircularProgress size={18} />}
        </div>
        {!this.props.similarOfferLoading &&
          !!this.props.similarOffers.length &&
          this.props.similarOffers
            .filter((o) => !!o.establishment && !!o.coach && !!o.meta_activity)
            .map((o) => {
              const disabled =
                o.id === this.props.offerId ||
                (creditToBeConsumed + o.credit_price > credits &&
                  !this.props.offersSelected.includes(o.id)) ||
                moment(o.date_start).isBefore(start) ||
                moment(o.date_start).isAfter(end);
              return (
                <div className={classes.row} key={o.id}>
                  <Checkbox
                    checked={this.props.offersSelected.includes(o.id)}
                    onChange={() => this.props.toogleChecked(o.id)}
                    disabled={disabled}
                  />
                  <OfferListItemV2
                    onClick={this.props.toogleChecked}
                    offer={o}
                    showDate
                    disabled={disabled}
                    selected={this.props.offersSelected.includes(o.id)}
                  />
                </div>
              );
            })}
        <div className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            style={{ flex: 2 }}
            onClick={() =>
              this.props.registerToOffer(this.props.offersSelected)
            }
          >
            {`${t('bookingModule.recurrent.bookMultiple')} (${
              this.props.offersSelected.length
            })`}
          </Button>
          <Button onClick={this.props.goBack} style={{ flex: 1 }}>
            {t('bookingModule.recurrent.backToRegistererChoice')}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['booking']),
  withStateHandlers(({ offerId }) => ({ offersSelected: [offerId] }), {
    toogleChecked: ({ offersSelected }) => (id) => {
      if (offersSelected.includes(id)) {
        return { offersSelected: offersSelected.filter((i) => i !== id) };
      }
      return { offersSelected: [...offersSelected, id] };
    },
  }),
  withProps(({ similarOfferLoading, paymentPack, consumerPaymentPack }) => ({
    loading: similarOfferLoading || (!paymentPack && !consumerPaymentPack),
  })),
)(BookingModuleOfferChoice);
