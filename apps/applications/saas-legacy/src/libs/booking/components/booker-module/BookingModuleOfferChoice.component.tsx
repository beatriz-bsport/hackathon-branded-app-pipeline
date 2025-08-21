import React from 'react';
import {
  Theme,
  WithStyles,
  withStyles,
  createStyles,
} from '@material-ui/core/styles';
import { compose, withStateHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import Button from '@material-ui/core/Button';
import OfferListItemV2 from '../../../offer/components/OfferListItemV2.component';

import { getPaymentPackTimeLimitation } from '../../../payment-packs/utils';
import type { ConsumerPaymentPack } from '../../../consumer-payment-pack/types';
import type { PaymentPack as AbstractPaymentPack } from '../../../payment-packs/types';
import { TFunction } from 'i18next';
import { Offer as AbstractOffer } from '#src/libs/offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Level } from '#src/libs/level/types';

type Offer = AbstractOffer<Coach, Establishment, MetaActivity> & {
  customLevel: Level;
};

type PaymentPack = AbstractPaymentPack<any, any, string>;

type Props = {
  t: TFunction;
  offerId: number;
  offer: Offer;

  registererObject: {
    consumerPaymentPack?: ConsumerPaymentPack<PaymentPack>;
    paymentPack?: PaymentPack;
  };

  offersSelected: Array<number>;
  associatedOffers: Array<Offer>;
  associatedOffersLoading: boolean;
  toogleChecked: (id: number) => void;
  setOffersSelected: (offersSelected: Array<number>) => void;
  resetOffersSelected: () => void;
  registerToOffer: (offerIds: Array<number>) => void;
  fetchAssociatedOffers: () => void;
  goBack: () => void;
} & WithStyles<typeof styles>;

const getLimitation = (
  {
    paymentPack,
    consumerPaymentPack,
  }: {
    paymentPack?: PaymentPack;
    consumerPaymentPack?: ConsumerPaymentPack<PaymentPack>;
  },
  baseDate: string,
): {
  start?: DateTime;
  end?: DateTime;
  credits?: number;
} => {
  if (consumerPaymentPack) {
    return {
      start: DateTime.fromISO(consumerPaymentPack.starting_date),
      end: DateTime.fromISO(consumerPaymentPack.ending_date),
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
      credits = paymentPack.credits ?? 0;
    }
    const { start, end } = getPaymentPackTimeLimitation(paymentPack, baseDate);
    return { start, end, credits };
  }
  return {};
};

export class BookingModuleOfferChoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociatedOffers();
  }

  isOfferValid = (offer: Offer) => {
    return !!offer.establishment && !!offer.coach && !!offer.meta_activity;
  };

  isOfferEligible = (
    offer: Offer,
    start_payment_pack: DateTime,
    end_payment_pack: DateTime,
  ) => {
    // Skip invalid offers
    if (!this.isOfferValid(offer)) return false;

    // Check date range
    if (
      DateTime.fromISO(offer.date_start) < start_payment_pack ||
      DateTime.fromISO(offer.date_start) > end_payment_pack
    ) {
      return false;
    }

    return DateTime.fromISO(offer.date_start) >= DateTime.now();
  };

  isOfferDisabled = (
    offer: Offer,
    creditToBeConsumed: number,
    start?: DateTime,
    end?: DateTime,
    credits?: number,
  ) => {
    if (!start || !end || !credits) return true;
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

  getSelectableOffers = (eligibleOffers: Array<Offer>, credits: number) => {
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

  handleSelectAllEligibleOffers = (
    start?: DateTime,
    end?: DateTime,
    credits?: number,
  ) => {
    if (!start || !end || !credits) return;

    // Filter eligible offers that can be booked (excluding current offer)
    const eligibleOffers = this.props.associatedOffers.filter(
      (offer) =>
        this.isOfferEligible(offer, start, end) &&
        offer.id !== this.props.offerId,
    );

    // Always include the current offer in the selection
    const allEligibleOffers = [this.props.offer, ...eligibleOffers];

    // Calculate which offers can be selected within credit limit
    // If there is not enough credits for the current offer, this form should not be displayed
    const selectableOffers = this.getSelectableOffers(
      allEligibleOffers,
      credits,
    );

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
    const creditToBeConsumed = this.props.associatedOffers.reduce((acc, v) => {
      if (this.props.offersSelected.includes(v.id)) return acc + v.credit_price;
      return acc;
    }, 0);
    const { t, classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.sectionTitle}>
          <Typography variant="h6">
            {t(
              !!this.props.offer.group
                ? 'bookingModule.recurrent.titleGroupedSessions'
                : 'bookingModule.recurrent.title',
            )}
          </Typography>
          {!!this.props.associatedOffersLoading && (
            <CircularProgress size={18} />
          )}
        </div>
        {!this.props.associatedOffersLoading &&
          !!this.props.associatedOffers.length && (
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
              {this.props.associatedOffers
                .filter((o) => this.isOfferValid(o))
                .map((o) => {
                  const disabled = this.isOfferDisabled(
                    o,
                    creditToBeConsumed,
                    start,
                    end,
                    credits,
                  );
                  return (
                    <div key={o.id} className={classes.row}>
                      <Checkbox
                        checked={this.props.offersSelected.includes(o.id)}
                        disabled={disabled}
                        onChange={() => this.props.toogleChecked(o.id)}
                      />
                      <OfferListItemV2
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

const styles = (theme: Theme) =>
  createStyles({
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
  withStateHandlers(
    ({ offerId }: { offerId: number }) => ({ offersSelected: [offerId] }),
    {
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
        (_, { offerId }: { offerId: number }) =>
        () => ({
          offersSelected: [offerId],
        }),
    },
  ),
)(BookingModuleOfferChoice);
