import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import moment from 'moment-timezone';
import { Box, Theme, Typography, withStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import BlockIcon from '@material-ui/icons/Block';
import { WithTranslation, withTranslation } from 'react-i18next';
import flatten from 'lodash/flatten';
import memoize from 'memoize-one';

import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_OPEN,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
} from '@bsport/common/lib/master-data/bookable-status';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../../libs/payment/api';
import { Offer_FULL, OfferStatus } from '../../../libs/offer/types';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
import { OfferConstraint, OfferData, SelectedPack } from './OfferBooking.page';
import { RootState } from '../../../reducers';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack as withPaymentPackForConsumer,
} from '../../../libs/consumer-payment-pack/selectors';
import { ConsumerPaymentPack } from '../../../libs/consumer-payment-pack/types';
import { PaymentPack } from '../../../libs/payment-packs/types';
import { PaymentCombo } from '../../../libs/payment-combo/types';
import {
  getPaymentComboForBooking,
  withPaymentPack as withPaymentPackForCombo,
} from '../../../libs/payment-combo/selectors';
import { getPaymentPackForBooking } from '../../../libs/payment-packs/selectors';
import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
} from '../../../libs/payment-packs/actions';
import { fetchPaymentComboForBooking } from '../../../libs/payment-combo/actions';
import { fetchConsumerPaymentPackForBooking } from '../../../libs/consumer-payment-pack/actions';
import { getPaymentPackTimeLimitation } from '../../../libs/payment-packs/utils';
import BookingMethodSelector from '../../../libs/booker-module/components/BookingMethodSelector.component';

import SubscriptionContractBooking from '../SubscriptionBooking.component';

import {
  fetchContractForBooking as fetchContractForBookingAction,
  resetContractForBooking as resetContractForBookingAction,
} from '../../../libs/subscription/actions';
import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '../../../libs/subscription/selectors';

type OwnProps = {
  offerId: number;
  offer?: Offer_FULL;
  offerStatus?: OfferStatus;
  company?: number;
  selectedOffers: OfferData[];
  offersConstraint?: OfferConstraint;
  selectedPack: SelectedPack;
  onPackChange: (selectedPack: SelectedPack) => void;
};

type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  consumerPacksLoaded: boolean;
  paymentPacksLoaded: boolean;
  paymentComboPacksLoaded: boolean;
};

export class OfferState extends React.PureComponent<Props, State> {
  state: State = {
    consumerPacksLoaded: false,
    paymentComboPacksLoaded: false,
    paymentPacksLoaded: false,
  };

  componentDidMount() {
    this.fetchConsumerPaymentPack();
    this.fetchPaymentPack();
    this.fetchComboPack();
    this.props.fetchContractForBooking(this.props.offerId, this.props.company);
  }

  fetchConsumerPaymentPack = () => {
    this.props.fetchConsumerPaymentPackForBooking(this.props.offerId, {
      onSuccess: (cppList) => {
        const ids = cppList.map((cpp) => cpp.payment_pack);
        cppList.length === 0 && this.setState({ consumerPacksLoaded: true });
        this.props.fetchPaymentPackBulk(ids, {
          onSuccess: () => this.setState({ consumerPacksLoaded: true }),
        });
      },
    });
  };

  fetchPaymentPack = () => {
    this.props.fetchPaymentPackForBooking(
      this.props.offerId,
      this.props.company,
      { onSuccess: () => this.setState({ paymentPacksLoaded: true }) },
    );
  };

  fetchComboPack = () => {
    if (this.props.company !== undefined) {
      this.props.fetchPaymentComboForBooking(
        this.props.company,
        this.props.offerId,
        {
          onSuccess: (comboList: PaymentCombo[]) => {
            const ids = flatten(
              comboList.map((pc) => pc.payment_packs.map((pp) => pp.id)),
            );
            comboList.length === 0 &&
              this.setState({ paymentComboPacksLoaded: true });
            this.props.fetchPaymentPackBulk(ids, {
              onSuccess: () => this.setState({ paymentComboPacksLoaded: true }),
            });
          },
        },
      );
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.company !== this.props.company) {
      this.fetchPaymentPack();
      this.fetchComboPack();
      this.props.fetchContractForBooking(
        this.props.offerId,
        this.props.company,
      );
    }
  }

  requestSetupIntentSecret = () => {
    return this.props.requestSetupIntentSecret(this.props.offer.company);
  };

  render() {
    const { classes, t, offerStatus } = this.props;

    if (offerStatus && this.props.offer && this.props.offer.meta_activity) {
      const isBookable =
        offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
      const isWaitingList =
        offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
        offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_CONVERTIBLE;

      let message = t('booking:bookingModule.offer.isTooLate');
      let TheIcon = BlockIcon;

      if (
        offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON
      ) {
        const date = moment(this.props.offer.date_start)
          .tz(this.props.offer.timezone_name)
          .subtract(this.props.offer.meta_activity.first_booking_minutes_until)
          .format('LL');
        message = t('booking:bookingModule.offer.isTooSoon', { date });
        TheIcon = HourglassEmptyIcon;
      }
      if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL) {
        if (
          offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL
        ) {
          message = t('booking:bookingModule.offer.isWaitingListFull');
        } else if (
          offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED
        ) {
          message = t('booking:bookingModule.option.isAlreadyOnWaitingList');
          TheIcon = HourglassEmptyIcon;
        } else if (
          offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN
        ) {
          message = t('booking:bookingModule.option.waitingListOpen');
          TheIcon = HourglassEmptyIcon;
        }
      }

      if (!isBookable && !isWaitingList) {
        return (
          <div className={classes.cannotBookContainer}>
            <TheIcon className={classes.noItemIcon} />
            <Typography
              color="textSecondary"
              align="center"
              className={classes.canNotBookMessage}
            >
              {message}
            </Typography>
          </div>
        );
      }
    }

    if (
      !this.state.consumerPacksLoaded ||
      !this.state.paymentPacksLoaded ||
      !this.state.paymentComboPacksLoaded ||
      !this.props.offer ||
      !this.props.offer.meta_activity ||
      !offerStatus
    ) {
      return (
        <div className={classes.skeletonContainer}>
          <Skeleton animation="wave" width="40%" variant="text" height={30} />
          <Box mt={2} />
          <Skeleton animation="wave" width="100%" variant="rect" height={50} />
          <Box mt={2} />
          <Skeleton animation="wave" width="100%" variant="rect" height={50} />
          <Box mt={2} />
          <Skeleton animation="wave" width="100%" variant="rect" height={50} />
        </div>
      );
    }

    let bookableCount =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE ||
      (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
        offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_CONVERTIBLE)
        ? 1
        : 0;

    this.props.selectedOffers.forEach((offerData) => {
      if (
        this.props.offerStatusById[offerData.offer.id] &&
        this.props.offerStatusById[offerData.offer.id].bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE
      ) {
        bookableCount += 1;
      }
    });

    if (bookableCount === 0) {
      return null;
    }

    const availableConsumerPacks = this.props.getAvailableConsumerPack();
    const availablePaymentPacks = this.props.getAvailablePaymentPacks();
    const availableComboPacks = this.props.getAvailableComboPacks();

    return (
      <React.Fragment>
        <BookingMethodSelector
          offersConstraint={this.props.offersConstraint}
          selectedOffers={this.props.selectedOffers}
          selectedPack={this.props.selectedPack}
          onPackChange={this.props.onPackChange}
          availableConsumerPacks={availableConsumerPacks}
          availablePaymentPacks={availablePaymentPacks}
          availableComboPacks={availableComboPacks}
          contractList={this.props.contractList}
          onOpenSubscriptionModal={this.props.setOpenSubscriptionModal}
        />
        <SubscriptionContractBooking
          contract={this.props.openSubscriptionModal}
          companyId={this.props.offer && this.props.offer.company}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          onSubmit={() => {
            this.props.fetchConsumerPaymentPackForBooking(this.props.offerId);
            this.props.closeSubscripionModal();
          }}
          onCancel={this.props.closeSubscripionModal}
        />
      </React.Fragment>
    );
  }
}

const styles = (theme: Theme) => ({
  skeletonContainer: {
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(0),
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  titleContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  cannotBookContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    border: '1px solid #DEDEDE',
    borderRadius: 12,
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  noItemIcon: {
    fontSize: 160,
  },
  canNotBookMessage: {
    marginTop: theme.spacing(2),
    maxWidth: 500,
  },
});

const getAvailableConsumerPack = memoize(
  (
    offersConstraint: OfferConstraint,
    consumerPaymentPackList: ConsumerPaymentPack<PaymentPack>[],
    tz_name,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;
    return consumerPaymentPackList.filter((cpp) => {
      return (
        (cpp.payment_pack.unlimited || cpp.available_credits >= credit) &&
        moment(cpp.starting_date)
          .tz(tz_name)
          .isSameOrBefore(moment(minDate).tz(tz_name)) &&
        moment(cpp.ending_date)
          .tz(tz_name)
          .isSameOrAfter(moment(maxDate).tz(tz_name))
      );
    });
  },
);

const getAvailablePaymentPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentPackList: PaymentPack[],
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;

    return paymentPackList.filter((pp) => {
      const { start, end } = getPaymentPackTimeLimitation(pp, minDate);
      return (
        (pp.unlimited || pp.credits >= credit) &&
        start.tz(tz_name).isSameOrBefore(moment(minDate).tz(tz_name)) &&
        end.tz(tz_name).isSameOrAfter(moment(maxDate).tz(tz_name))
      );
    });
  },
);

const getAvailableComboPacks = memoize(
  (
    offersConstraint: OfferConstraint,
    paymentComboList: PaymentCombo[],
    tz_name: string,
  ) => {
    const { credit, minDate, maxDate } = offersConstraint;
    return paymentComboList.filter(
      (pc) =>
        !!pc.payment_packs
          .filter((pp) => !!pp.data)
          .find((ppForCombo) => {
            const { start, end } = getPaymentPackTimeLimitation(
              ppForCombo.data,
              minDate,
            );

            return (
              (ppForCombo.data.unlimited ||
                ppForCombo.data.credits >= credit) &&
              start.tz(tz_name).isSameOrBefore(moment(minDate).tz(tz_name)) &&
              end.tz(tz_name).isSameOrAfter(moment(maxDate).tz(tz_name))
            );
          }),
    );
  },
);

const mapHandlers = {
  requestSetupIntentSecret: () => (companyId) =>
    requestSetupIntentSecretAPI(null, companyId),
  getAvailableConsumerPack: (props: OwnAndConnectedProps) => () => {
    return getAvailableConsumerPack(
      props.offersConstraint,
      props.consumerPaymentPackList,
      props.offer.timezone_name,
    );
  },
  getAvailablePaymentPacks: (props: OwnAndConnectedProps) => () => {
    return getAvailablePaymentPacks(
      props.offersConstraint,
      props.paymentPackList,
      props.offer.timezone_name,
    );
  },
  getAvailableComboPacks: (props: OwnAndConnectedProps) => () => {
    return getAvailableComboPacks(
      props.offersConstraint,
      props.paymentComboList,
      props.offer.timezone_name,
    );
  },
  fetchContractForBooking: ({
    fetchContractForBooking,
    fetchPaymentPackBulk,
  }) => (offer, company) => {
    fetchContractForBooking(offer, company, {
      onSuccess: (contractList) =>
        fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
    });
  },
};

const mapStateToProps = (state: RootState) => ({
  consumerPaymentPackList: withPaymentPackForConsumer(
    getConsumerPaymentPackForBooking,
  )(state) as ConsumerPaymentPack<PaymentPack>[],
  paymentPackList: getPaymentPackForBooking(state) as PaymentPack[],
  paymentComboList: withPaymentPackForCombo(getPaymentComboForBooking)(
    state,
  ) as PaymentCombo[],
  offerStatusById: state.offer.offerStatus.byId,
  contractList: withPaymentPackForContract(getContractForBooking)(state),
});

const mapDispatchToProps = {
  fetchConsumerPaymentPackForBooking,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPaymentPackForBooking,
  fetchPaymentComboForBooking,
  fetchContractForBooking: fetchContractForBookingAction,
  resetContractForBooking: resetContractForBookingAction,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['paymentPack', 'booking']),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapHandlers),
  withStateHandlers(
    { openSubscriptionModal: null },
    {
      setOpenSubscriptionModal: () => (openSubscriptionModal) => {
        return {
          openSubscriptionModal,
        };
      },
      closeSubscripionModal: () => () => ({
        openSubscriptionModal: null,
      }),
    },
  ),
)(OfferState);
