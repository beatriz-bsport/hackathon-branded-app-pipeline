import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  Backdrop,
  Button,
  CircularProgress,
  Theme,
  Typography,
  Hidden,
  withStyles,
} from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import moment from 'moment';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_BOOKABLE,
} from '@bsport/common/lib/master-data/bookable-status';
import { RootState } from '../../../reducers';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';

import { registerToWaitingList as registerOption } from '../../../libs/waiting-list/actions';
import {
  getOfferById,
  withEstablishment,
  withCoach,
  getSimilars,
  withMetaActivity,
} from '../../../libs/offer/selectors';
import {
  fetchOfferStatus,
  fetchOfferStatusList,
  offerUserRegistration,
  fetchSimilarOffers,
  resetSimilarOffers,
  retrieveOffer as fetchOffer,
} from '../../../libs/offer/actions';
import {
  snackbarError as snackbarErrorAction,
  snackbarWarning as snackbarWarningAction,
} from '../../../actions/snackbar.actions';

import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { fetchMetaActivityBulk } from '../../../libs/meta-activity/actions';
import { fetchCoachBulk } from '../../../libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '../../../libs/establishment/actions';
import { MaterialStyleType } from '../../../utils/types';
import { Offer_FULL, Offer } from '../../../libs/offer/types';
import SimilarOffers from '../../../libs/booker-module/components/SimilarOfferSelector.component';
import BookerModuleHeader from '../../../libs/booker-module/components/BookerModuleHeader.component';
import OfferListSummary from '../../../libs/booker-module/components/OfferListSummary.component';

import { OfferData } from '../../../libs/booker-module/types';

import { ConsumerPaymentPack } from '../../../libs/consumer-payment-pack/types';
import { PaymentPack } from '../../../libs/payment-packs/types';
import { PaymentCombo } from '../../../libs/payment-combo/types';
import WidgetUtils from '../../../libs/widget/WidgetUtils';

import BookingMethodSelector from './BookingMethodSelector.container';

export type OfferConstraint = {
  credit: number;
  minDate?: string;
  maxDate?: string;
};

export type SelectedPack = {
  consumerPaymentPack?: ConsumerPaymentPack<PaymentPack> | null;
  paymentPackCombo?: PaymentCombo | null;
  paymentPack?: PaymentPack | null;
};

type OwnProps = { id: number };
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  showSimilarOffers: boolean;
  selectedOffers: OfferData[];
  offersConstraint: OfferConstraint;
  selectedPack: SelectedPack;
  showLoader: boolean;
};

const DATE_FORMAT = 'YYYY-MM-DD';

const SIMILAR_OFFER_PAGE_SIZE = 4;

class OfferBooking extends React.PureComponent<Props, State> {
  state: State = {
    showSimilarOffers: false,
    offersConstraint: {
      credit: 0,
    },
    selectedOffers: [],
    showLoader: false,
  };

  componentDidMount() {
    this.props.fetchOffer(this.props.id, {
      onSuccess: (o: any) => {
        this.props.fetchEstablishmentBulk([o.establishment]);
        this.props.fetchCoachBulk([o.coach, o.coach_override]);
        this.props.fetchMetaActivityBulk([o.meta_activity]);
        this.props.fetchOfferStatus(this.props.id, {
          onSuccess: this.setOfferConstraint,
        });
        this.setOfferConstraint();
      },
    });
  }

  setOfferConstraint = () => {
    if (this.props.offer && this.props.offerStatus) {
      let credit = 0;
      if (
        this.props.offerStatus &&
        this.props.offerStatus.bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE
      ) {
        credit = this.props.offer.credit_price;
        this.setState({
          offersConstraint: {
            credit,
            minDate: moment(this.props.offer.date_start).format(DATE_FORMAT),
            maxDate: moment(this.props.offer.date_start).format(DATE_FORMAT),
          },
        });
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedPack !== prevState.selectedPack &&
      !!prevState.selectedPack
    ) {
      const { selectedPack } = this.state;
      const {
        paymentPack,
        paymentPackCombo,
        consumerPaymentPack,
      } = selectedPack;
      const pass = paymentPack || paymentPackCombo || consumerPaymentPack;
      if (this.state.showSimilarOffers) {
        if (!pass) {
          this.props.snackbarError('bookerModule.pass.nothingAvailable');
        } else if (pass.name) {
          this.props.snackbarWarning('bookerModule.pass.changed', {
            name: pass.name,
          });
        }
      }
    }
  }

  onSelectOffer = (offer: Offer_FULL) => {
    const index = this.state.selectedOffers.findIndex(
      (offerData) => offerData.offer.id === offer.id,
    );

    this.setState((prevState: State) => {
      const selectedOffers = [...prevState.selectedOffers];
      index === -1
        ? selectedOffers.push({ offer, extra_data: {} })
        : selectedOffers.splice(index, 1);

      let credit = 0;
      if (
        this.props.offerStatus &&
        this.props.offerStatus.bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE
      ) {
        credit = this.props.offer.credit_price;
      }

      let minDate = moment(this.props.offer.date_start);
      let maxDate = minDate;

      const selectedBookable = selectedOffers.filter((o) => {
        const offerStatus = this.props.offerStatusById[o.offer.id];
        return offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
      });

      selectedBookable.forEach((offerData) => {
        credit += offerData.offer.credit_price;
        const dateStart = moment(offerData.offer.date_start);
        if (dateStart.isBefore(minDate)) {
          minDate = dateStart;
        }
        if (dateStart.isAfter(maxDate)) {
          maxDate = dateStart;
        }
      });

      return {
        selectedOffers,
        offersConstraint: {
          credit,
          minDate: minDate.format(DATE_FORMAT),
          maxDate: maxDate.format(DATE_FORMAT),
        },
      };
    });
  };

  showBookingButton = () => {
    const offerStatus = this.props.offerStatusById[this.props.id];

    if (!this.props.offer || !offerStatus) {
      return false;
    }

    const isBookable =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE ||
      (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
        offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_CONVERTIBLE);
    const isWaitingList =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
      offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;

    if (!isBookable && !isWaitingList) {
      return false;
    }

    let bookableCount = 0;
    [
      this.props.id,
      ...this.state.selectedOffers.map((offerData) => offerData.offer.id),
    ].forEach((id) => {
      if (
        this.props.offerStatusById[id] &&
        this.props.offerStatusById[id].bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE
      ) {
        bookableCount += 1;
      }
    });

    if (
      bookableCount > 0 &&
      !this.state.selectedPack?.consumerPaymentPack &&
      !this.state.selectedPack?.paymentPack &&
      !this.state.selectedPack?.paymentPackCombo
    ) {
      return false;
    }

    return true;
  };

  onClickWaitingList = (options) => {
    this.setState({ showLoader: true });
    this.props.registerOption(this.props.offer.id, null, {
      onSuccess: (...args) => {
        this.props.push(`/c/${this.props.offer.company}/`);
        this.setState({ showLoader: false });
        if (options && options.onSuccess) options.onSuccess(...args);
      },
      onError: (err) => {
        this.setState({ showLoader: false });
        if (options && options.onError) options.onError(err);
      },
    });
  };

  onClickBook = () => {
    this.setState({ showLoader: true });
    const data: any = {};
    if (this.state.selectedPack.consumerPaymentPack) {
      data.consumer_payment_pack = this.state.selectedPack.consumerPaymentPack.id;
    } else if (this.state.selectedPack.paymentPack) {
      data.payment_pack = this.state.selectedPack.paymentPack.id;
    } else if (this.state.selectedPack.paymentPackCombo) {
      data.payment_combo = this.state.selectedPack.paymentPackCombo.id;
    }

    const offers: { offer_id: number; extra_data: any }[] = [
      { offer_id: this.props.id, extra_data: {} },
    ];
    this.state.selectedOffers.forEach((offerData) => {
      offers.push({
        offer_id: offerData.offer.id,
        extra_data: offerData.extra_data,
      });
    });

    data.offers = offers;
    this.props.offerUserRegistration(data, {
      onSuccess: () => {
        if (WidgetUtils.isWidget()) {
          WidgetUtils.paymentSuccess();
        }

        this.setState({ showLoader: false });
        if (data.consumer_payment_pack) {
          this.props.push(
            `/c/${this.props.offer.company}/?from_direct_booking=${this.props.offer.id}`,
          );
        } else {
          this.props.push(`/checkout/${this.props.offer.company}/`);
        }
      },
      onError: () => {
        this.setState({ showLoader: false });
        this.props.snackbarError('bookerModule.book.unknowError');
      },
    });
  };

  fetchSimilarOffers = () => {
    this.props.offer &&
      this.props.nextSimilarOfferPage &&
      this.props.fetchSimilarOffers(
        this.props.offer.id,
        {
          wide: true,
          page: this.props.nextSimilarOfferPage,
          page_size: SIMILAR_OFFER_PAGE_SIZE,
        },
        {
          onSuccess: (offers: Offer[]) => {
            this.props.fetchMetaActivityBulk(
              offers.map((o) => o.meta_activity),
            );
            this.props.fetchEstablishmentBulk(
              offers.map((o) => o.establishment),
            );

            const coachesId = [
              ...offers.map((o) => o.coach),
              ...offers
                .filter((o) => typeof o.coach_override === 'number')
                .map((o) => o.coach_override),
            ];

            this.props.fetchCoachBulk(coachesId);
            this.props.fetchOfferStatusList(
              offers.map((o) => o.id),
              { page_size: SIMILAR_OFFER_PAGE_SIZE },
            );
          },
        },
      );
  };

  renderBookButton = () => {
    const { classes, t } = this.props;
    const selectedOffersCount = this.state.selectedOffers.length + 1;

    let price = '';
    if (this.state.selectedPack?.paymentPack) {
      price = t('paymentPack:specifications.price', {
        price: this.state.selectedPack.paymentPack.price,
      });
    } else if (this.state.selectedPack?.paymentPackCombo) {
      price = t('paymentPack:specifications.price', {
        price: this.state.selectedPack.paymentPackCombo.price,
      });
    }

    const isRegisteringForWaitingList = this.getIsRegisteringForWaitingList();

    return (
      <div className={classes.bookingButtonContainer}>
        <div className={classes.bookingButtonContainer2}>
          <Button
            onClick={
              isRegisteringForWaitingList
                ? this.onClickWaitingList
                : this.onClickBook
            }
            className={classes.bookingButton}
            variant="contained"
            color="primary"
          >
            {isRegisteringForWaitingList ? (
              <div className={classes.waitingListButtonContent}>
                <HourglassEmptyIcon className={classes.iconLeft} />
                <Typography variant="button" display="block">
                  {t('booking:offer.mainButton.registerWaitingList')}
                </Typography>
              </div>
            ) : (
              <div className={classes.bookingButtonContent}>
                <Typography variant="button" display="block">
                  {t('booking:offer.mainButton.book')}
                </Typography>
                <Typography variant="caption">
                  {t('booking:offer.mainButton.numberOfBook', {
                    count: selectedOffersCount,
                  })}
                </Typography>
              </div>
            )}
            {price && <div className={classes.bookingButtonPrice}>{price}</div>}
          </Button>
        </div>
      </div>
    );
  };

  getIsRegisteringForWaitingList = () => {
    return (
      this.props.offerStatus &&
      this.props.offerStatus.waiting_list_status ===
        OFFER_WAITING_LIST_STATUS_OPEN &&
      this.props.offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL
    );
  };

  render() {
    const { classes } = this.props;

    if (!this.props.offer) {
      return null;
    }

    return (
      <ConsumerAppBarContainer>
        <div className={classes.pageContainer}>
          <div className={classes.contentContainer}>
            <BookerModuleHeader offer={this.props.offer} />
            <Hidden mdUp>
              <div className={classes.inverseDivider1} />
            </Hidden>
            <div className={classes.responsiveContainer}>
              <div className={classes.offerContainer}>
                <OfferListSummary
                  offer={this.props.offer}
                  offerStatus={this.props.offerStatus}
                  onClickAddMoreOffer={
                    this.getIsRegisteringForWaitingList()
                      ? null
                      : () => {
                          this.setState({ showSimilarOffers: true });
                          this.fetchSimilarOffers();
                        }
                  }
                  onClickRemoveOffer={this.onSelectOffer}
                  selectedOffers={this.state.selectedOffers}
                  offerStatusById={this.props.offerStatusById}
                />
              </div>
              <Hidden mdUp>
                <div className={classes.inverseDivider2} />
              </Hidden>

              <div className={classes.packsContainer}>
                <BookingMethodSelector
                  offerId={this.props.id}
                  offer={this.props.offer}
                  company={this.props.offer.company}
                  offersConstraint={this.state.offersConstraint}
                  offerStatus={this.props.offerStatus}
                  selectedPack={this.state.selectedPack}
                  onPackChange={(selectedPack) =>
                    this.setState({ selectedPack })
                  }
                  selectedOffers={this.state.selectedOffers}
                />
                <div style={{ height: 100, width: '100%' }} />
                {this.showBookingButton() && this.renderBookButton()}
              </div>
            </div>
          </div>

          <SimilarOffers
            offer={this.props.offer}
            selectedOffers={this.state.selectedOffers}
            onSelectOffer={this.onSelectOffer}
            open={this.state.showSimilarOffers}
            onClose={() => this.setState({ showSimilarOffers: false })}
            similarOffers={this.props.similarOffers}
            loading={this.props.similarLoading}
            offerStatusById={this.props.offerStatusById}
            resetSimilarOffers={this.props.resetSimilarOffers}
            fetchSimilarOffers={this.fetchSimilarOffers}
            hasMoreSimilarOffer={this.props.hasMoreSimilarOffer}
          />

          <Backdrop
            className={classes.backdrop}
            open={this.state.showLoader}
            onClick={() => null}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme: Theme) => ({
  pageContainer: {
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    overflowY: 'auto',
    backgroundColor: 'white',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 1400,
      marginTop: theme.spacing(4),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  responsiveContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(8),
      flexDirection: 'row',
    },
  },
  offerContainer: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      flex: 1,
    },
  },
  packsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    [theme.breakpoints.up('md')]: {
      borderWidth: 0,
      marginLeft: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(4),
    },
  },
  bookingButtonContainer: {
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  bookingButtonContainer2: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  bookingButton: {
    width: '100%',
    height: 50,
    borderRadius: 0,
  },
  bookingButtonContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingListButtonContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingButtonPrice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    borderStyle: 'solid',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderColor: 'white',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  inverseDivider1: {
    height: 50,
    boxShadow: 'inset 0px 0px 10px 0px #DEDEDE',
    backgroundColor: '#F8F8F8',
    marginLeft: -10,
    marginRight: -20,
    marginTop: 10,
  },
  inverseDivider2: {
    height: 50,
    boxShadow: 'inset 0px 0px 10px 0px #DEDEDE',
    backgroundColor: '#F8F8F8',
    marginLeft: -10,
    marginRight: -20,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  offer: withMetaActivity(withCoach(withEstablishment(getOfferById)))(
    state,
    props.id,
  ) as Offer_FULL,
  offerStatus: state.offer.offerStatus.byId[props.id],
  offerStatusById: state.offer.offerStatus.byId,
  similarOffers: withMetaActivity(withCoach(withEstablishment(getSimilars)))(
    state,
  ) as Offer_FULL[],
  similarLoading: state.offer.similarOffers.loading,
  hasMoreSimilarOffer: !!state.offer.similarOffers.next_page,
  nextSimilarOfferPage: state.offer.similarOffers.next_page,
});

const mapDispatchToProps = {
  fetchOffer,
  fetchEstablishmentBulk,
  fetchCoachBulk,
  fetchMetaActivityBulk,
  fetchOfferStatus,
  offerUserRegistration,
  push,
  fetchSimilarOffers,
  resetSimilarOffers,
  goToUserSpace: (id) => push(`/c/${id}/`),
  snackbarError: snackbarErrorAction,
  snackbarWarning: snackbarWarningAction,
  registerOption,
  fetchOfferStatusList,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking']),
  routerParamsToProps({ id: 'id:number' }),
  connect(mapStateToProps, mapDispatchToProps),
)(OfferBooking);
