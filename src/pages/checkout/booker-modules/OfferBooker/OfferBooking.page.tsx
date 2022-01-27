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
import BlockIcon from '@material-ui/icons/Block';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import {
  getOfferContraints,
  getOfferFeature,
  getMainOfferNotBookableReason,
  getCanIBook,
} from '@bsport/common/lib/master-data/available-payment';

import Analytics from '#components/analytics/Analytics.component';

import { RootState } from '../../../../reducers';
import ConsumerAppBarContainer from '../../ConsumerAppBar.container';

import themeSelectors, {
  getCurrencyDisplayWithPrice,
} from '#libs/theme/selectors';

import {
  getOfferById,
  withEstablishment,
  withCoach,
  getSimilars,
  withMetaActivity,
} from '#libs/offer/selectors';
import {
  fetchOfferStatusList,
  offerUserRegistration,
  fetchSimilarOffers,
  resetSimilarOffers,
  retrieveOffer as fetchOffer,
} from '#libs/offer/actions';
import {
  snackbarError as snackbarErrorAction,
  snackbarWarning as snackbarWarningAction,
} from '../../../../libs/snackbar/actions';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { fetchMetaActivityBulk } from '#libs/meta-activity/actions';
import { fetchCoachBulk } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#libs/establishment/actions';
import { MaterialStyleType } from '../../../../utils/types';
import { Offer_FULL, Offer } from '#libs/offer/types';
import SimilarOffers from '#libs/booker-module/components/SimilarOfferSelector.component';
import BookerModuleHeader from '#libs/booker-module/components/BookerModuleHeader.component';
import OfferListSummary from '#libs/booker-module/components/OfferListSummary.component';

import { getMyRelatedMemberList } from '#libs/relationship/selectors';
import { fetchMyRelatedMemberList } from '#libs/relationship/actions';

import BookingMethodSelector from './BookingMethodSelector.container';
import {
  OfferData,
  SelectedPack,
  OfferConstraint,
} from '#libs/booker-module/types';
import { MemberMinimal } from '#libs/member/types';
import {
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#libs/spot-scheduling/actions';
import { getAssetByBlueprintByIdentifier } from '#libs/spot-scheduling/selector';

import OfferSpotSelector from './OfferSpotSelector';

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
  selectedMember?: MemberMinimal;
  showSpotSelector: boolean;
};

const SIMILAR_OFFER_PAGE_SIZE = 7;

class OfferBooking extends React.PureComponent<Props, State> {
  state: State = {
    showSimilarOffers: false,
    selectedPack: {},
    offersConstraint: {
      credit: 0,
    },
    selectedOffers: [],
    showLoader: false,
    showSpotSelector: false,
  };

  componentDidMount() {
    this.props.fetchOffer(this.props.id, {
      onSuccess: (o) => {
        this.props.fetchEstablishmentBulk([o.establishment]);
        this.props.fetchCoachBulk([o.coach, o.coach_override]);
        this.props.fetchMetaActivityBulk([o.meta_activity]);
        this.fetchOfferStatusList([o.id]);
        this.fetchSimilarOffers();
        this.props.fetchMyRelatedMemberList(o.company);
        if (o && !!o.room_blueprint) {
          this.props.fetchRoomBlueprintDetail(o.room_blueprint);
          this.props.fetchAssetForBlueprint({ blueprint: o.room_blueprint });
        }
        this.props.fetchMemberTagList(o.company);
      },
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.state.selectedPack !== prevState.selectedPack &&
      !!prevState.selectedPack
    ) {
      const { selectedPack } = this.state;
      const { paymentPack, paymentPackCombo, consumerPaymentPack } =
        selectedPack;
      const pass = paymentPack || paymentPackCombo || consumerPaymentPack;
      if (this.state.showSimilarOffers) {
        if (!pass) {
          this.props.snackbarError('bookerModule.pass.nothingAvailable');
        } else {
          this.props.snackbarWarning('bookerModule.pass.changed');
        }
      }
    }
  }

  openSimilarOfferSelector = () => {
    this.setState({ showSimilarOffers: true });
  };

  closeSimilarOfferSelector = () => {
    this.setState({ showSimilarOffers: false });
  };

  onClickRemoveOffer = (offer: Offer_FULL) => {
    this.setState(
      (prevState) => ({
        selectedOffers: prevState.selectedOffers.filter(
          (o) => !(o.offer.id === offer.id),
        ),
      }),
      this.updateOfferConstraints,
    );
  };

  updateOfferConstraints = () => {
    this.setState((prevState: State) => ({
      offersConstraint: getOfferContraints(
        this.props.offer,
        prevState.selectedOffers,
        this.props.offerStatusById,
      ),
    }));
  };

  onSelectOffer = (offer: Offer_FULL) => {
    if (
      this.state.selectedOffers.findIndex((o) => o.offer.id === offer.id) !== -1
    ) {
      return;
    }
    this.setState(
      (prevState: State) => ({
        selectedOffers: [
          ...prevState.selectedOffers,
          { offer, extra_data: {} },
        ],
      }),
      this.updateOfferConstraints,
    );
  };

  showBookingButton = () => {
    const { areBookable, areWaitingList } = getCanIBook(
      this.props.offerStatusById,
      this.props.offer,
      this.state.selectedOffers,
      this.state.selectedPack,
      this.props.theme.accept_double_booking,
    );
    return areBookable || areWaitingList;
  };

  onClickBook = () => {
    let showSpotSelector = false;

    if (
      this.props.offer &&
      typeof this.props.offer.room_blueprint === 'number' &&
      !getOfferFeature(
        this.props.offer,
        this.props.offerStatusById,
        this.props.theme.accept_double_booking,
      ).isWaitingList
    ) {
      showSpotSelector = true;
    }

    this.state.selectedOffers.forEach((offerData) => {
      if (
        typeof offerData.offer.room_blueprint === 'number' &&
        !getOfferFeature(
          offerData.offer,
          this.props.offerStatusById,
          this.props.theme.accept_double_booking,
        ).isWaitingList
      ) {
        showSpotSelector = true;
      }
    });

    if (showSpotSelector) {
      this.setState({ showSpotSelector: true });
      return;
    }

    this.bookOffers();
  };

  bookOffers = (selectedSpot?: { offer: number; spot: number }[]) => {
    this.setState({ showLoader: true });
    const data: any = {};
    if (this.state.selectedPack.consumerPaymentPack) {
      data.consumer_payment_pack =
        this.state.selectedPack.consumerPaymentPack.id;
    } else if (this.state.selectedPack.paymentPack) {
      data.payment_pack = this.state.selectedPack.paymentPack.id;
      Analytics.addPassToCart(this.state.selectedPack.paymentPack);
    } else if (this.state.selectedPack.paymentPackCombo) {
      data.payment_combo = this.state.selectedPack.paymentPackCombo.id;
      Analytics.addPackToCart(this.state.selectedPack.paymentPackCombo);
    }

    data.offers = [
      { offer: this.props.offer, extra_data: {} },
      ...this.state.selectedOffers,
    ]
      .filter(
        (offerData) =>
          getOfferFeature(
            offerData.offer,
            this.props.offerStatusById,
            this.props.theme.accept_double_booking,
          ).isBookable,
      )
      .map((offerData) => {
        const _data = {
          offer_id: offerData.offer.id,
          extra_data: {
            ...(offerData.extra_data || {}),
            booking_for_member: this.state.selectedMember
              ? this.state.selectedMember.id
              : null,
          },
        };

        if (selectedSpot) {
          const spotForOffer = selectedSpot.find(
            (current) => current.offer === offerData.offer.id,
          );

          if (spotForOffer) {
            _data.extra_data.spot_id = spotForOffer.spot;
          }
        }

        return _data;
      });

    data.waiting_list = [
      { offer: this.props.offer, extra_data: {} },
      ...this.state.selectedOffers,
    ]
      .filter(
        (offerData) =>
          getOfferFeature(
            offerData.offer,
            this.props.offerStatusById,
            this.props.theme.accept_double_booking,
          ).isWaitingList,
      )
      .map((offerData) => ({
        offer_id: offerData.offer.id,
        extra_data: {
          ...(offerData.extra_data || {}),
          booking_for_member: this.state.selectedMember
            ? this.state.selectedMember.id
            : null,
        },
      }));

    this.props.offerUserRegistration(data, {
      onSuccess: (responseData: any) => {
        this.setState({ showLoader: false });
        if (data.consumer_payment_pack || !data.offers.length) {
          this.props.push(
            `/checkout/${
              this.props.offer.company
            }/validation/?basket=null&user_registration_response=${encodeURIComponent(
              JSON.stringify(responseData),
            )}`,
          );
        } else {
          this.props.push(
            `/checkout/${
              this.props.offer.company
            }/?user_registration_response=${encodeURIComponent(
              JSON.stringify(responseData),
            )}`,
          );
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
            if (offers && offers.length) {
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
              this.fetchOfferStatusList(offers.map((o) => o.id));

              const roomBlueprintIds = new Set();
              offers.forEach((o) => {
                if (typeof o.room_blueprint === 'number') {
                  roomBlueprintIds.add(o.room_blueprint);
                }
              });

              roomBlueprintIds.forEach((blueprint: number) => {
                this.props.fetchRoomBlueprintDetail(blueprint);
                this.props.fetchAssetForBlueprint({ blueprint });
              });
            }
          },
        },
      );
  };

  fetchOfferStatusList = (offerIds: number[]) => {
    if (offerIds && offerIds.length) {
      this.props.fetchOfferStatusList(
        offerIds,
        {
          page_size: SIMILAR_OFFER_PAGE_SIZE,
          ...(this.state.selectedMember
            ? { booking_for_member: this.state.selectedMember.id }
            : {}),
        },
        { onSuccess: this.updateOfferConstraints },
      );
    } else {
      this.updateOfferConstraints();
    }
  };

  selectMember = (selectedMemberId?: number) => {
    this.setState(
      {
        selectedOffers: [],
        selectedMember: selectedMemberId
          ? this.props.relatedMemberList.find(
              (m: MemberMinimal) => m.id === selectedMemberId,
            )
          : null,
      },
      () => {
        this.fetchOfferStatusList([
          this.props.offer.id,
          ...(this.props.similarOffers || []).map((o) => o.id),
        ]);
      },
    );
  };

  renderBookButton = () => {
    const { classes, t } = this.props;
    const selectedOffersCount = this.state.selectedOffers.length + 1;

    let price = '';
    if (this.state.selectedPack?.paymentPack) {
      price = getCurrencyDisplayWithPrice(
        (
          Math.round(this.state.selectedPack.paymentPack.price * 100) / 100
        ).toFixed(2),
      );
    } else if (this.state.selectedPack?.paymentPackCombo) {
      price = getCurrencyDisplayWithPrice(
        (
          Math.round(this.state.selectedPack.paymentPackCombo.price * 100) / 100
        ).toFixed(2),
      );
    }

    const isRegisteringForWaitingList = this.getIsRegisteringForWaitingList();

    return (
      <div className={classes.bookingButtonContainer}>
        <Button
          onClick={this.onClickBook}
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
    );
  };

  getIsRegisteringForWaitingList = () => {
    const { areBookable, areWaitingList } = getCanIBook(
      this.props.offerStatusById,
      this.props.offer,
      this.props.offer ? [{ offer: this.props.offer }] : [],
      this.state.selectedPack,
      this.props.theme.accept_double_booking,
    );
    return areWaitingList && !areBookable;
  };

  onSubmitSpot = (selectedSpot: { offer: number; spot: number }[]) => {
    this.bookOffers(selectedSpot);
    this.setState({ showSpotSelector: false });
  };

  renderBookingMethodSelector = () => {
    const offerStatus = this.props.offerStatusById[this.props.offer.id];

    const {
      isBookable,
      isWaitingList,
      loading,
      isRegistered,
      isRegisteredWaitingList,
    } = getOfferFeature(
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
    );

    if (
      !loading &&
      !isBookable &&
      this.props.offer &&
      this.props.offer.meta_activity
    ) {
      const { message, icon } = getMainOfferNotBookableReason(
        this.props.offer,
        offerStatus,
        {
          isBookable,
          isWaitingList,
          isRegistered,
          isRegisteredWaitingList,
        },
        this.props.t,
      );
      let TheIcon = BlockIcon;
      if (icon === 'wait') TheIcon = HourglassEmptyIcon;
      if (icon === 'block') TheIcon = BlockIcon;
      return (
        <div className={this.props.classes.cannotBookContainer}>
          <TheIcon className={this.props.classes.noItemIcon} />
          <Typography
            color="textSecondary"
            align="center"
            className={this.props.classes.canNotBookMessage}
          >
            {message}
          </Typography>
        </div>
      );
    }
    return (
      <BookingMethodSelector
        offerId={this.props.id}
        offer={this.props.offer}
        company={this.props.offer.company}
        offersConstraint={this.state.offersConstraint}
        offerStatus={offerStatus}
        selectedPack={this.state.selectedPack}
        onPackChange={(selectedPack) => this.setState({ selectedPack })}
        selectedOffers={this.state.selectedOffers}
        loading={
          loading || !this.props.offer || !this.props.offer.meta_activity
        }
      />
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
            <BookerModuleHeader
              offer={this.props.offer}
              hideCoach={this.props.theme.hideCoach}
            />
            <Hidden mdUp>
              <div className={classes.inverseDivider1} />
            </Hidden>
            <div className={classes.responsiveContainer}>
              <div className={classes.offerGroupContainer}>
                <div className={classes.offerContainer}>
                  <OfferListSummary
                    offer={this.props.offer}
                    offerStatus={this.props.offerStatusById[this.props.id]}
                    member={this.state.selectedMember}
                    onSelectMember={this.selectMember}
                    relatedMemberList={this.props.relatedMemberList}
                    onClickAddMoreOffer={
                      this.showBookingButton() &&
                      !this.getIsRegisteringForWaitingList()
                        ? () => this.openSimilarOfferSelector()
                        : null
                    }
                    onClickRemoveOffer={this.onClickRemoveOffer}
                    selectedOffers={this.state.selectedOffers}
                    offerStatusById={this.props.offerStatusById}
                    hideCoach={this.props.theme.hideCoach}
                    acceptDoubleBooking={this.props.theme.accept_double_booking}
                  />
                </div>
              </div>

              <Hidden mdUp>
                <div className={classes.inverseDivider2} />
              </Hidden>

              <div className={classes.packsContainer}>
                {this.renderBookingMethodSelector()}
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
            onClose={this.closeSimilarOfferSelector}
            hideCoach={this.props.theme.hideCoach}
            similarOffers={this.props.similarOffers}
            loading={this.props.similarLoading}
            offerStatusById={this.props.offerStatusById}
            resetSimilarOffers={this.props.resetSimilarOffers}
            onClickShowMore={this.fetchSimilarOffers}
            hasMoreSimilarOffer={this.props.hasMoreSimilarOffer}
            acceptDoubleBooking={this.props.theme.accept_double_booking}
          />

          {this.state.showSpotSelector && (
            <OfferSpotSelector
              offer={this.props.offer}
              refreshOfferStatus={(id) => this.fetchOfferStatusList([id])}
              selectedOffer={this.state.selectedOffers.filter(
                (offerData) =>
                  typeof offerData.offer.room_blueprint === 'number' &&
                  !getOfferFeature(
                    offerData.offer,
                    this.props.offerStatusById,
                    this.props.theme.accept_double_booking,
                  ).isWaitingList,
              )}
              roomBlueprintsById={this.props.roomBlueprintsById}
              assetByIdBlueprintByIdentifier={
                this.props.assetByIdBlueprintByIdentifier
              }
              onCancel={() => this.setState({ showSpotSelector: false })}
              offerStatusById={this.props.offerStatusById}
              onSubmit={this.onSubmitSpot}
            />
          )}

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
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(3),
    },
  },
  contentContainer: {
    width: '100%',
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
    paddingBottom: 'calc(2 * env(safe-area-inset-bottom))',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      paddingBottom: 0,
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
  offerGroupContainer: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      flex: 1,
    },
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  canNotBookMessage: {
    marginTop: theme.spacing(2),
    maxWidth: 500,
  },
  noItemIcon: {
    fontSize: 160,
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
});

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  offer: withMetaActivity(withCoach(withEstablishment(getOfferById)))(
    state,
    props.id,
  ) as Offer_FULL,
  offerStatusById: state.offer.offerStatus.byId,
  similarOffers: withMetaActivity(withCoach(withEstablishment(getSimilars)))(
    state,
  ) as Offer_FULL[],
  similarLoading: state.offer.similarOffers.loading,
  hasMoreSimilarOffer: !!state.offer.similarOffers.next_page,
  nextSimilarOfferPage: state.offer.similarOffers.next_page,
  relatedMemberList: getMyRelatedMemberList(state),
  theme: themeSelectors.getTheme(state),
  roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
  assetByIdBlueprintByIdentifier: getAssetByBlueprintByIdentifier(state),
});

const mapDispatchToProps = {
  fetchOffer,
  fetchEstablishmentBulk,
  fetchCoachBulk,
  fetchMyRelatedMemberList,
  fetchMetaActivityBulk,
  offerUserRegistration,
  push,
  fetchSimilarOffers,
  resetSimilarOffers,
  goToUserSpace: (id: number) => push(`/c/${id}/`),
  snackbarError: snackbarErrorAction,
  snackbarWarning: snackbarWarningAction,
  fetchOfferStatusList,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking']),
  routerParamsToProps({ id: 'id:number' }),
  connect(mapStateToProps, mapDispatchToProps),
)(OfferBooking);
