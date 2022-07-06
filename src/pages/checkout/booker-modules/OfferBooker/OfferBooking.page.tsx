import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push as pushAction } from 'connected-react-router';
import moment from 'moment-timezone';

import {
  Backdrop,
  CircularProgress,
  Theme,
  Typography,
  Hidden,
  withStyles,
  LinearProgress,
} from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import BlockIcon from '@material-ui/icons/Block';
import {
  getOfferContraints,
  getOfferFeature,
  getMainOfferNotBookableReason,
  getCanIBook,
} from '@bsport/common/lib/master-data/available-payment';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import withQueryParams from '#hocs/with-query-params.hoc';
import WidgetUtils from '../../../../libs/widget/WidgetUtils';
import { WithHandlerType, MaterialStyleType } from '../../../../utils/types';

import Analytics from '#components/analytics/Analytics.component';
import withTheme from '#hocs/company-themifier.hoc';
import { RootState } from '../../../../reducers';
import ConsumerAppBarContainer from '../../ConsumerAppBar.container';

import { urlToMarketplace } from '../../../../libs/marketplace/utils';
import themeSelectors from '#libs/theme/selectors';
import { buildUrlParams } from '../../../../http';

import {
  getOfferById,
  withEstablishment,
  withCoach,
  getSimilars,
  withMetaActivity,
  getOffersListByGroup,
  withBookableStatus,
  getBookingGuestNumberLeft,
} from '#libs/offer/selectors';
import {
  fetchOfferStatusList,
  fetchOfferStatus as fetchOfferStatusAction,
  offerUserRegistration,
  fetchSimilarOffers,
  resetSimilarOffers,
  retrieveOffer as fetchOffer,
  fetchOffersInGroup as fetchOffersInGroupAction,
  fetchBookingGuestNumber as fetchBookingGuestNumberAction,
} from '#libs/offer/actions';
import {
  snackbarError as snackbarErrorAction,
  snackbarWarning as snackbarWarningAction,
} from '../../../../libs/snackbar/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { fetchMetaActivityBulk } from '#libs/meta-activity/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#libs/group-offer/actions';
import { fetchCoachBulk } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#libs/establishment/actions';
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
  AdditionalGuest,
} from '#libs/booker-module/types';
import { MemberMinimal } from '#libs/member/types';
import {
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#libs/spot-scheduling/actions';
import { getAssetByBlueprintByIdentifier } from '#libs/spot-scheduling/selector';

import OfferSpotSelector from './OfferSpotSelector';
import BookButton from '#libs/booker-module/components/BookButton.components';
import { withGroup } from '#libs/group-offer/selectors';

type OwnProps = { id: number };
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation;

type State = {
  showSimilarOffers: boolean;
  selectedOffers: OfferData[];
  additionalGuestList: Array<AdditionalGuest>;
  offersConstraint: OfferConstraint;
  selectedPack: SelectedPack;
  showLoader: boolean;
  selectedMember?: MemberMinimal;
  hasInitShowSpotSelector: boolean;
  blockByGroup: boolean;
  packAllowsBookingForAGuest: boolean;
  guestMaxNumberOverAllPacks: number;
  spotsForOffers: { [offerId: number]: number };
  offersWaitingForSpotSelection: Array<Offer_FULL>;
};

const SIMILAR_OFFER_PAGE_SIZE = 7;

class OfferBooking extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showSimilarOffers: false,
      selectedPack: {},
      offersConstraint: {
        credit: 0,
      },
      selectedOffers: [],
      additionalGuestList: [],
      showLoader: false,
      hasInitShowSpotSelector: false,
      blockByGroup: false,
      packAllowsBookingForAGuest: false,
      guestMaxNumberOverAllPacks: 0,
      spotsForOffers: {},
      offersWaitingForSpotSelection: [],
    };
  }

  componentDidMount() {
    this.props.fetchOffer(this.props.id, {
      onSuccess: (o) => {
        this.props.fetchMetaActivityBulk([o.meta_activity]);
        this.props.fetchMyRelatedMemberList(o.company);
        this.props.fetchCompanyTheme(o.company);
        this.props.fetchBookingGuestNumber(o.id);

        if (o.group !== null) {
          this.props.fetchGroup(o.group, {
            onSuccess: (group) => {
              this.props.fetchOfferStatusList(group.offers, {
                page_size: group.offers.length,
              });
            },
          });

          this.props.fetchOffersInGroup(o.group, {
            onSuccess: (offers) => {
              this.props.fetchCoachBulk(
                Array.from(
                  new Set(
                    offers.flatMap((offer) => [
                      offer.coach,
                      offer.coach_override,
                    ]),
                  ),
                ).filter((c) => !!c),
              );

              this.props.fetchEstablishmentBulk(
                Array.from(new Set(offers.map((offer) => offer.establishment))),
              );

              const roomBlueprintIds = new Set(
                offers
                  .filter((offer) => offer.room_blueprint)
                  .map((offer) => offer.room_blueprint),
              );
              roomBlueprintIds.forEach((blueprint: number) => {
                this.props.fetchRoomBlueprintDetail(blueprint);
                this.props.fetchAssetForBlueprint({ blueprint });
              });
            },
          });

          return;
        }

        this.props.fetchEstablishmentBulk([o.establishment]);
        this.props.fetchCoachBulk([o.coach, o.coach_override]);
        this.props.fetchOfferStatus(
          o.id,
          {},
          {
            onSuccess: this.updateOfferConstraints,
          },
        );
        this.fetchSimilarOffers();

        if (o && !!o.room_blueprint) {
          this.props.fetchRoomBlueprintDetail(o.room_blueprint);
          this.props.fetchAssetForBlueprint({ blueprint: o.room_blueprint });
        }
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

    // init for offer in groups
    if (
      prevProps.similarOfferGroupsLoading !==
        this.props.similarOfferGroupsLoading &&
      this.props.offer.group &&
      this.props.similarOfferGroupsLoading === false
    ) {
      const group = this.props.offer.group;
      const offers = this.props.similarOfferGroups.filter(
        (o) => o.id !== this.props.id,
      );

      // Block all or nothing group if not all
      if (
        group.full_booking_only &&
        !group.allow_booking_after_start &&
        offers.some((offer) => {
          if (offer.tot_slots === 0) return false;

          return (
            offer.bookableStatus?.bookable_status !==
              OFFER_BOOKABLE_STATUS_BOOKABLE ||
            offer.bookableStatus.blocked_by_tags
          );
        })
      ) {
        this.setState({
          blockByGroup: true,
        });
        return;
      }

      // Block all or nothing group with potential if not partail all
      if (
        group.full_booking_only &&
        group.allow_booking_after_start &&
        offers
          .filter((co) => moment(co.date_start).isAfter(moment()))
          .some((offer) => {
            if (offer.tot_slots === 0) return false;
            return (
              !offer.bookableStatus ||
              offer.bookableStatus?.bookable_status !==
                OFFER_BOOKABLE_STATUS_BOOKABLE ||
              offer.bookableStatus.blocked_by_tags
            );
          })
      ) {
        this.setState({
          blockByGroup: true,
        });
        return;
      }

      const offersToAdd = offers.filter(
        (offer) =>
          !offer.bookableStatus?.blocked_by_tags &&
          (offer.bookableStatus?.bookable_status ===
            OFFER_BOOKABLE_STATUS_BOOKABLE ||
            offer.bookableStatus?.waiting_list_status ===
              OFFER_BOOKABLE_STATUS_BOOKABLE),
      );

      this.setState(
        () => ({
          selectedOffers: [
            ...offersToAdd.map((offer) => ({
              offer,
              extra_data: {
                protected: group.full_booking_only,
              },
            })),
          ],
        }),
        this.updateOfferConstraints,
      );
    }

    // Spot Scheduling: must wait until some props are done loading
    // before determining if we should open the spot selector
    if (
      !this.state.hasInitShowSpotSelector &&
      !this.props.offerLoading &&
      !this.props.similarOfferGroupsLoading &&
      !this.props.offerStatusLoading &&
      this.props.theme
    ) {
      this.updateOffersWaitingForSpotSelection();
      this.setState({ hasInitShowSpotSelector: true });
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
      (prevState) => {
        const newSpotsForOffer = { ...prevState.spotsForOffers };
        delete newSpotsForOffer[offer.id];
        return {
          selectedOffers: prevState.selectedOffers.filter(
            (o) => !(o.offer.id === offer.id),
          ),
          spotsForOffers: newSpotsForOffer,
        };
      },
      () => {
        this.updateOfferConstraints();
        this.updateOffersWaitingForSpotSelection();
      },
    );
  };

  updateOfferConstraints = () => {
    this.setState((prevState: State) => {
      return {
        offersConstraint: getOfferContraints(
          this.props.offer,
          prevState.selectedOffers,
          this.props.offerStatusById,
          (prevState.additionalGuestList || []).length || 0,
        ),
      };
    });
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
      () => {
        this.updateOfferConstraints();
        this.updateOffersWaitingForSpotSelection();
      },
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
    const blockedByTags =
      this.props.offerStatusById[this.props?.id]?.blocked_by_tags;
    return (
      !blockedByTags &&
      (areBookable || areWaitingList) &&
      !this.state.blockByGroup
    );
  };

  updateOffersWaitingForSpotSelection = () => {
    const allOffers: Array<Offer_FULL> = [
      this.props.offer,
      ...this.state.selectedOffers.map((offerData) => offerData.offer),
    ];

    const offersWaitingForSpotSelection = allOffers
      .filter((offer) => {
        const offerFeature = getOfferFeature(
          offer,
          this.props.offerStatusById,
          this.props.theme.accept_double_booking,
        );
        return (
          offer &&
          typeof offer.room_blueprint === 'number' &&
          !offerFeature.isWaitingList
        );
      })
      .filter(
        (offer) => !(typeof this.state.spotsForOffers[offer.id] === 'number'),
      )
      .sort((a, b) =>
        moment(a.date_start).isBefore(moment(b.date_start)) ? -1 : 1,
      );

    this.setState({ offersWaitingForSpotSelection });
  };

  updateSpotsForOffers = (offerId: number, spot: number) => {
    this.closeSimilarOfferSelector();
    this.setState((prevState) => {
      return {
        spotsForOffers: { ...prevState.spotsForOffers, [offerId]: spot },
      };
    }, this.updateOffersWaitingForSpotSelection);
  };

  onCancelSpotSelection = (offer: Offer_FULL) => {
    this.closeSimilarOfferSelector();
    if (
      (!!this.state.offersWaitingForSpotSelection.length &&
        this.state.offersWaitingForSpotSelection[0].id ===
          this.props.offer.id) ||
      !!this.props.offer.group
    ) {
      return () => {
        this.props.goToCalendar({
          date: moment(this.props.offer.date_start).format('YYYY-MM-DD'),
        });
      };
    }

    return () => {
      this.onClickRemoveOffer(offer);
    };
  };

  bookOffers = () => {
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
            additional_guest_info: this.state.packAllowsBookingForAGuest
              ? this.state.additionalGuestList
              : undefined,
            booking_for_member: this.state.selectedMember
              ? this.state.selectedMember.id
              : null,
          },
        };
        const spotForOffer = this.state.spotsForOffers[offerData.offer.id];

        if (typeof spotForOffer === 'number') {
          _data.extra_data.spot_id = spotForOffer;
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
            }/validation?basket=null&user_registration_response=${encodeURIComponent(
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

  renderBookingMethodSelector = () => {
    const offerStatus = this.props.offerStatusById[this.props.offer.id];

    const {
      isBookable,
      isWaitingList,
      loading,
      isRegistered,
      isRegisteredWaitingList,
      blockedByTags,
    } = getOfferFeature(
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
    );

    const offerIsReady =
      !loading && this.props.offer && this.props.offer.meta_activity;
    if (
      offerIsReady &&
      (!isBookable || this.state.blockByGroup || blockedByTags)
    ) {
      const { message, icon } = getMainOfferNotBookableReason(
        this.props.offer,
        offerStatus,
        {
          isBookable,
          isWaitingList,
          isRegistered,
          isRegisteredWaitingList,
          blockedByTags,
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
        isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
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
        setGuestMaxNumber={(maxNumber: number) =>
          this.setState({ guestMaxNumberOverAllPacks: maxNumber })
        }
      />
    );
  };

  addAdditionalGuest = (additionalGuest: AdditionalGuest) => {
    this.setState(
      (prevState) => ({
        additionalGuestList: [
          ...(prevState.additionalGuestList || []),
          additionalGuest,
        ],
      }),
      this.updateOfferConstraints,
    );
  };

  removeGuest = (idx: number) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        additionalGuestList: prevState.additionalGuestList.filter(
          (a, idx_) => idx_ !== idx,
        ),
      }),
      this.updateOfferConstraints,
    );
  };

  comboPackAllowsBookingForAGuest = (pack: SelectedPack) => {
    let maxComboGuest = 0;
    let comboAllowsGuest = false;
    if (pack?.paymentPackCombo) {
      pack.paymentPackCombo.payment_packs.forEach((item) => {
        if (item.data.allow_guest_pass) {
          comboAllowsGuest = true;
          if (item.data.credits > maxComboGuest)
            maxComboGuest = item.data.credits;
          if (item.data.unlimited) {
            maxComboGuest = this.props.theme.allow_guest_max_number;
          }
        }
      });
    }
    return { maxComboGuest, comboAllowsGuest };
  };

  render() {
    const { classes } = this.props;
    if (!this.props.offer || !this.props.theme) {
      return (
        <ConsumerAppBarContainer>
          <LinearProgress className={classes.loading} />
        </ConsumerAppBarContainer>
      );
    }

    const { maxComboGuest, comboAllowsGuest } =
      this.comboPackAllowsBookingForAGuest(this.state.selectedPack);

    this.setState((prevState: State) => ({
      packAllowsBookingForAGuest:
        prevState.selectedPack?.paymentPack?.allow_guest_pass ||
        prevState.selectedPack?.consumerPaymentPack?.payment_pack
          ?.allow_guest_pass ||
        (comboAllowsGuest &&
          prevState.additionalGuestList?.length + 1 <= maxComboGuest),
    }));

    const isRegisteringForWaitingList = this.getIsRegisteringForWaitingList();
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
                      !isRegisteringForWaitingList &&
                      this.openSimilarOfferSelector
                    }
                    onClickRemoveOffer={this.onClickRemoveOffer}
                    selectedOffers={this.state.selectedOffers}
                    offerStatusById={this.props.offerStatusById}
                    hideCoach={this.props.theme.hideCoach}
                    acceptDoubleBooking={this.props.theme.accept_double_booking}
                    isRegisteringForWaitingList={isRegisteringForWaitingList}
                    onRemoveGuest={this.removeGuest}
                    additionalGuestList={this.state.additionalGuestList}
                    onAddAdditionalGuest={
                      this.props.theme?.allow_guest_activatable &&
                      this.props.theme?.allow_guest &&
                      this.props.offer.allow_guest_offer &&
                      !this.props.offer.group
                        ? this.addAdditionalGuest
                        : null
                    }
                    numberBookingGuestLeft={this.props.bookingGuestNumberLeft}
                    showBookingButton={this.showBookingButton()}
                    packAllowsBookingGuest={
                      this.state.packAllowsBookingForAGuest
                    }
                    frequencyBookingGuest={
                      this.props.theme.allow_guest_frequency
                    }
                    maxGuestNumberFromAllPacks={
                      this.state.guestMaxNumberOverAllPacks
                    }
                    spotsForOffers={this.state.spotsForOffers}
                  />
                </div>
                {this.showBookingButton() && (
                  <div className={classes.bookingButtonContainer}>
                    <BookButton
                      isRegisteringForWaitingList={this.getIsRegisteringForWaitingList()}
                      selectedOffersCount={this.state.selectedOffers.length + 1}
                      price={
                        this.state.selectedPack?.paymentPack?.price ||
                        this.state.selectedPack?.paymentPackCombo?.price
                      }
                      tax={
                        this.state.selectedPack?.paymentPack?.tax ||
                        this.state.selectedPack?.paymentPackCombo
                          ?.tax_calculation
                      }
                      selectedPackId={
                        this.state.selectedPack?.consumerPaymentPack?.id ||
                        this.state.selectedPack?.paymentPack?.id ||
                        this.state.selectedPack?.paymentPackCombo?.id
                      }
                      is_tax_excluded_in_marketplace={
                        this.props.theme.is_tax_excluded_in_marketplace
                      }
                      onClickBook={this.bookOffers}
                    />
                  </div>
                )}
              </div>

              <Hidden mdUp>
                <div className={classes.inverseDivider2} />
              </Hidden>

              <div className={classes.packsContainer}>
                {this.renderBookingMethodSelector()}
                <div style={{ height: 100, width: '100%' }} />
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
            similarOffers={
              this.props.offer.group
                ? this.props.similarOfferGroups.filter(
                    (o) =>
                      o?.bookableStatus?.bookable_status ===
                      OFFER_BOOKABLE_STATUS_BOOKABLE,
                  )
                : this.props.similarOffers
            }
            loading={this.props.similarLoading}
            offerStatusById={this.props.offerStatusById}
            resetSimilarOffers={this.props.resetSimilarOffers}
            onClickShowMore={this.fetchSimilarOffers}
            hasMoreSimilarOffer={this.props.hasMoreSimilarOffer}
            acceptDoubleBooking={this.props.theme.accept_double_booking}
          />
          {!!this.state.offersWaitingForSpotSelection.length && (
            <OfferSpotSelector
              offer={this.state.offersWaitingForSpotSelection[0]}
              updateSpotsForOffer={this.updateSpotsForOffers}
              refreshOfferStatus={(id) => this.fetchOfferStatusList([id])}
              roomBlueprintsById={this.props.roomBlueprintsById}
              assetByIdBlueprintByIdentifier={
                this.props.assetByIdBlueprintByIdentifier
              }
              onCancel={this.onCancelSpotSelection}
              offerStatusById={this.props.offerStatusById}
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

const styles = (theme: Theme) => {
  return {
    loading: { width: '100%' },
    pageContainer: {
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      overflowY: 'auto',
      overflowX: 'hidden',
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
      zIndex: '999',
      marginBottom: '0px !important',
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
  };
};

const mapStateToProps = (state: RootState, props: OwnProps) => {
  const offer: Offer_FULL = withMetaActivity(
    withGroup(withCoach(withEstablishment(getOfferById))),
  )(state, props.id);
  return {
    offer,
    offerLoading: state.offer.retrieve.loading,
    offerStatusById: state.offer.offerStatus.byId,
    offerStatusLoading: state.offer.offerStatus.loading,
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
    similarOfferGroups: withMetaActivity(
      withBookableStatus(
        withCoach(withEstablishment(getOffersListByGroup)),
      ) as Offer_FULL[],
    )(state, offer?.group?.id ?? offer?.group),
    similarOfferGroupsLoading:
      state.establishment.loading ||
      state.coach.loading ||
      state.offer.offerStatus.loading ||
      (state.offer.groups?.[offer?.group?.id ?? offer?.group]?.loading ??
        false),
    bookingGuestNumberLeft: getBookingGuestNumberLeft(state),
  };
};

const mapDispatchToProps = {
  fetchOffer,
  fetchEstablishmentBulk,
  fetchCoachBulk,
  fetchMyRelatedMemberList,
  fetchMetaActivityBulk,
  offerUserRegistration,
  push: pushAction,
  fetchSimilarOffers,
  resetSimilarOffers,
  goToUserSpace: (id: number) => pushAction(`/c/${id}/`),
  snackbarError: snackbarErrorAction,
  snackbarWarning: snackbarWarningAction,
  fetchOfferStatusList,
  fetchOfferStatus: fetchOfferStatusAction,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
  fetchCompanyTheme: fetchCompanyThemeAction,
  fetchGroup: fetchGroupOfferAction,
  fetchOffersInGroup: fetchOffersInGroupAction,
  fetchBookingGuestNumber: fetchBookingGuestNumberAction,
};

const mapWithHandlers = {
  goToCalendar: (props: OwnProps & ConnectedProps) => (params: any) => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window.close();
    } else if (props.queryParams.fromWorkshop === 'true') {
      props.push(
        `${urlToMarketplace(
          props.theme.company_name,
          props.theme.company.toString(),
        )}/workshop`,
      );
    } else {
      props.push(
        `${urlToMarketplace(
          props.theme.company_name,
          props.theme.company.toString(),
        )}/calendar/${buildUrlParams(params)}`,
      );
    }
  },
};

export default compose(
  withQueryParams([['fromWorkshop'], 'queryParams']),
  // @ts-ignore
  withTranslation(['booking']),
  routerParamsToProps({ id: 'id:number' }),
  connect(mapStateToProps, mapDispatchToProps),
  withTheme,
  withHandlers(mapWithHandlers),
  withStyles(styles),
)(OfferBooking);
