import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { Box, Theme, withStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { WithTranslation, withTranslation } from 'react-i18next';
import flatten from 'lodash/flatten';

import { OFFER_WAITING_LIST_STATUS_CONVERTIBLE } from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
} from '@bsport/common/lib/master-data/bookable-status';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../../libs/payment/api';
import { Offer_FULL, OfferStatus } from '../../../libs/offer/types';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
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
import {
  fetchConsumerPaymentPackForBooking,
  fetchConsumerPaymentPackMaxoutBooking,
} from '../../../libs/consumer-payment-pack/actions';
import BookingMethodSelector from '../../../libs/booker-module/components/BookingMethodSelector.component';
import {
  getAvailableConsumerPack,
  getAvailablePaymentPacks,
  getAvailableComboPacks,
  OfferConstraint,
  SelectedPack,
} from '../../../libs/booker-module/utils';

import SubscriptionContractBooking from '../SubscriptionBooking.component';

import {
  fetchContractForBooking as fetchContractForBookingAction,
  resetContractForBooking as resetContractForBookingAction,
} from '../../../libs/subscription/actions';
import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '../../../libs/subscription/selectors';
import { OfferData } from '../../../libs/booker-module/types';

type OwnProps = {
  offerId: number;
  offer?: Offer_FULL;
  offerStatus?: OfferStatus;
  company?: number;
  selectedOffers: OfferData[];
  offersConstraint?: OfferConstraint;
  loading: boolean;
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
  consumerPacksMaxoutLoaded: boolean;
  paymentPacksLoaded: boolean;
  paymentComboPacksLoaded: boolean;
};

export class OfferState extends React.PureComponent<Props, State> {
  state: State = {
    consumerPacksLoaded: false,
    paymentComboPacksLoaded: false,
    paymentPacksLoaded: false,
    consumerPacksMaxoutLoaded: false,
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
        const cpp_ids = cppList.map((cpp) => cpp.id);
        const pp_ids = cppList.map((cpp) => cpp.payment_pack);
        cppList.length === 0 &&
          this.setState({
            consumerPacksLoaded: true,
            consumerPacksMaxoutLoaded: true,
          });

        this.props.fetchPaymentPackBulk(pp_ids, {
          onSuccess: () => {
            this.setState({ consumerPacksLoaded: true });
          },
        });
        this.props.fetchConsumerPaymentPackMaxoutBooking(cpp_ids, {
          onSuccess: () => this.setState({ consumerPacksMaxoutLoaded: true }),
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

  renderLoadingBlock = () => {
    const { classes } = this.props;
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
  };

  render() {
    const { offerStatus, loading } = this.props;
    if (
      loading ||
      !this.state.consumerPacksLoaded ||
      !this.state.paymentPacksLoaded ||
      !this.state.consumerPacksMaxoutLoaded ||
      !this.state.paymentComboPacksLoaded
    ) {
      return this.renderLoadingBlock();
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
});

const mapHandlers = {
  requestSetupIntentSecret: () => (companyId: number) =>
    requestSetupIntentSecretAPI(null, companyId),
  getAvailableConsumerPack: (props: OwnAndConnectedProps) => () => {
    return getAvailableConsumerPack(
      props.offersConstraint,
      props.consumerPaymentPackList,
      props.cppMaxoutBookings,
      props.selectedOffers.map((data) => data.offer),
      props.offer,
      props.offer.timezone_name,
    );
  },
  getAvailablePaymentPacks: (props: OwnAndConnectedProps) => () => {
    return getAvailablePaymentPacks(
      props.offersConstraint,
      props.paymentPackList,
      props.selectedOffers.map((data) => data.offer),
      props.offer,
      props.offer.timezone_name,
    );
  },
  getAvailableComboPacks: (props: OwnAndConnectedProps) => () => {
    return getAvailableComboPacks(
      props.offersConstraint,
      props.paymentComboList,
      props.selectedOffers,
      props.offer,
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
  cppMaxoutBookings: state.consumerPaymentPack.maxout_booking.byId,
  paymentPacksById: state.paymentPack.byId,
});

const mapDispatchToProps = {
  fetchConsumerPaymentPackForBooking,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPaymentPackForBooking,
  fetchPaymentComboForBooking,
  fetchContractForBooking: fetchContractForBookingAction,
  resetContractForBooking: resetContractForBookingAction,
  fetchConsumerPaymentPackMaxoutBooking,
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
