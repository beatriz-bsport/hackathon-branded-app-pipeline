import React from 'react';
import isEqual from 'lodash/isEqual';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  push as pushAction,
  replace as repalceAction,
} from 'connected-react-router';
import { DateTime } from 'luxon';

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
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

// @ts-expect-error
import Analytics from '#src/components/analytics/Analytics.component';
import withTheme from '#src/hocs/company-themifier.hoc';

import { urlToMarketplace } from '#src/libs/marketplace/utils';
import themeSelectors from '#src/libs/theme/selectors';
import {
  getOfferById,
  withEstablishment,
  withCoach,
  getSimilars,
  withMetaActivity,
  getOffersListByGroup,
  withBookableStatus,
  getBookingGuestNumberLeft,
  getOfferStatusWaitingListPositionById,
} from '#src/libs/offer/selectors';
import {
  getGroupOffersIdsToBeBooked,
  withGroup,
  getGroupOffersStatus,
  getOffersListByGroup as getOffersListByGroupSelector,
} from '#src/libs/group-offer/selectors';
import {
  fetchOfferStatusList,
  fetchOfferStatus as fetchOfferStatusAction,
  offerUserRegistration,
  fetchSimilarOffers,
  resetSimilarOffers,
  retrieveOffer as fetchOffer,
  fetchOffersInGroup as fetchOffersInGroupAction,
  fetchBookingGuestNumber as fetchBookingGuestNumberAction,
  fetchOfferBulk as fetchOfferBulkAction,
  setStoredOffersInGroups as setStoredOffersInGroupsAction,
  fetchOfferWaitingListPosition as fetchOfferWaitingListPositionAction,
} from '#src/libs/offer/actions';
import {
  snackbarError as snackbarErrorAction,
  snackbarWarning as snackbarWarningAction,
} from '#src/libs/snackbar/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#src/libs/spot-scheduling/actions';
import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#src/libs/spot-scheduling/selector';
import { getWaitingListConfigurationData } from '#src/libs/waiting-list/selectors';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchMetaActivityBulk } from '#src/libs/meta-activity/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  getGroupOfferBookableStatus as getGroupOfferBookableStatusAction,
  listGroupOfferOffersIdsToBeBooked as listGroupOfferOffersIdsToBeBookedAction,
  getGroupOfferFirstOfferIdToBeBooked as getGroupOfferFirstOfferIdToBeBookedAction,
  resetOffersToBeBookedByGroup as resetOffersToBeBookedByGroupAction,
} from '#src/libs/group-offer/actions';
import { fetchCoachBulk } from '#src/libs/associated-coach/actions';
import {
  fetchEstablishmentBulk,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import { Offer_FULL, Offer } from '#src/libs/offer/types';
import SimilarOffers from '#src/libs/booker-module/components/SimilarOfferSelector.component';
import BookerModuleHeader from '#src/libs/booker-module/components/BookerModuleHeader.component';
import OfferListSummary from '#src/libs/booker-module/components/OfferListSummary.component';

import { getMyRelatedMemberList } from '#src/libs/relationship/selectors';
import { fetchMyRelatedMemberList } from '#src/libs/relationship/actions';

import {
  OfferData,
  SelectedPack,
  OfferConstraint,
  AdditionalGuest,
} from '#src/libs/booker-module/types';
import { MemberMinimal } from '#src/libs/member/types';

import BookButton from '#src/libs/booker-module/components/BookButton.components';
import GroupOfferRedirectToFirstOfferDialog from '#src/libs/marketplace/components/@Offer/GroupOfferRedirectToFirstOffer.dialog';

import { REDIRECTED_TO_FIRST_OFFER_TO_BE_BOOKED } from '#src/libs/group-offer/constants';
import {
  getCheckoutUrl,
  getCheckoutValidationUrl,
} from '#src/libs/marketplace/routing-utils';
import { fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction } from '#src/libs/waiting-list/actions';
import { getEnabledEstablishmentBillingGroups } from '#src/libs/establishment/selectors';
import OfferSpotSelector from './OfferSpotSelector';
import BookingMethodSelector from './BookingMethodSelector.container';
import { buildUrlParams, parseQueryString } from '../../../../http';
import ConsumerAppBarContainer from '../../ConsumerAppBar.container';
import { RootState } from '../../../../reducers';
import { WithHandlerType, MaterialStyleType } from '../../../../utils/types';

type OwnProps = { id: number; redirectedToFirstOfferToBeBooked: boolean };
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
  openRedirectedToFirstOfferToBeBookedDialog: boolean;
};

const SIMILAR_OFFER_PAGE_SIZE = 7;
const DEFAULT_SPOT_TYPE = { id: -1 };

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
      openRedirectedToFirstOfferToBeBookedDialog: false,
    };
  }

  componentDidMount() {
    if (this.props.redirectedToFirstOfferToBeBooked) {
      this.setState({ openRedirectedToFirstOfferToBeBookedDialog: true });
    }
    this.props.resetOffersToBeBookedByGroup(() =>
      this.props.redirectToFirstOfferToBeBookedForOfferGroup(this.fetchData),
    );
  }

  fetchData = () => {
    this.props.fetchOffer(this.props.id, {
      onSuccess: (offer) => {
        this.props.fetchMetaActivityBulk([offer.meta_activity]);
        this.props.fetchMyRelatedMemberList(offer.company);
        this.props.fetchCompanyTheme(offer.company, {
          onSuccess: (theme) => {
            if (theme.enable_multi_localization) {
              this.props.fetchAllEstablishmentBillingGroup({
                params: { company: this.props.offer?.company },
              });
            }
          },
        });
        this.props.fetchBookingGuestNumber(offer.id);
        this.props.fetchCompanyWaitlistConfiguration(offer.company);
        this.props.fetchOfferWaitingListPosition(offer.id);
        if (offer.group !== null) {
          this.props.getGroupOfferBookableStatus(offer.group);
          this.props.fetchGroup(offer.group, {
            onSuccess: (group) => {
              if (!group.full_booking_only) {
                this.props.fetchOfferStatusList(group.offers, {
                  page_size: group.offers.length,
                });
                this.props.fetchOffersInGroup(offer.group, {
                  onSuccess: (offers) => {
                    this.props.fetchOffersRelatedObjects(offers);
                  },
                });
              } else {
                this.props.listGroupOfferOffersIdsToBeBooked(offer.group, {
                  onSuccess: (ids) => {
                    this.props.fetchOfferBulk(ids, {
                      onSuccess: (offers) => {
                        this.props.setStoredOffersInGroups(offer.group, ids);
                        this.props.fetchOffersRelatedObjects(offers);
                      },
                    });
                  },
                });
              }
            },
          });

          return;
        }

        this.props.fetchEstablishmentBulk([offer.establishment]);
        this.props.fetchCoachBulk([offer.coach, offer.coach_override]);
        this.props.fetchOfferStatus(
          offer.id,
          {},
          {
            onSuccess: this.updateOfferConstraints,
          },
        );
        this.fetchSimilarOffers();

        if (offer && !!offer.room_blueprint) {
          this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
          this.props.fetchAssetForBlueprint({
            blueprint: offer.room_blueprint,
          });
        }
      },
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      (!prevProps.id && this.props.id) ||
      prevProps.id !== this.props.id ||
      prevProps.offer?.group?.id !== this.props.offer?.group?.id ||
      prevProps.offer?.group?.full_booking_only !==
        this.props.offer?.group?.full_booking_only
    ) {
      this.props.redirectToFirstOfferToBeBookedForOfferGroup();
    }
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

    if (
      (prevProps.similarOfferGroupsLoading !==
        this.props.similarOfferGroupsLoading &&
        this.props.offer.group) ||
      (!prevProps.groupOffersIdsTobeBooked &&
        this.props.groupOffersIdsTobeBooked) ||
      (prevProps.groupOffersIdsTobeBooked !==
        this.props.groupOffersIdsTobeBooked &&
        this.props.groupOffersIdsTobeBooked) ||
      (!isEqual(prevProps.similarOfferGroups, this.props.similarOfferGroups) &&
        this.props.similarOfferGroups)
    ) {
      const group = this.props.offer.group;
      const fullBookingOnly = group.full_booking_only;
      const offersInGroup = this.props.similarOfferGroups?.filter(
        // @ts-expect-error
        (o) => o.id !== this.props.id,
      );
      let offers = [];
      if (fullBookingOnly) {
        // @ts-expect-error
        offers = offersInGroup.filter((o) =>
          this.props.groupOffersIdsTobeBooked?.includes(o.id),
        );
      } else {
        offers = offersInGroup;
      }

      if (
        fullBookingOnly &&
        // @ts-expect-error
        offers.some((offer) => {
          return (
            (!!offer.bookableStatus?.bookable_status &&
              offer.bookableStatus?.bookable_status !==
                OFFER_BOOKABLE_STATUS_BOOKABLE) ||
            offer.bookableStatus?.blocked_by_tags
          );
        })
      ) {
        this.setState({
          blockByGroup: true,
        });
      }
      let offersToAdd = [];
      if (fullBookingOnly) {
        offersToAdd = offers;
      } else {
        offersToAdd = offers.filter(
          // @ts-expect-error
          (offer) =>
            !offer.bookableStatus?.blocked_by_tags &&
            (offer.bookableStatus?.bookable_status ===
              OFFER_BOOKABLE_STATUS_BOOKABLE ||
              offer.bookableStatus?.waiting_list_status ===
                OFFER_BOOKABLE_STATUS_BOOKABLE),
        );
      }

      this.setState(
        () => ({
          selectedOffers: [
            // @ts-expect-error
            ...offersToAdd.map((offer) => ({
              offer,
              extra_data: {
                protected: fullBookingOnly,
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
      this.props.offer &&
      !this.props.similarOfferGroupsLoading &&
      !this.props.offerStatusLoading &&
      this.props.offerStatusById?.[this.props.id] &&
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
          // @ts-expect-error
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
      // @ts-expect-error
      this.props.offer,
      this.state.selectedOffers,
      this.state.selectedPack,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
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
      .filter((_off) => !!_off)
      .filter((offer) => {
        const offerFeature = getOfferFeature(
          // @ts-expect-error
          offer,
          this.props.offerStatusById,
          this.props.theme.accept_double_booking,
          this.props.theme.accept_double_booking_workshop,
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
        DateTime.fromISO(a.date_start) < DateTime.fromISO(b.date_start)
          ? -1
          : 1,
      );

    this.setState({ offersWaitingForSpotSelection });
  };

  updateSpotsForOffers = (offerId: number, index: number) => {
    this.closeSimilarOfferSelector();
    this.setState((prevState) => {
      return {
        spotsForOffers: {
          ...prevState.spotsForOffers,
          [offerId]: index,
        },
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
          date: DateTime.fromISO(this.props.offer.date_start).toISODate(),
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
            // @ts-expect-error
            offerData.offer,
            this.props.offerStatusById,
            this.props.theme.accept_double_booking,
            this.props.theme.accept_double_booking_workshop,
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
            // @ts-expect-error
            offerData.offer,
            this.props.offerStatusById,
            this.props.theme.accept_double_booking,
            this.props.theme.accept_double_booking_workshop,
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
            getCheckoutValidationUrl(this.props.offer.company, false, {
              basket: 'null',
              user_registration_response: encodeURIComponent(
                JSON.stringify(responseData),
              ),
            }),
          );
        } else {
          this.props.push(
            getCheckoutUrl(this.props.offer.company, false, {
              user_registration_response: encodeURIComponent(
                JSON.stringify(responseData),
              ),
            }),
          );
        }
      },
      onError: () => {
        this.setState({ showLoader: false });
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
      // @ts-expect-error
      this.props.offer,
      this.props.offer ? [{ offer: this.props.offer }] : [],
      this.state.selectedPack,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
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
      isBookingLimitReached,
    } = getOfferFeature(
      // @ts-expect-error
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
    );

    const offerIsReady =
      !loading && this.props.offer && this.props.offer.meta_activity;
    if (
      offerIsReady &&
      (!isBookable ||
        this.state.blockByGroup ||
        blockedByTags ||
        isBookingLimitReached)
    ) {
      const { message, icon } = getMainOfferNotBookableReason(
        // @ts-expect-error
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
            align="center"
            className={this.props.classes.canNotBookMessage}
            color="textSecondary"
          >
            {message}
          </Typography>
        </div>
      );
    }
    return (
      <BookingMethodSelector
        company={this.props.offer.company}
        establishmentBillingGroups={this.props.establishmentBillingGroups}
        isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
        loading={
          loading || !this.props.offer || !this.props.offer.meta_activity
        }
        offer={this.props.offer}
        offerId={this.props.id}
        offersConstraint={this.state.offersConstraint}
        offerStatus={offerStatus}
        onPackChange={(selectedPack) => this.setState({ selectedPack })}
        selectedOffers={this.state.selectedOffers}
        selectedPack={this.state.selectedPack}
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
        // @ts-expect-error
        if (item.data.allow_guest_pass) {
          comboAllowsGuest = true;
          // @ts-expect-error
          if (item.data.credits > maxComboGuest)
            // @ts-expect-error
            maxComboGuest = item.data.credits;
          // @ts-expect-error
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
              coachDisplay={this.props.theme.coach_display}
              hideCoach={this.props.theme.hideCoach}
              offer={this.props.offer}
            />
            <Hidden mdUp>
              <div className={classes.inverseDivider1} />
            </Hidden>
            <div className={classes.responsiveContainer}>
              <div className={classes.offerGroupContainer}>
                <div className={classes.offerContainer}>
                  <OfferListSummary
                    acceptDoubleBooking={this.props.theme.accept_double_booking}
                    acceptDoubleBookingWorkshop={
                      this.props.theme.accept_double_booking_workshop
                    }
                    additionalGuestList={this.state.additionalGuestList}
                    coachDisplay={this.props.theme.coach_display}
                    frequencyBookingGuest={
                      this.props.theme.allow_guest_frequency
                    }
                    hideCoach={this.props.theme.hideCoach}
                    isRegisteringForWaitingList={isRegisteringForWaitingList}
                    maxGuestNumberFromAllPacks={
                      this.state.guestMaxNumberOverAllPacks
                    }
                    // @ts-expect-error
                    member={this.state.selectedMember}
                    numberBookingGuestLeft={this.props.bookingGuestNumberLeft}
                    offer={this.props.offer}
                    offerStatus={this.props.offerStatusById[this.props.id]}
                    offerStatusById={this.props.offerStatusById}
                    onAddAdditionalGuest={
                      this.props.theme?.allow_guest_activatable &&
                      this.props.theme?.allow_guest &&
                      this.props.offer.allow_guest_offer &&
                      !this.props.offer.group
                        ? this.addAdditionalGuest
                        : null
                    }
                    onClickAddMoreOffer={
                      this.showBookingButton() &&
                      !isRegisteringForWaitingList &&
                      this.openSimilarOfferSelector
                    }
                    onClickRemoveOffer={this.onClickRemoveOffer}
                    onRemoveGuest={this.removeGuest}
                    onSelectMember={this.selectMember}
                    packAllowsBookingGuest={
                      this.state.packAllowsBookingForAGuest
                    }
                    relatedMemberList={this.props.relatedMemberList}
                    roomBlueprintsById={this.props.roomBlueprintsById}
                    selectedOffers={this.state.selectedOffers}
                    showBookingButton={this.showBookingButton()}
                    spotsForOffers={this.state.spotsForOffers}
                    // @ts-expect-error
                    spotTypes={this.props.spotTypes.concat(DEFAULT_SPOT_TYPE)}
                  />
                </div>
                {this.showBookingButton() && (
                  <div className={classes.bookingButtonContainer}>
                    <BookButton
                      displayPositionInWaitingList={
                        this.props.waitingListConfiguration
                          ?.display_member_position &&
                        this.props.waitingListConfiguration?.dynamic ===
                          WAITING_LIST_DYNAMIC_ORDERED
                      }
                      is_tax_excluded_in_marketplace={
                        this.props.theme.is_tax_excluded_in_marketplace
                      }
                      isRegisteringForWaitingList={this.getIsRegisteringForWaitingList()}
                      onClickBook={this.bookOffers}
                      price={
                        this.state.selectedPack?.paymentPack?.price ||
                        this.state.selectedPack?.paymentPackCombo?.price
                      }
                      selectedOffersCount={this.state.selectedOffers.length + 1}
                      selectedPackId={
                        this.state.selectedPack?.consumerPaymentPack?.id ||
                        this.state.selectedPack?.paymentPack?.id ||
                        this.state.selectedPack?.paymentPackCombo?.id
                      }
                      tax={
                        this.state.selectedPack?.paymentPack?.tax ||
                        this.state.selectedPack?.paymentPackCombo
                          ?.tax_calculation
                      }
                      waitingListPosition={
                        this.props.offerStatusWaitingListPositionById?.[
                          this.props.id
                        ]?.waiting_list_position
                      }
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

          {!this.props.offer?.group?.full_booking_only && (
            <SimilarOffers
              acceptDoubleBooking={this.props.theme.accept_double_booking}
              acceptDoubleBookingWorkshop={
                this.props.theme.accept_double_booking_workshop
              }
              coachDisplay={this.props.theme.coach_display}
              hasMoreSimilarOffer={this.props.hasMoreSimilarOffer}
              hideCoach={this.props.theme.hideCoach}
              loading={this.props.similarLoading}
              offer={this.props.offer}
              offerStatusById={this.props.offerStatusById}
              onClickShowMore={this.fetchSimilarOffers}
              onClose={this.closeSimilarOfferSelector}
              onSelectOffer={this.onSelectOffer}
              open={this.state.showSimilarOffers}
              // @ts-expect-error
              resetSimilarOffers={this.props.resetSimilarOffers}
              selectedOffers={this.state.selectedOffers}
              similarOffers={
                this.props.offer.group
                  ? this.props.similarOfferGroups.filter(
                      // @ts-expect-error
                      (o) =>
                        o?.bookableStatus?.bookable_status ===
                        OFFER_BOOKABLE_STATUS_BOOKABLE,
                    )
                  : this.props.similarOffers
              }
            />
          )}
          {!!this.state.offersWaitingForSpotSelection.length && (
            <OfferSpotSelector
              assetByIdBlueprintByIdentifier={
                this.props.assetByIdBlueprintByIdentifier
              }
              coachDisplay={this.props.theme.coach_display}
              fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
              // @ts-expect-error
              offer={this.state.offersWaitingForSpotSelection[0]}
              offerStatusById={this.props.offerStatusById}
              // @ts-expect-error
              onCancel={this.onCancelSpotSelection}
              refreshOfferStatus={(id) => this.fetchOfferStatusList([id])}
              roomBlueprintsById={this.props.roomBlueprintsById}
              // @ts-expect-error
              spotTypes={this.props.spotTypes.concat(DEFAULT_SPOT_TYPE)}
              updateSpotsForOffer={this.updateSpotsForOffers}
            />
          )}
          <Backdrop className={classes.backdrop} open={this.state.showLoader}>
            <CircularProgress color="primary" />
          </Backdrop>
          <GroupOfferRedirectToFirstOfferDialog
            group={this.props.offer?.group}
            loading={this.props.offerLoading || this.props.groupLoading}
            onClose={() =>
              this.setState({
                openRedirectedToFirstOfferToBeBookedDialog: false,
              })
            }
            open={this.state.openRedirectedToFirstOfferToBeBookedDialog}
          />
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
  const fullBookingOnly = offer?.group?.full_booking_only;
  const similarOffersSelector = fullBookingOnly
    ? getOffersListByGroup
    : getOffersListByGroupSelector;
  return {
    offer,
    offerLoading: state.offer.retrieve.loading,
    offerStatusById: fullBookingOnly
      ? getGroupOffersStatus(state, offer.group.id)
      : state.offer.offerStatus.byId,
    offerStatusLoading:
      state.offer.offerStatus.loading || state.groupOffer.offersStatus.loading,
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
      // @ts-expect-error
      withBookableStatus(
        withCoach(withEstablishment(similarOffersSelector)),
      ) as Offer_FULL[],
      // @ts-expect-error
    )(state, offer?.group?.id ?? offer?.group),
    similarOfferGroupsLoading:
      state.establishment.loading ||
      state.coach.loading ||
      state.offer.offerStatus.loading ||
      // @ts-expect-error
      (state.offer.groups?.[offer?.group?.id ?? offer?.group]?.loading ??
        false),
    bookingGuestNumberLeft: getBookingGuestNumberLeft(state),
    spotTypes: getSpotTypesOfCompany(state),
    groupOffersIdsTobeBooked: getGroupOffersIdsToBeBooked(
      state,
      offer?.group?.id,
    ),
    groupLoading: state.groupOffer.loading,
    waitingListConfiguration: getWaitingListConfigurationData(state),
    offerStatusWaitingListPositionById:
      getOfferStatusWaitingListPositionById(state),
    establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
  };
};

const mapDispatchToProps = {
  fetchOffer,
  fetchEstablishmentBulk,
  fetchCoachBulk,
  fetchMyRelatedMemberList,
  fetchMetaActivityBulk,
  offerUserRegistration,
  fetchCompanyWaitlistConfiguration: fetchCompanyWaitlistConfigurationAction,
  push: pushAction,
  replace: repalceAction,
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
  fetchSpotForBlueprint,
  getGroupOfferBookableStatus: getGroupOfferBookableStatusAction,
  listGroupOfferOffersIdsToBeBooked: listGroupOfferOffersIdsToBeBookedAction,
  getGroupOfferFirstOfferIdToBeBooked:
    getGroupOfferFirstOfferIdToBeBookedAction,
  fetchOfferBulk: fetchOfferBulkAction,
  setStoredOffersInGroups: setStoredOffersInGroupsAction,
  resetOffersToBeBookedByGroup: resetOffersToBeBookedByGroupAction,
  fetchOfferWaitingListPosition: fetchOfferWaitingListPositionAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
};

const mapWithHandlers = {
  goToCalendar: (props: OwnProps & ConnectedProps) => (params: any) => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window.close();
      // @ts-expect-error
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
  redirectToFirstOfferToBeBookedForOfferGroup:
    // When landing on the page to book a offer whitin an OfferGroup with the full_booking_only set to True
    // user must be redirect to the first offer that have to be booked (date_start).
    (props: OwnProps & ConnectedProps) => (callback?: () => void) => {
      if (props.offer?.group?.full_booking_only) {
        props.getGroupOfferFirstOfferIdToBeBooked(props.offer.group.id, {
          onSuccess: (id: number | null) => {
            if (id && props.id !== id) {
              const params = parseQueryString(window.location.search);
              props.replace(
                `/customer/payment/offer/${id}${buildUrlParams({
                  ...params,
                  redirectedToFirstOfferToBeBooked: true,
                })}`,
              );
            } else {
              callback && callback();
            }
          },
          onError: () => {
            callback && callback();
          },
        });
      } else {
        callback && callback();
      }
    },
  fetchOffersRelatedObjects:
    (props: OwnProps & ConnectedProps) => (offerList: Offer[]) => {
      props.fetchCoachBulk(
        Array.from(
          new Set(
            offerList.flatMap((offer) => [offer.coach, offer.coach_override]),
          ),
        ).filter((c) => !!c),
      );

      props.fetchEstablishmentBulk(
        Array.from(new Set(offerList.map((offer) => offer.establishment))),
      );

      const roomBlueprintIds = new Set(
        offerList
          .filter((offer) => offer.room_blueprint)
          .map((offer) => offer.room_blueprint),
      );
      roomBlueprintIds.forEach((blueprint: number) => {
        props.fetchRoomBlueprintDetail(blueprint);
        props.fetchAssetForBlueprint({ blueprint });
      });
    },
};

export default compose(
  withRouter,
  withQueryParams([['fromWorkshop'], 'queryParams']),
  withProps(({ location }: { location: Location }) => ({
    redirectedToFirstOfferToBeBooked: location.search.includes(
      REDIRECTED_TO_FIRST_OFFER_TO_BE_BOOKED,
    ),
  })),
  withTranslation(['booking']),
  routerParamsToProps({
    id: 'id:number',
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withTheme,
  withHandlers(mapWithHandlers),
  // @ts-expect-error
  withStyles(styles),
)(OfferBooking);
