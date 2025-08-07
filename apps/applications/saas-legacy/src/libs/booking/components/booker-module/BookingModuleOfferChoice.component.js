// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose, withStateHandlers, withProps } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation, TFunction } from 'react-i18next';
import { DateTime } from 'luxon';

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
  setOffersSelected: (offersSelected: Array<number>) => void,
  resetOffersSelected: () => void,
  registerToOffer: (offerIds: Array<number>) => void,
  fetchSimilarOffers: (id: number) => void,
  goBack: () => void,
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionCallback<Level[]>,
  ) => void,
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
      credits: consumerPaymentPack.payment_pack.unlimited
        ? 99999
        : consumerPaymentPack.available_credits,
    };
  }
  if (paymentPack) {
    let credits = 0;
    if (paymentPack.unlimited) {
      credits = 1000;
    } else {
      credits = paymentPack.credits;
    }
    const { start, end } = getPaymentPackTimeLimitation(paymentPack, baseDate);
    return { start, end, credits };
  }
  return {};
};

export class BookingModuleOfferChoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSimilarOffers(this.props.offerId, {
      onSuccess: (data) => {
        this.props.fetchLevelList({
          id__in: Array.from(new Set(data?.results?.map((o) => o.level))),
        });
      },
    });
  }

  isOfferValid = (offer) => {
    return !!offer.establishment && !!offer.coach && !!offer.meta_activity;
  };

  isOfferEligible = (offer, start_payment_pack, end_payment_pack) => {
    // Skip invalid offers
    if (!this.isOfferValid(offer)) return false;

    // Check date range
    // TODO(BOO-745): We should use DateTime.fromISO for all dates, otherwise this check
    // does not work correctly.
    if (
      DateTime.fromISO(offer.date_start) < start_payment_pack ||
      DateTime.fromISO(offer.date_start) > end_payment_pack
    ) {
      return false;
    }

    return true;
  };

  isOfferDisabled = (offer, start, end, credits, creditToBeConsumed) => {
    // Use the eligibility check first (covers current offer, date range, and validity)
    if (!this.isOfferEligible(offer, start, end)) return true;

    // Skip current offer
    if (offer.id === this.props.offerId) return true;

    // Check if the offer would exceed the credit limit (only if not already selected)
    return (
      creditToBeConsumed + offer.credit_price > credits &&
      !this.props.offersSelected.includes(offer.id)
    );
  };

  getSelectableOffers = (eligibleOffers, credits) => {
    const selectableOffers = [];
    let runningCreditTotal = 0;

    for (const offer of eligibleOffers) {
      if (runningCreditTotal + offer.credit_price <= credits) {
        selectableOffers.push(offer.id);
        runningCreditTotal += offer.credit_price;
      }
    }

    return selectableOffers;
  };

  handleSelectAllEligibleOffers = (start, end, credits) => {
    // Filter eligible offers that can be booked
    const eligibleOffers = this.props.similarOffers.filter((offer) =>
      this.isOfferEligible(offer, start, end),
    );

    // Calculate which offers can be selected within credit limit
    const selectableOffers = this.getSelectableOffers(eligibleOffers, credits);

    this.props.setOffersSelected(selectableOffers);
  };

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
          !!this.props.similarOffers.length && (
            <div>
              <div>
                <Button
                  onClick={() =>
                    this.handleSelectAllEligibleOffers(start, end, credits)
                  }
                >
                  <Typography variant="caption">
                    {t('bookingModule.recurrent.selectAll')}
                  </Typography>
                </Button>
                <Button onClick={this.props.resetOffersSelected}>
                  <Typography variant="caption">
                    {t('bookingModule.recurrent.unselectAll')}
                  </Typography>
                </Button>
              </div>
              {this.props.similarOffers
                .filter((o) => this.isOfferValid(o))
                .map((o) => {
                  const disabled = this.isOfferDisabled(
                    o,
                    start,
                    end,
                    credits,
                    creditToBeConsumed,
                  );
                  return (
                    <div key={o.id} className={classes.row}>
                      <Checkbox
                        checked={this.props.offersSelected.includes(o.id)}
                        disabled={disabled}
                        onChange={() => this.props.toogleChecked(o.id)}
                      />
                      <OfferListItemV2
                        showDate
                        disabled={disabled}
                        offer={o}
                        onClick={this.props.toogleChecked}
                        selected={this.props.offersSelected.includes(o.id)}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        <div className={classes.actions}>
          <Button
            color="primary"
            onClick={() =>
              this.props.registerToOffer(this.props.offersSelected)
            }
            style={{ flex: 2 }}
            variant="contained"
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
    toogleChecked:
      ({ offersSelected }) =>
      (id) => {
        if (offersSelected.includes(id)) {
          return { offersSelected: offersSelected.filter((i) => i !== id) };
        }
        return { offersSelected: [...offersSelected, id] };
      },
    setOffersSelected: () => (offersSelected) => ({
      offersSelected,
    }),
    resetOffersSelected:
      (_, { offerId }) =>
      () => ({
        offersSelected: [offerId],
      }),
  }),
  withProps(({ similarOfferLoading, paymentPack, consumerPaymentPack }) => ({
    loading: similarOfferLoading || (!paymentPack && !consumerPaymentPack),
  })),
)(BookingModuleOfferChoice);
