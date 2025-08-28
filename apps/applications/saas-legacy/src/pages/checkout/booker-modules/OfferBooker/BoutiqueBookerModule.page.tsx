import React from 'react';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';

import {
  replace as replaceAction,
  push as pushAction,
  goBack,
} from 'connected-react-router';
import {
  getOfferContraints,
  getAvailablePaymentPacks,
  getAvailableConsumerPack,
  getAvailableComboPacks,
  getAvailableContracts,
  getOfferFeature,
  getMainOfferNotBookableReasonWithTitle,
} from '@bsport/common/lib/master-data/available-payment.js';

import { OFFER_WAITING_LIST_STATUS_CONVERTIBLE } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import { DateTime } from 'luxon';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { WithTranslation, withTranslation } from 'react-i18next';
import { SvgIconComponent } from '@material-ui/icons';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status.js';
import Alert, { AlertSeverity } from '#src/components/css-only/Alert';
import type {
  MaxoutData,
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#src/libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import {
  fetchPaymentComboForBooking,
  fetchPaymentComboFromContract as fetchPaymentComboFromContractAction,
} from '#src/libs/payment-combo/actions';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '#src/libs/checkout/actions';
import { getCurrentBasket } from '#src/libs/checkout/selectors';
import {
  buildBuyableItemCategories,
  getBookingBlockedReasonIcon,
  getBookingDisplayPrice,
  urlToMarketplace,
  urlToMarketplaceTab,
} from '#src/libs/marketplace/utils';
import {
  RECOMMENDED_BUYABLE_CATEGORY_ID,
  MARKETPLACE_PATH_TAB_PASS,
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
} from '#src/libs/marketplace/constants';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import {
  retrieveOffer as fetchOffer,
  fetchSimilarOffersReworked as fetchSimilarOffersReworkedAction,
  resetSimilarOffersReworked as resetSimilarOffersReworkedAction,
  fetchOfferStatus as fetchOfferStatusAction,
  fetchOfferStatusList as fetchOfferStatusListAction,
  offerUserRegistration,
  fetchBookingGuestNumber as fetchBookingGuestNumberAction,
  fetchOfferWaitingListPosition as fetchOfferWaitingListPositionAction,
  fetchOffersInGroup as fetchOffersInGroupAction,
  fetchOfferBulk as fetchOfferBulkAction,
} from '#src/libs/offer/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  getGroupOfferBookableStatus as getGroupOfferBookableStatusAction,
  listGroupOfferOffersIdsToBeBooked as listGroupOfferOffersIdsToBeBookedAction,
  getGroupOfferFirstOfferIdToBeBooked as getGroupOfferFirstOfferIdToBeBookedAction,
} from '#src/libs/group-offer/actions';
import { getMemberTagsIdsList } from '#src/libs/tag/selectors';
import {
  getOffersListByGroup,
  getGroupDataById,
  withGroup,
  getGroupOffersStatus,
} from '#src/libs/group-offer/selectors';
import { getMetaActivitiesDict } from '#src/libs/meta-activity/selectors';
import { getAllEstablishmentsDict } from '#src/libs/establishment/selectors';
import { getAllCoachesDict } from '#src/libs/associated-coach/selectors';

import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '#src/libs/subscription/selectors';
import { fetchContractForBooking as fetchContractForBookingAction } from '#src/libs/subscription/actions';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack as withPaymentPackForConsumer,
} from '#src/libs/consumer-payment-pack/selectors';
import {
  fetchConsumerPaymentPackForBooking,
  fetchConsumerPaymentPackMaxoutBooking,
} from '#src/libs/consumer-payment-pack/actions';
import {
  fetchCoachBulkForCompany as fetchCoachBulkForCompanyAction,
  fetchCoachBulk as fetchCoachBulkAction,
} from '#src/libs/associated-coach/actions';
import { fetchMetaActivityBulk } from '#src/libs/meta-activity/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import {
  fetchBookingFunnelConfiguration,
  fetchMarketplaceSettings,
} from '#src/libs/marketplace/actions';
import {
  getPaymentComboForBooking,
  withPaymentPack as withPaymentPackForCombo,
} from '#src/libs/payment-combo/selectors';
import { fetchEstablishmentBulk } from '#src/libs/establishment/actions';
import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchAllPaymentPackCategory,
  resetPaymentPackForBooking,
} from '#src/libs/payment-packs/actions';
import { fetchMyRelatedMemberList as fetchMyRelatedMemberListAction } from '#src/libs/relationship/actions';
import { getMyRelatedMemberList } from '#src/libs/relationship/selectors';
import { getConsumerProfile } from '#src/libs/consumer-space/selectors';
import {
  excludeUnaccessiblePacks,
  getPaymentPackForBooking,
  getAllPaymentPackCategory,
} from '#src/libs/payment-packs/selectors';
import { fetchCompanyConfiguration } from '#src/libs/waiting-list/actions';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import type {
  Offer,
  OfferStatus,
  OfferREST,
  Offer_FULL,
} from '#src/libs/offer/types';
import {
  withEstablishment,
  withCoach,
  withMetaActivity,
  getOfferById,
  getBookingGuestNumberLeft,
  getOfferStatusWaitingListPositionById,
  getSimilarOffersReworkedByIdList,
  getSimilarOffersReworkedCount,
  getSimilarOffersReworkedAllIds,
  getOfferBookableStatus,
  getSimilarOffersReworkedIsLoading,
} from '#src/libs/offer/selectors';
import { getMarketplaceSettingsConfig } from '#src/libs/marketplace/selectors';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchMemberTagList } from '#src/libs/tag/actions';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#src/libs/spot-scheduling/actions';
import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#src/libs/spot-scheduling/selector';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
  MultipleOfferSelectedData,
  OfferConstraint,
} from '#src/libs/booker-module/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { Contract } from '#src/libs/subscription/types';
import OfferBookingWaitingList from '#src/libs/offer/components/OfferBookingWaitingList';
import MarketplaceBookingBlockedReason from '#src/libs/marketplace/components/@Booking/MarketplaceBookingBlockedReason';
import MarketplaceSpotSelector from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector';
import type { SpotType } from '#src/libs/spot-scheduling/types';
import { DEFAULT_SPOT_TYPE_ID } from '#src/libs/spot-scheduling/utils';
import {
  getCheckoutUrl,
  getCheckoutValidationUrl,
  getBoutiqueContractCheckoutUrl,
} from '#src/libs/marketplace/routing-utils';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import { consumerAppBarHOC } from '#src/hocs/consumer-app-bar.hoc';
import MarketplaceBookerModuleBuyableItems from '#src/libs/marketplace/components/@BuyableItem/MarketplaceBookerModuleBuyableItems';
import Button, {
  ButtonColor,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/Button';
import Skeleton from '#src/components/css-only/Skeleton';
import BookingConfirmButtonWithOfferSummary from '#src/libs/booking/components/BookingConfirmButtonWithOfferSummary.component';
import CountDown from '#src/components/time/CountDown.component';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import BookerModuleOfferSummary from '#src/libs/marketplace/components/@Offer/BookerModuleOfferSummary';
import MultiSessionModalStepper from '#src/pages/checkout/booker-modules/SimilarOfferModal/MultiSessionModalStepper.component';
import AddMoreSessionsButton from '#src/pages/checkout/booker-modules/OfferBooker/AddMoreSessionsButton.component';
import ShowSessionsButton from '#src/pages/checkout/booker-modules/OfferBooker/ShowSessionsButton.component';
import GroupedOfferInformationModal from '#src/pages/checkout/booker-modules/OfferBooker/GroupedOfferInformationModal.component';

import withScrollHeightListener from '#src/hocs/with-widget-scroll-height-listener.hoc';
import { RootState } from '../../../../reducers';
import { buildUrlParams, parseQueryString } from '../../../../http';
import type {
  OptionCallback,
  PaginatedResponse,
} from '../../../../state/types';
import type {
  CartItem,
  OfferBookingValidation,
} from '#src/components/analytics/types';
import type { WithHandlerType } from '../../../../utils/types';
import type { MemberMinimal } from '#src/libs/member/types';
import BookingForAnotherSelector from '#src/libs/booker-module/components/BookingForAnotherSelector.component';
import { filterObjectOnSingleKey } from '#src/libs/utils';
import { SlashCircle01 } from '#src/components/untitledui';

import { buildDataForUserRegistrationWithMultiSessionsAllowed } from '#src/libs/marketplace/utils/booker-module';
import {
  getSessionCoachId,
  getSessionEstablishmentId,
  getSessionMetaActivityId,
} from '#src/components/analytics/utils';
import analyticsUtils from '#src/components/analytics/analytics';

import './BoutiqueBookerModule.css';

const NUMBER_OF_OFFER_TO_ALWAYS_DISPLAY_IN_SUMMARY = 2;
const SIMILAR_OFFER_PAGE_SIZE = 7;
const DEFAULT_SPOT_TYPE = { id: -1 };

type SelectedSpotsKeying = {
  [key: number]: string;
};

type SelectedSpotsIdsKeying = {
  [key: number]: number;
};

type State = {
  offersConstraint: OfferConstraint;
  selectedBuyableItemCategory: BuyableItemCategory | null;
  selectedOffers: MultipleOfferSelectedData[];
  removedSelectedGroupedOffers: (OfferREST | Offer_FULL)[];
  selectedItem: BookerItem | null;
  isSpotSelectorOpen: boolean;
  selectedSpotsIds: SelectedSpotsIdsKeying;
  selectedSpots: SelectedSpotsKeying;
  showBuyableItems: boolean;
  confirmLoading: boolean;
  availableConsumerPacks: (ConsumerPaymentPack<PaymentPack> & MaxoutData)[];
  buyableItemCategories: BuyableItemCategory[];
  isBookingBlocked: boolean;
  isWaitingList: boolean;
  bookingBlockedReason: {
    title: string;
    message: string;
    TheIcon: SvgIconComponent;
    color: string;
    isWaitingListOpenMainReason: boolean;
  } | null;
  offerWasRetrieved: boolean;
  isSimilarOfferModalOpened: boolean;
  memberBookingId: number;
  showHiddenSessionsFromSummary: boolean;
  offerGroupData: OffersGroup | null;
  baseOffersWaitingForSpotSelection: (OfferREST | Offer_FULL)[];
  totalNumberOfOfferInSpotSelection: number;
  showGroupedOfferInformationModal: boolean;
};

type OwnProps = {
  companyId: number;
  offerId: number;
  queryParams: {
    fromWorkshop?: 'true';
    guest_booking?: 'true';
    guest_first_name?: 'true';
    guest_last_name?: 'true';
    guest_email?: 'true';
  };
  memberTagList: number[];
  authenticated: boolean;
  goBack: () => void;
  containerRef: React.MutableRefObject<any>;
  metaActivities: { [key: number]: MetaActivity };
  establishments: { [key: number]: Establishment };
  coaches: { [key: number]: Coach };
  relatedMembersList: MemberMinimal[];
};

type Props = OwnProps &
  WithHandlerType<typeof mapHandlers> &
  ConnectedProps<typeof connector> &
  WithTranslation;

class BoutiqueBookerModule extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      offersConstraint: {
        credit: 0,
      },
      selectedBuyableItemCategory: null,
      selectedOffers: [],
      removedSelectedGroupedOffers: [],
      selectedItem: null,
      isSpotSelectorOpen: false,
      selectedSpotsIds: {},
      selectedSpots: {},
      showBuyableItems: false,
      confirmLoading: false,
      availableConsumerPacks: [],
      buyableItemCategories: [],
      isBookingBlocked: false,
      isWaitingList: false,
      bookingBlockedReason: null,
      offerWasRetrieved: false,
      isSimilarOfferModalOpened: false,
      memberBookingId: -1,
      offerGroupData: null,
      baseOffersWaitingForSpotSelection: [],
      showHiddenSessionsFromSummary: false,
      totalNumberOfOfferInSpotSelection: 0,
      showGroupedOfferInformationModal: false,
    };
  }

  fetchSimilarOffers = () => {
    if (
      this.props.similarOffersTotalCount !== 0 &&
      this.props.similarOffersAllIds.length ===
        this.props.similarOffersTotalCount
    ) {
      return;
    }
    this.props.offer &&
      this.props.fetchSimilarOffersReworked(
        this.props.offer.id,
        {
          page_size: SIMILAR_OFFER_PAGE_SIZE,
        },
        {
          onSuccess: (data?: PaginatedResponse<OfferREST>) => {
            const offers = data?.results;
            if (offers && offers.length) {
              this.props.fetchMetaActivityBulk(
                offers.map((offer) => offer.meta_activity),
              );
              this.props.fetchEstablishmentBulk(
                offers.map((offer) => offer.establishment),
              );

              const coachesId = [
                ...new Set(
                  offers.flatMap((offer) => [
                    offer.coach,
                    ...(typeof offer.coach_override === 'number'
                      ? [offer.coach_override]
                      : []),
                  ]),
                ),
              ];

              this.props.fetchCoachBulkForCompany(
                coachesId,
                this.props.companyId,
              );

              const roomBlueprintIds = new Set();
              offers.forEach((offer) => {
                if (typeof offer.room_blueprint === 'number') {
                  roomBlueprintIds.add(offer.room_blueprint);
                }
              });

              roomBlueprintIds.forEach((blueprint: number) => {
                this.props.fetchRoomBlueprintDetail(blueprint);
                this.props.fetchAssetForBlueprint({ blueprint });
              });

              this.fetchOfferStatusList(offers.map((offer) => offer.id));
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
          ...(this.state.memberBookingId && this.state.memberBookingId !== -1
            ? { booking_for_member: this.state.memberBookingId }
            : {}),
        },
        { onSuccess: this.updateOfferConstraints },
      );
    } else {
      this.updateOfferConstraints();
    }
  };

  componentDidMount() {
    this.props.resetSimilarOffersReworked();
    if (this.props.companyId) {
      this.props.retrieveCompanyCssConfiguration(this.props.companyId);
      this.props.fetchCurrentBasket(this.props.companyId);
      this.props.fetchMyRelatedMemberList(this.props.companyId);
    }
    this.props.fetchOffer(
      this.props.offerId,
      {
        onSuccess: (offer?: OfferREST) => {
          if (!offer) {
            throw new Error('Offer not found');
          }
          this.props.fetchBookingGuestNumber(this.props.offerId);
          this.props.fetchOfferWaitingListPosition(this.props.offerId);
          this.props.fetchCompanyTheme(offer.company);
          this.setState({ offerWasRetrieved: true });
          this.props.fetchMarketplaceSettings(offer.company.toString());
          this.props.fetchCompanyConfiguration(offer.company);
          this.props.fetchBookingFunnelConfiguration(offer.company);
          this.props.resetPaymentPackForBooking();
          this.fetchCompatibleConsumerPaymentPacks();
          this.fetchCompatiblePaymentPacks();
          this.fetchCompatibleComboPacks();
          this.props.fetchContractForBookingHandler(
            this.props.offerId,
            offer.company,
          );
          this.props.fetchMemberTagList(offer.company);
          this.props.fetchAllPaymentPackCategory(offer.company);
          this.props.fetchMetaActivityBulk([offer.meta_activity]);
          this.props.fetchCoachBulkForCompany(
            [
              offer.coach,
              ...(offer.coach_override ? [offer.coach_override] : []),
            ],
            this.props.companyId,
          );
          this.props.fetchEstablishmentBulk([offer.establishment]);
          if (offer.group !== null && typeof offer.group === 'number') {
            this.setState({ showGroupedOfferInformationModal: true });
            this.props.getGroupOfferBookableStatus(offer.group, {
              onSuccess: () => {
                this.updateOfferConstraints();
              },
            });
            this.props.fetchGroup(offer.group, {
              onSuccess: (group) => {
                if (group && !group.full_booking_only) {
                  this.props.fetchOfferBulk(group.offers, {
                    onSuccess: (offers) => {
                      if (offers) this.fetchOffersRelatedObject(offers);
                      this.retrieveFetchedGroupedOffer(group.id);
                      this.props.fetchOfferStatusList(
                        group.offers,
                        {
                          page_size: group.offers.length,
                        },
                        {
                          onSuccess: (offersStatusList) => {
                            const offersWithAvailableStatusIdsList = (
                              offersStatusList ?? []
                            )
                              ?.filter(
                                (offerStatus) =>
                                  offerStatus.bookable_status ===
                                  OFFER_BOOKABLE_STATUS_BOOKABLE,
                              )
                              .map(
                                (filteredOfferStatus) => filteredOfferStatus.id,
                              );
                            this.filterGroupedOfferInSelectedOffer([
                              this.props.offerId,
                              ...offersWithAvailableStatusIdsList,
                            ]);
                            this.setBuyableItemsAndOfferFeature();
                          },
                        },
                      );
                    },
                  });
                } else {
                  this.props.listGroupOfferOffersIdsToBeBooked(offer.group, {
                    onSuccess: (ids) => {
                      this.props.fetchOfferBulk(ids, {
                        onSuccess: (offers) => {
                          this.fetchOffersRelatedObject(offers);
                          this.retrieveFetchedGroupedOffer(offer.group);
                          this.filterGroupedOfferInSelectedOffer(ids);
                        },
                      });
                    },
                  });
                }
              },
            });
          }

          if (offer.room_blueprint !== null) {
            this.setState({ isSpotSelectorOpen: true });
            this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
            this.props.fetchAssetForBlueprint({
              blueprint: offer.room_blueprint,
            });
            this.props.fetchSpotForBlueprint({
              company: this.props.companyId,
            });
          }
          this.fetchOfferStatus();
          this.fetchSimilarOffers();
          this.handleSelectOffer(offer);
        },
      },
      { with_booking_window: true },
    );
  }

  filterGroupedOfferInSelectedOffer = (
    offerAvailableForBookingIdsList: number[],
  ) => {
    const filteredGroupedSelectedOffersList = this.state.selectedOffers.filter(
      (selectedOffer) =>
        offerAvailableForBookingIdsList.includes(selectedOffer?.offer.id),
    );
    const totalNumberOfOfferNeedingSpotSelection =
      filteredGroupedSelectedOffersList.filter(
        (selectedOffer) => selectedOffer.offer.room_blueprint,
      ).length;
    this.setState(
      {
        selectedOffers: filteredGroupedSelectedOffersList,
        totalNumberOfOfferInSpotSelection:
          totalNumberOfOfferNeedingSpotSelection,
      },
      () => {
        this.updateOfferConstraints();
        this.updateOfferSpotSelectorWaitingList();
      },
    );
  };

  retrieveFetchedGroupedOffer = (groupId: number) => {
    const groupedOffersList: OfferREST[] = this.props.getGroupedOffer(groupId);
    const offerGroupData: OffersGroup = this.props.getOfferGroupData(groupId);

    if (offerGroupData && offerGroupData.full_booking_only) {
      this.props.getGroupOfferFirstOfferIdToBeBooked(groupId, {
        onSuccess: (id: number | null) => {
          if (id && this.props.offerId !== id) {
            const params = parseQueryString(window.location.search);
            this.props.replace(
              `/booker-module-s/${this.props.companyId}/${id}${buildUrlParams({
                ...params,
              })}`,
            );
          }
        },
      });
    }
    this.setState(
      {
        offerGroupData: offerGroupData,
      },
      () => {
        this.addFetchedGroupedOfferToSelectedOffers(
          groupedOffersList.filter(
            (offer) => offer && offer.id !== this.props.offerId,
          ),
        );
      },
    );
  };

  fetchOffersRelatedObject = (offersList: Offer[]) => {
    const fetchedCoachesIds: number[] = Object.keys(this.props.coaches).map(
      (key) => Number(key),
    );
    const fetchedEstablishmentIds: number[] = Object.keys(
      this.props.establishments,
    ).map((key) => Number(key));
    const fetchedRoomsIds: number[] = Object.keys(
      this.props.roomBlueprintsById,
    ).map((key) => Number(key));
    const coachesToFetch: number[] = [...offersList]
      .filter((offer) => !fetchedCoachesIds.includes(offer.coach))
      .map((offer) => offer.coach);
    const establishmentToFetch: number[] = [...offersList]
      .filter((offer) => !fetchedEstablishmentIds.includes(offer.establishment))
      .map((offer) => offer.establishment);
    const roomsToFetch: number[] = [...offersList]
      .filter(
        (offer) =>
          offer.room_blueprint &&
          !fetchedRoomsIds.includes(offer.room_blueprint),
      )
      .map((offer) => offer.room_blueprint);

    if (coachesToFetch.length > 0) {
      this.props.fetchCoachBulk(coachesToFetch);
    }

    if (establishmentToFetch.length > 0) {
      this.props.fetchEstablishmentBulk(establishmentToFetch);
    }

    if (roomsToFetch.length > 0) {
      roomsToFetch.forEach((blueprint: number) => {
        this.props.fetchRoomBlueprintDetail(blueprint);
        this.props.fetchAssetForBlueprint({ blueprint });
      });
    }
  };

  getIsGuestBooking = () => this.props.queryParams.guest_booking === 'true';

  getIsFromWorkshopTab = () => this.props.queryParams.fromWorkshop === 'true';

  getAvailableConsumerPack = () => {
    const selectedOffers = this.state.selectedOffers
      .map((selectedOffer) => selectedOffer.offer)
      .filter((offer) => offer.id !== this.props.offerId);
    return getAvailableConsumerPack(
      this.state.offersConstraint,
      this.props.consumerPaymentPackList,
      this.props.cppMaxoutBookings,
      selectedOffers as OfferREST[],
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailablePaymentPacks = (selectedOffers: OfferREST[]) => {
    // Will need to update selectedOffers management for the grouped offer feature
    return getAvailablePaymentPacks(
      this.state.offersConstraint,
      this.props.paymentPackList,
      selectedOffers,
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailableComboPacks = (selectedOffers: OfferREST[]) => {
    return getAvailableComboPacks(
      this.state.offersConstraint,
      this.props.paymentComboList,
      selectedOffers,
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailableContracts = (selectedOffers: OfferREST[]) => {
    return getAvailableContracts(
      this.state.offersConstraint,
      this.props.contractList,
      selectedOffers,
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailablePaymentPackCategories(packs: Array<PaymentPack>) {
    return this.props.paymentPackCategories
      .map((category: PaymentPackCategoryWithPacks) => ({
        ...category,
        packs: packs.filter((p) => p.category === category.id),
      }))
      .filter(
        (category: PaymentPackCategoryWithPacks) => category.packs.length,
      );
  }

  fetchCompatiblePaymentPacks = () => {
    this.props.fetchPaymentPackForBooking(
      this.props.offerId,
      this.props.companyId,
      1,
      300,
    );
  };

  fetchCompatibleConsumerPaymentPacks = () => {
    this.props.fetchConsumerPaymentPackForBooking(this.props.offerId, {
      onSuccess: (cppList) => {
        if (cppList && cppList.length > 0) {
          const cpp_ids = cppList.map((cpp) => cpp.id);
          const pp_ids = cppList.map((cpp) => cpp.payment_pack);

          this.props.fetchPaymentPackBulk(pp_ids);
          this.props.fetchConsumerPaymentPackMaxoutBooking(cpp_ids);
        }
      },
    });
  };

  fetchCompatibleComboPacks = () => {
    if (this.props.companyId !== null) {
      this.props.fetchPaymentComboForBooking(
        this.props.companyId,
        this.props.offerId,
        {
          onSuccess: (comboList: PaymentCombo[]) => {
            const ids = flatten(
              comboList.map((pc) => pc.payment_packs.map((pp) => pp.id)),
            );
            this.props.fetchPaymentPackBulk(ids);
          },
        },
      );
    }
  };

  getBuyableItemCategories = () => {
    const selectedOffers = this.state.selectedOffers
      .map((selectedOffer) => selectedOffer.offer as OfferREST)
      .filter((offer) => offer.id !== this.props.offerId);
    const availablePaymentPacks = this.getAvailablePaymentPacks(
      selectedOffers,
    ).filter((paymentPack) => !paymentPack.exceedsBookingMaxout);
    const availablePaymentPackCategories =
      this.getAvailablePaymentPackCategories(
        // TODO : REBUILD ALL THE COMMON FUNCTIONS AND PROPERLY TYPE THEM
        // @ts-expect-error inconsistent type with PaymentPack
        availablePaymentPacks,
      );
    const availableComboPacks = this.getAvailableComboPacks(
      selectedOffers,
    ).filter((comboPack) => !comboPack.exceedsBookingMaxout);

    let availableContracts: Contract[] = [];
    if (this.state.selectedOffers.length <= 1) {
      // @ts-expect-error Inconsistent type with Contract
      availableContracts = this.getAvailableContracts(selectedOffers).filter(
        (contract) => !contract.exceedsBookingMaxout,
      );
    }

    const availablePaymentPacksWithoutCategory = availablePaymentPacks.filter(
      (paymentPack) => paymentPack?.category === null,
    );
    if (
      this.props.bookingFunnelConfiguration?.current_pricing_option_ordering
    ) {
      const buyableItemCategories = buildBuyableItemCategories(
        availableContracts,
        // TODO : REBUILD ALL THE COMMON FUNCTIONS AND PROPERLY TYPE THEM
        // @ts-expect-error inconsistent type with PaymentCombo and PaymentPack
        availableComboPacks,
        availablePaymentPacksWithoutCategory,
        availablePaymentPackCategories,
        availablePaymentPacks,
        this.props.bookingFunnelConfiguration?.current_pricing_option_ordering,
        this.props.t,
      );
      const recommendedCategory = buyableItemCategories.find(
        (category) => category.id === RECOMMENDED_BUYABLE_CATEGORY_ID,
      );

      const firstBuyableCategoryWithValues = buyableItemCategories.filter(
        (category) => category.values.length > 0,
      )?.[0];

      const updatedCurrentCategory = buyableItemCategories.find(
        (itemCategory) =>
          itemCategory.id === this.state.selectedBuyableItemCategory?.id,
      );

      // If there are any recommended items, then preselect the 'Recommended' category
      this.setState(() => {
        const selectedCategoryBackupValue =
          updatedCurrentCategory || firstBuyableCategoryWithValues;
        return {
          buyableItemCategories,
          selectedBuyableItemCategory:
            recommendedCategory && recommendedCategory.values.length > 0
              ? recommendedCategory
              : selectedCategoryBackupValue &&
                selectedCategoryBackupValue.id === 'RECOMMENDED'
              ? firstBuyableCategoryWithValues
              : null,
        };
      });
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (
      !!this.props.bookingFunnelConfiguration &&
      (!this.props.offer ||
        this.props.offerStatusLoading ||
        this.props.consumerPaymentPackLoading ||
        this.props.consumerPaymentPackMaxoutLoading ||
        this.props.paymentPackLoading ||
        this.props.paymentComboForContractLoading ||
        this.props.paymentComboLoading ||
        this.props.contractLoading ||
        this.props.paymentPackCategoryLoading ||
        this.props.bookingFunnelLoading ||
        this.props.groupOfferLoading ||
        this.props.partialGroupedOffersBulkLoading ||
        this.props.groupedOffersStatusLoading) !==
        (!prevProps.offer ||
          prevProps.offerStatusLoading ||
          prevProps.consumerPaymentPackLoading ||
          prevProps.consumerPaymentPackMaxoutLoading ||
          prevProps.paymentPackLoading ||
          prevProps.paymentComboForContractLoading ||
          prevProps.paymentComboLoading ||
          prevProps.contractLoading ||
          prevProps.paymentPackCategoryLoading ||
          prevProps.bookingFunnelLoading ||
          prevProps.groupOfferLoading ||
          prevProps.partialGroupedOffersBulkLoading ||
          prevProps.groupedOffersStatusLoading)
    ) {
      this.setBuyableItemsAndOfferFeature();
    }
  }

  requestSetupIntentSecret = () => {
    return this.props.requestSetupIntentSecret(this.props.offer?.company);
  };

  updateOfferConstraints = () => {
    const selectedOffers = this.state.selectedOffers
      .map((selectedOffer) => selectedOffer)
      .filter(
        (offerExtraData) => offerExtraData.offer.id !== this.props.offerId,
      );
    const newOfferConstraints = getOfferContraints(
      this.props.offer,
      // @ts-expect-error type inconsistency between common and saas Offer_FULL | OfferRest
      selectedOffers,
      this.props.offerStatusById,
      /**
       * For getOfferContraints logic:
       * in old flow, we could book guest at the same time with member booking
       * we now always book for 1 person at a time, so no need to provide
       * the additional guest count anymore
       */
      0,
      this.getIsGuestBooking(),
    );
    this.setState(
      {
        offersConstraint: newOfferConstraints,
      },
      () => {
        this.getBuyableItemCategories();
        this.unselectIncompatibleItem();
      },
    );
  };

  unselectIncompatibleItem = () => {
    if (!this.state.selectedItem) return;

    const selectedBuyableItemIdentifier =
      this.state.selectedItem.itemIdentifier;

    const mapIdentifierToFunction = {
      [CONSUMER_PAYMENT_PACK_IDENTIFIER]: this.getAvailableConsumerPack,
      [PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER]: this.getAvailablePaymentPacks,
      [PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER]: this.getAvailableComboPacks,
      [CONTRACT_BOOKING_FUNNEL_IDENTIFIER]: this.getAvailableContracts,
    };

    const getAvailableItemsFunction =
      mapIdentifierToFunction[selectedBuyableItemIdentifier];

    const selectedItemId = this.state.selectedItem.data?.id;

    if (!selectedItemId || !getAvailableItemsFunction) return;

    const selectedOffers = this.state.selectedOffers
      .map((selectedOffer) => selectedOffer.offer)
      .filter((offer) => offer.id !== this.props.offerId);

    const itemIsAvailable = getAvailableItemsFunction(
      selectedOffers as OfferREST[],
    ).some?.((item) => item.id === selectedItemId);

    if (!itemIsAvailable) {
      this.setState({
        selectedItem: null,
      });
    }
  };

  goBackToCalendar = () => {
    if (
      this.state.selectedSpots &&
      Object.entries(this.state.selectedSpots).length > 0
    ) {
      const offersWaitingForSpotSelection = this.state.selectedOffers
        .filter((selectedOffer) => selectedOffer.offer.room_blueprint)
        .map((filteredOffer) => filteredOffer.offer);
      this.setState({
        isSpotSelectorOpen: true,
        selectedSpots: {},
        selectedSpotsIds: {},
        baseOffersWaitingForSpotSelection: offersWaitingForSpotSelection,
        totalNumberOfOfferInSpotSelection: offersWaitingForSpotSelection.length,
      });
    } else {
      this.props.goToCalendar({
        date: DateTime.fromISO(this.props.offer.date_start).toISODate(),
      });
    }
  };

  handleRedirectToPass = () => {
    if (this.props.theme?.company_name && this.props.theme?.company) {
      this.props.push(
        `${urlToMarketplaceTab(
          this.props.theme.company_name,
          this.props.theme.company.toString(),
          'pass',
        )}`,
      );
    }
  };

  fetchOfferStatus = () => {
    if (this.props.offer?.id) {
      this.props.fetchOfferStatus(
        this.props.offer?.id,
        {
          booking_for_invitee_only: this.getIsGuestBooking(),
          ...(this.state.memberBookingId && this.state.memberBookingId !== -1
            ? { booking_for_member: this.state.memberBookingId }
            : {}),
        },
        {
          onSuccess: this.updateOfferConstraints,
        },
      );
    } else {
      this.updateOfferConstraints();
    }
  };

  updateSpotForOffer = (offerId: number, index: number) => {
    /* This method gets the selected spot in the canvas of plan to build the spot name with the right prefix and suffix */
    const offersListToCheck = [
      ...this.state.removedSelectedGroupedOffers,
      ...this.state.selectedOffers.map((selectedOffer) => selectedOffer.offer),
    ];
    const offer =
      offersListToCheck.find((offerToCheck) => offerToCheck.id === offerId) ||
      this.props.offer;
    const spot =
      this.props.roomBlueprintsById?.[
        offer?.room_blueprint
      ].canvas?.elements?.find((element) => element.data.index === index)
        ?.data ?? '';

    let prefix = '';
    let suffix = '';

    if (this.props.spotTypes && spot?.spotTypeId !== DEFAULT_SPOT_TYPE_ID) {
      const selectedSpotType = this.props.spotTypes?.find?.(
        (spotType) => spotType.id === spot.spotTypeId,
      );
      prefix = selectedSpotType?.prefix ?? '';
      suffix = selectedSpotType?.suffix ?? '';
    }

    // indexType may be undefined for old layout
    const selectedSpot = spot?.indexType
      ? `${prefix}${spot.indexType}${suffix}`
      : `${prefix}${index}${suffix}`;
    this.setState((prevState) => {
      return {
        selectedSpots: {
          ...prevState.selectedSpots,
          [offerId || this.props.offerId]: selectedSpot,
        },
        selectedSpotsIds: {
          ...prevState.selectedSpotsIds,
          [offerId || this.props.offerId]: index,
        },
      };
    });
  };

  closeSpotSelector = () => {
    this.setState(
      {
        isSpotSelectorOpen: false,
      },
      () => {
        if (this.state.baseOffersWaitingForSpotSelection.length > 0) {
          this.updateOfferSpotSelectorWaitingList();
        }
      },
    );
  };

  closeSpotSelectorIfSpotSelected = () => {
    if (
      this.state.selectedSpotsIds &&
      Object.entries(this.state.selectedSpotsIds).length > 0
    ) {
      this.closeSpotSelector();
    }
  };

  goToSubscriptionPage = (contractId: number) => {
    this.props.push(
      getBoutiqueContractCheckoutUrl(this.props.offer.company, contractId, {
        offerId: this.props.offerId,
        selectedSpotId: this.state.selectedSpotsIds[this.props.offerId],
        ...(this.props.queryParams.guest_first_name && {
          guest_first_name: this.props.queryParams.guest_first_name,
        }),
        ...(this.props.queryParams.guest_last_name && {
          guest_last_name: this.props.queryParams.guest_last_name,
        }),
        ...(this.props.queryParams.guest_email && {
          guest_email: this.props.queryParams.guest_email,
        }),
        ...(this.getIsGuestBooking() && {
          guest_booking: this.getIsGuestBooking().toString(),
        }),
      }),
    );
  };

  onConfirm = () => {
    // If selectedItem is a contract, directly redirect to the booking flow subscription page
    if (
      this.state.selectedItem?.itemIdentifier ===
      CONTRACT_BOOKING_FUNNEL_IDENTIFIER
    ) {
      this.goToSubscriptionPage(this.state.selectedItem?.data.id);
      return;
    }

    this.setState({ confirmLoading: true });

    const memberBookingId =
      this.state.memberBookingId !== -1 ? this.state.memberBookingId : null;

    // TODO to refine - a bit awful especially because we kept the old functions
    const data = buildDataForUserRegistrationWithMultiSessionsAllowed(
      this.state.selectedItem,
      this.state.selectedSpotsIds,
      this.state.selectedOffers,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
      this.state.selectedSpots,
      this.getIsGuestBooking() && {
        firstName: this.props.queryParams.guest_first_name ?? '',
        lastName: this.props.queryParams.guest_last_name ?? '',
        email: this.props.queryParams.guest_email ?? '',
      },
      memberBookingId,
    );

    if (
      this.state.selectedItem?.itemIdentifier ===
      PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
    ) {
      data.payment_pack = this.state.selectedItem?.data.id;
      analyticsUtils.addItemToCart(
        this.state.selectedItem?.data as PaymentPack,
      );
    } else if (
      this.state.selectedItem?.itemIdentifier ===
      PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
    ) {
      data.payment_combo = this.state.selectedItem?.data.id;
      analyticsUtils.addItemToCart(
        this.state.selectedItem?.data as PaymentCombo,
      );
    }

    const isBookingSingleSession = data.offers.length === 1;

    this.props.offerUserRegistration(
      data,
      {
        onSuccess: (responseData: any) => {
          this.setState({ confirmLoading: false });
          if (data.consumer_payment_pack || !data.offers.length) {
            const offersBookedData: OfferBookingValidation[] =
              this.state.selectedOffers.map((offer) => {
                const mappedOffer: OfferBookingValidation = {
                  id: offer.offer.id,
                  isNewPass: false,
                  metaActivityId: getSessionMetaActivityId(offer.offer),
                  coachId: getSessionCoachId(offer.offer),
                  establishmentId: getSessionEstablishmentId(offer.offer),
                  date: offer.offer.date_start,
                };
                if (offer.extra_data?.spot_id)
                  mappedOffer.spotId = offer.extra_data.spot_id;

                if (offer.extra_data?.spot_name)
                  mappedOffer.spotName = offer.extra_data.spot_name;

                return mappedOffer;
              });

            analyticsUtils.onSessionBookingSuccess({
              offersBooked: offersBookedData,
            });
            this.props.push(
              getCheckoutValidationUrl(this.props.offer.company, {
                basket: 'null',
                user_registration_response: encodeURIComponent(
                  JSON.stringify(responseData),
                ),
              }),
            );
          } else {
            this.props.push(
              getCheckoutUrl(this.props.offer.company, {
                user_registration_response: encodeURIComponent(
                  JSON.stringify(responseData),
                ),
              }),
            );
          }
        },
        onError: () => {
          this.setState({ confirmLoading: false });
        },
      },
      { check_offer_unicity: isBookingSingleSession },
    );
  };

  onSelectConsumerPaymentPack = (
    consumerPaymentPack: ConsumerPaymentPack<PaymentPack>,
  ) =>
    this.setState({
      selectedItem: {
        data: consumerPaymentPack,
        itemIdentifier: CONSUMER_PAYMENT_PACK_IDENTIFIER,
      },
    });

  onClickShowBuyableItems = () =>
    this.setState((prevState) => ({
      showBuyableItems: !prevState.showBuyableItems,
    }));

  onClickCategory = (item: BuyableItemCategory) =>
    this.setState({ selectedBuyableItemCategory: item });

  onClickAll = () => this.setState({ selectedBuyableItemCategory: null });

  onClickBuyableItem = (
    buyableItem: BookerModuleBuyableItem,
    itemIdentifier: BuyableItemIdentifier,
  ) => {
    analyticsUtils.viewBuyableItem(buyableItem as CartItem);
    this.setState({
      selectedItem: {
        data: buyableItem,
        itemIdentifier,
      },
    });
  };

  getIsLoading: () => boolean = () => {
    const mainOfferStatusNotLoadedYet =
      !this.props.offerStatusById[this.props.offerId];

    return (
      !this.state.offerWasRetrieved ||
      !this.props.offer ||
      mainOfferStatusNotLoadedYet ||
      this.props.consumerPaymentPackLoading ||
      this.props.consumerPaymentPackMaxoutLoading ||
      this.props.paymentComboForContractLoading ||
      this.props.paymentPackLoading ||
      this.props.paymentComboLoading ||
      this.props.contractLoading ||
      this.props.paymentPackCategoryLoading ||
      this.props.bookingFunnelLoading
    );
  };

  setBuyableItemsAndOfferFeature = () => {
    this.getBuyableItemCategories();

    const {
      isBookable,
      isWaitingList,
      blockedByTags,
      isRegistered,
      isRegisteredWaitingList,
    } = getOfferFeature(
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
    );

    const isBlockedByGroup =
      this.state.offerGroupData &&
      !this.state.offerGroupData.full_booking_only &&
      this.state.selectedOffers.filter(
        (selectedOffer) =>
          this.props.offerStatusById[selectedOffer.offer.id] &&
          this.props.offerStatusById[selectedOffer.offer.id]
            ?.bookable_status !== OFFER_BOOKABLE_STATUS_BOOKABLE,
      ).length > 0;
    let isBookingBlocked = !isBookable || !!blockedByTags || !!isBlockedByGroup;
    const { title, message, icon, color, isWaitingListOpenMainReason } =
      getMainOfferNotBookableReasonWithTitle(
        this.props.offer,
        this.props.offerStatusById[this.props.offerId],
        {
          isBookable,
          isWaitingList,
          isRegistered,
          isRegisteredWaitingList,
          blockedByTags,
        },
        this.props.t,
      );

    if (
      (isWaitingListOpenMainReason &&
        this.props.waitingListConfiguration?.check_credit) ||
      // we still want to access the booking flow for guests even if double booking is disabled
      (this.getIsGuestBooking() && !this.props.theme.accept_double_booking)
    ) {
      isBookingBlocked = false;
    }

    this.setState({ isBookingBlocked });

    const TheIcon = getBookingBlockedReasonIcon(icon);

    this.setState({
      bookingBlockedReason: {
        title,
        message,
        TheIcon,
        color,
        isWaitingListOpenMainReason,
      },
    });

    const availableConsumerPacks = this.getAvailableConsumerPack().filter(
      (consumerPack) => consumerPack.exceedsBookingMaxout === false,
    );

    this.setState({
      // @ts-expect-error inconsistency between common and saas PaymentPack types
      availableConsumerPacks,
    });

    if (
      availableConsumerPacks.length >= 1 &&
      !isBookingBlocked &&
      !this.state.selectedItem
    ) {
      this.setState({
        selectedItem: {
          // @ts-expect-error inconsistency between common and saas PaymentPack types
          data: availableConsumerPacks[0],
          itemIdentifier: CONSUMER_PAYMENT_PACK_IDENTIFIER,
        },
      });
    }
  };

  getMarketplaceSettingsPassTab = () => {
    return !!this.props.marketplaceSettingsConfig?.find(
      (tabConfig) => tabConfig?.component_type === MARKETPLACE_PATH_TAB_PASS,
    );
  };

  getIsWaitingListLoading = () =>
    !this.props.offer ||
    this.props.offerStatusLoading ||
    this.props.waitingListConfigurationLoading ||
    this.props.consumerPacksForBookingLoading ||
    this.props.marketplaceSettingsLoading;

  getPageTitle = () => {
    if (this.state.isBookingBlocked) {
      return this.state.bookingBlockedReason?.title;
    }

    return (this.props.consumerPacksForBooking ?? [])?.length > 0
      ? this.props.t('booking:newBookingModule.reviewAndConfirm')
      : this.props.t('booking:newBookingModule.buyPass');
  };

  getCheckoutItemRelatedToOfferSpot = (offerId: number) => {
    if (this.props.basketIsLoading) return null;
    const offerCheckoutItem = this.props.basket?.checkout_items?.find(
      (checkoutItem) =>
        !!checkoutItem?.extra_data?.offers_data?.[0]?.extra_data?.spot_id &&
        checkoutItem?.extra_data?.offers_data?.[0]?.offer_id === offerId,
    );
    return offerCheckoutItem;
  };

  getSpotExpirationDatetime = (offerId: number) => {
    return this.getCheckoutItemRelatedToOfferSpot(offerId)?.expiration_datetime;
  };

  getSpotCurrentlyInBasket = (offerId: number) => {
    const spotId =
      this.getCheckoutItemRelatedToOfferSpot(offerId)?.extra_data
        ?.offers_data?.[0]?.extra_data?.spot_id;

    return spotId?.toString();
  };

  handleMemberBookingUpdate = (newMemberBookingId: number) => {
    if (!newMemberBookingId) return;

    const newSelectedOffers = this.state.selectedOffers.filter(
      (selectedOffer) => selectedOffer.offer.id === this.props.offerId,
    );
    const newSelectedSpots = filterObjectOnSingleKey<string>(
      this.state.selectedSpots,
      this.props.offerId,
    );
    const newSelectedSpotsIds = filterObjectOnSingleKey<number>(
      this.state.selectedSpotsIds,
      this.props.offerId,
    );

    this.setState(
      {
        selectedOffers: newSelectedOffers,
        selectedSpots: newSelectedSpots || {},
        selectedSpotsIds: newSelectedSpotsIds || {},
        memberBookingId: newMemberBookingId,
      },
      () => {
        const offersIds = [
          this.props.offerId,
          ...this.props.similarOffers.map((similarOffer) => similarOffer.id),
        ];
        this.fetchOfferStatusList(offersIds);
      },
    );
  };

  addFetchedGroupedOfferToSelectedOffers = (offersList: OfferREST[]) => {
    const isFullBookingOnly = this.state.offerGroupData?.full_booking_only;
    const newOffers = offersList.map((offer) => ({
      offer,
      extra_data: {
        protected: isFullBookingOnly,
      },
    }));
    this.setState(
      (prevState: State) => ({
        selectedOffers: [...prevState.selectedOffers, ...newOffers],
      }),
      () => {
        const groupedOfferIds = this.state.selectedOffers.map(
          (selectedOffer) => selectedOffer.offer.id,
        );
        this.filterGroupedOfferInSelectedOffer(groupedOfferIds);
      },
    );
  };

  updateOfferSpotSelectorWaitingList = () => {
    const offersWithSelectedSpots = Object.keys(
      this.state.selectedSpotsIds,
    ).map((offerId) => Number(offerId));
    const offersWaitingForSpotSelection: (OfferREST | Offer_FULL)[] =
      this.state.selectedOffers
        .filter(
          (selectedOffer) =>
            selectedOffer.offer.room_blueprint &&
            !offersWithSelectedSpots.includes(selectedOffer.offer.id),
        )
        .map((selectedOffer) => selectedOffer.offer);
    const isThereSpotToSelectLeft = offersWaitingForSpotSelection.length > 0;

    this.setState({
      baseOffersWaitingForSpotSelection: offersWaitingForSpotSelection,
      isSpotSelectorOpen: isThereSpotToSelectLeft,
    });
  };

  refineOffers = (offer: OfferREST | Offer_FULL): Offer_FULL => {
    let refinedOffer = { ...offer };
    if (typeof offer.coach === 'number') {
      refinedOffer.coach = this.props.coaches[offer.coach] || offer.coach;
    }

    if (typeof offer.establishment === 'number') {
      refinedOffer.establishment =
        this.props.establishments[offer.establishment] || offer.establishment;
    }

    if (typeof offer.meta_activity === 'number') {
      refinedOffer.meta_activity =
        this.props.metaActivities[offer.meta_activity] || offer.meta_activity;
    }
    return refinedOffer as Offer_FULL;
  };

  handleSelectOffer = (offer: OfferREST | Offer_FULL) => {
    if (
      this.state.selectedOffers.findIndex(
        (offerIterator) => offerIterator.offer.id === offer.id,
      ) !== -1
    ) {
      return;
    }

    if (this.state.offerGroupData && this.state.offerGroupData.id) {
      this.setState((prevState: State) => ({
        removedSelectedGroupedOffers:
          prevState.removedSelectedGroupedOffers.filter(
            (removedOffer) => removedOffer.id !== offer.id,
          ),
      }));
    }

    const formattedOffer = this.refineOffers(offer);

    analyticsUtils.onAddSessionToBookingList(formattedOffer);
    this.setState(
      (prevState: State) => ({
        selectedOffers: [
          ...prevState.selectedOffers,
          { offer: formattedOffer, extra_data: {} },
        ],
      }),
      this.updateOfferConstraints,
    );
  };

  handleRemoveOffer = (offerId: number) => {
    const isGrouped = this.state.offerGroupData && this.state.offerGroupData.id;
    this.setState(
      (prevState: State) => {
        const newSelectedSpots = Object.fromEntries(
          Object.entries(prevState.selectedSpots).filter(
            (key) => key && parseInt(key[0], 10) != offerId,
          ),
        );
        const newSelectedSpotsIds = Object.fromEntries(
          Object.entries(prevState.selectedSpotsIds).filter(
            (key) => key && parseInt(key[0], 10) != offerId,
          ),
        );

        let updatedState: Partial<State> = {
          selectedOffers: prevState.selectedOffers.filter(
            (offerIterator) => offerIterator.offer.id !== offerId,
          ),
          selectedSpots: newSelectedSpots,
          selectedSpotsIds: newSelectedSpotsIds,
        };

        if (isGrouped) {
          const removedGroupedOfferData = prevState.selectedOffers.find(
            (offerIterator) => offerIterator.offer.id === offerId,
          )?.offer;
          const formattedOffer = this.refineOffers(removedGroupedOfferData);

          updatedState = {
            ...updatedState,
            removedSelectedGroupedOffers: [
              ...prevState.removedSelectedGroupedOffers,
              formattedOffer,
            ],
          } as Partial<State>;
        }

        return updatedState as State;
      },
      () => {
        this.updateOfferConstraints();
        this.fetchOfferStatusList(
          this.state.selectedOffers.map(
            (selectedOffer) => selectedOffer.offer.id,
          ),
        );
      },
    );
  };

  toggleSimilarOfferModal = () => {
    this.setState((prevState: State) => ({
      isSimilarOfferModalOpened: !prevState.isSimilarOfferModalOpened,
    }));
  };

  toggleDisplayHiddenGroupedSessions = () => {
    this.setState((prevState) => ({
      showHiddenSessionsFromSummary: !prevState.showHiddenSessionsFromSummary,
    }));
  };

  closeGroupedOfferInformationModal = () => {
    this.setState({
      showGroupedOfferInformationModal: false,
    });
  };

  getUnselectedSimilarOrGroupedOffers = (
    similarOrGroupedOffers: (OfferREST | Offer_FULL)[],
  ): Offer_FULL[] => {
    const unselectedSimilarOrGroupedOffers = Object.values(
      similarOrGroupedOffers,
    ).map((filteredOffer) => this.refineOffers(filteredOffer));

    return unselectedSimilarOrGroupedOffers;
  };

  getOfferMissingData = (offer: OfferREST | Offer_FULL) => {
    const metaActivity =
      typeof offer.meta_activity === 'number'
        ? this.props.metaActivities[offer.meta_activity]
        : offer.meta_activity;
    const establishment =
      typeof offer.establishment === 'number'
        ? this.props.establishments[offer.establishment]
        : offer.establishment;
    const coach =
      typeof offer.coach === 'number'
        ? this.props.coaches[offer.coach]
        : offer.coach;
    const offerSummaryLoading =
      !this.props.offer ||
      !this.props.offer?.coach ||
      !this.props.offer?.establishment ||
      !this.props.offer?.meta_activity;

    return { metaActivity, establishment, coach, offerSummaryLoading };
  };

  getSortedSelectedOffersToDisplay = () => {
    return this.state.selectedOffers
      .sort(
        (a, b) =>
          new Date(a.offer.date_start).getTime() -
          new Date(b.offer.date_start).getTime(),
      )
      .reduce((acc, selectedOffer) => {
        if (selectedOffer.offer.id === this.props.offerId) {
          acc.unshift(selectedOffer);
        } else {
          acc.push(selectedOffer);
        }
        return acc;
      }, []);
  };

  render() {
    const { t, containerRef } = this.props;

    const displayPrice = this.state.selectedItem
      ? getBookingDisplayPrice(this.state.selectedItem)
      : '';

    const isRegistered =
      this.props.offerStatusById?.[this.props.offer?.id]?.is_registered;

    const isNoPassCompatibleForBooking =
      this.props.waitingListConfiguration?.check_credit &&
      this.props.consumerPacksForBooking?.length === 0;

    const offerStatus =
      this.props.offerStatusById?.[this.props.offerId] ?? ({} as OfferStatus);

    const isOfferStatusBookable =
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
    const isWaitlistOpen =
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;
    const isWaitlistConvertible =
      offerStatus?.waiting_list_status ===
      OFFER_WAITING_LIST_STATUS_CONVERTIBLE;

    const isWaitingList = this.props.offer?.full && !isWaitlistConvertible;

    const isOfferNotBookableAndNotWaitlistOpen =
      offerStatus && !isOfferStatusBookable && !isWaitlistOpen;
    const hasNoSelectedItem = this.state.selectedItem === null;
    const isBookingBlockedButNotWaitlist =
      this.state.isBookingBlocked &&
      !this.state.bookingBlockedReason?.isWaitingListOpenMainReason;
    const isLoading = this.state.confirmLoading || this.getIsLoading();

    const disableBookingButton =
      isOfferNotBookableAndNotWaitlistOpen ||
      hasNoSelectedItem ||
      isBookingBlockedButNotWaitlist ||
      isLoading;

    const isAbleToFetchMoreSimilarSessions =
      this.props.similarOffersAllIds.length <
      this.props.similarOffersTotalCount;

    const offerBeingSelected =
      this.state.baseOffersWaitingForSpotSelection[0] || this.props.offer;
    const offerIdBeingSelected = offerBeingSelected?.id || this.props.offerId;

    const currentNumberOfOfferBeingSelected =
      this.state.totalNumberOfOfferInSpotSelection -
      (this.state.baseOffersWaitingForSpotSelection.length - 1);

    const isGroupedOffer =
      this.state.offerGroupData && this.state.offerGroupData.id;

    const isFromGroupFullBookingOnly =
      this.state.offerGroupData && this.state.offerGroupData.full_booking_only;

    const selectedOffersIds = this.state.selectedOffers
      .filter((_selectedOffer) => !!_selectedOffer)
      .map((selectedOffers) => selectedOffers.offer.id);

    const offersToDisplayInAddMoreModal =
      this.state.removedSelectedGroupedOffers.length > 0
        ? this.state.removedSelectedGroupedOffers
        : this.props.similarOffers.length > 0
        ? this.props.similarOffers
        : [];

    const similarOrGrouppedOffers = offersToDisplayInAddMoreModal.filter(
      (similarOrGroupedOffer) =>
        !selectedOffersIds.includes(similarOrGroupedOffer.id),
    );

    if (
      this.state.isSpotSelectorOpen &&
      !this.props.assetForBlueprintLoading &&
      !this.props.roomBlueprintLoading &&
      !this.getIsLoading() &&
      !this.state.isBookingBlocked &&
      !isWaitingList &&
      (this.getIsGuestBooking() ||
        !isRegistered ||
        this.props.theme.accept_double_booking)
    ) {
      return (
        <div className="bs-new-offer-booking-page--spot-selector">
          <div className="bs-new-offer-booking__spot-selector__container">
            <div className="bs-new-offer-booking__spot-selector__go-back-container">
              <Button
                classes={{
                  root: 'bs-new-offer-booking__consumer-payment-packs__arrow',
                }}
                onClick={this.goBackToCalendar}
                variant={ButtonVariant.ICON}
              >
                <ArrowBack className="bs-new-offer-booking__consumer-payment-packs__arrow-icon" />
              </Button>
              <div className="bs-new-offer-booking__spot-selector__header__text">
                {t(
                  this.getIsGuestBooking()
                    ? 'newBookingModule.guestSpotSelectorTitle'
                    : this.state.offerGroupData && this.state.offerGroupData.id
                    ? 'newBookingModule.multipleSpotSelectionSpotSelectorTitle'
                    : 'newBookingModule.spotSelectorTitle',
                  {
                    currentSpot: currentNumberOfOfferBeingSelected,
                    totalSpot: this.state.totalNumberOfOfferInSpotSelection,
                  },
                  //add a custom title when selecting a session from a grouped offer
                )}
              </div>
            </div>
            <div className="bs-new-offer-booking__spot-selector__blueprint">
              {this.props.roomBlueprintsById[
                offerBeingSelected.room_blueprint
              ] &&
                this.props.assetByIdBlueprintByIdentifier && (
                  <MarketplaceSpotSelector
                    assetByIdBlueprintByIdentifier={
                      this.props.assetByIdBlueprintByIdentifier
                    }
                    closeSpotSelector={this.closeSpotSelector}
                    expirationDatetime={this.getSpotExpirationDatetime(
                      offerIdBeingSelected,
                    )}
                    fetchOfferStatus={this.fetchOfferStatus}
                    fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
                    goToCheckout={this.props.goTocheckout}
                    offer={offerBeingSelected}
                    offerStatusById={this.props.offerStatusById}
                    roomBlueprintsById={this.props.roomBlueprintsById}
                    selectedSpot={
                      this.state.selectedSpotsIds[offerIdBeingSelected]
                    }
                    spotCurrentlyInBasket={this.getSpotCurrentlyInBasket(
                      offerIdBeingSelected,
                    )}
                    spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(
                      this.props.spotTypes,
                    )}
                    theme={this.props.theme}
                    updateSpotForOffer={this.updateSpotForOffer}
                  />
                )}
            </div>
          </div>
          <div className="bs-new-offer-booking__spot-selector__confirm">
            <Button
              classes={{
                root: 'bs-new-offer-booking__spot-selector__confirm-button',
              }}
              color={ButtonColor.PRIMARY}
              isDisabled={this.state.selectedSpotsIds === null}
              onClick={this.closeSpotSelectorIfSpotSelected}
            >
              {t('spotScheduling:spotSelector.confirm')}
            </Button>

            {this.getSpotExpirationDatetime(offerIdBeingSelected) && (
              <CountDown
                timestamp={
                  this.getSpotExpirationDatetime(offerIdBeingSelected)
                    ? DateTime.fromISO(
                        this.getSpotExpirationDatetime(offerIdBeingSelected),
                      ).toUnixInteger()
                    : DateTime.fromISO('1970-01-01').toUnixInteger()
                }
              >
                {(countdown: string) => {
                  return countdown ? (
                    <Button
                      classes={{
                        root: 'bs-new-offer-booking__spot-selector__go-to-checkout',
                      }}
                      onClick={this.props.goTocheckout}
                      variant={ButtonVariant.OUTLINED}
                    >
                      {t('spotScheduling:spotSelector.goBackToCheckout')}
                      <ArrowForwardIcon />
                    </Button>
                  ) : null;
                }}
              </CountDown>
            )}
          </div>
        </div>
      );
    }

    if (!isRegistered && isWaitingList) {
      const positionInWaitingList =
        this.props.offerStatusWaitingListById[this.props.offerId]
          ?.waiting_list_position?.member_position || 0;
      return (
        <div ref={containerRef} className="bs-new-offer-booking-page">
          <OfferBookingWaitingList
            bookingSpotId={this.state.selectedSpots[this.props.offerId]}
            companyTheme={this.props.theme}
            isLoading={this.getIsWaitingListLoading()}
            isNoPassCompatibleForBooking={isNoPassCompatibleForBooking}
            isPassTabInMarketplaceConfig={this.getMarketplaceSettingsPassTab()}
            isWaitingListRegisterLoading={this.state.confirmLoading}
            offer={this.props.offer}
            offerStatusById={this.props.offerStatusById}
            offerSummaryPrice={displayPrice}
            onRedirectToCalendar={this.goBackToCalendar}
            onRedirectToPass={this.handleRedirectToPass}
            onRegisterToWaitList={this.onConfirm}
            positionInWaitingList={positionInWaitingList}
          />
        </div>
      );
    }

    /**
     * Guest booking: show error for waitlist use case
     * We do not allow guests in waitlists
     */
    if (isWaitingList && this.getIsGuestBooking()) {
      return (
        <div ref={containerRef} className="bs-new-offer-booking-page">
          <MarketplaceBookingBlockedReason
            bookingBlockedReason={{
              title: t('booking:newBookingModule.blockedReasons.default.title'),
              message: t(
                'booking:newBookingModule.blockedReasons.default.message',
              ),
              TheIcon: SlashCircle01,
              color: 'error',
              isWaitingListOpenMainReason: false,
            }}
            goBackToCalendar={this.goBackToCalendar}
            isLoading={this.getIsLoading()}
          />
        </div>
      );
    }

    return (
      <>
        <div ref={containerRef} className="bs-new-offer-booking-page">
          <div className="bs-new-offer-booking-page__pricing_container">
            <div className="bs-new-offer-booking-header">
              {this.getIsLoading() ? (
                <Skeleton className="bs-new-offer-booking__header--loading" />
              ) : (
                <>
                  <Button
                    onClick={this.goBackToCalendar}
                    variant={ButtonVariant.ICON}
                  >
                    <ArrowBack className="bs-new-offer-booking__consumer-payment-packs__arrow-icon" />
                  </Button>
                  <div className="bs-new-offer-booking__consumer-payment-packs__title">
                    {this.getPageTitle()}
                  </div>
                </>
              )}
            </div>
            <div className="bs-new-offer-booking">
              {this.state.isBookingBlocked && !this.getIsLoading() ? (
                <MarketplaceBookingBlockedReason
                  bookingBlockedReason={this.state.bookingBlockedReason}
                  goBackToCalendar={this.goBackToCalendar}
                  isLoading={this.getIsLoading()}
                />
              ) : (
                <>
                  {this.state.isWaitingList && (
                    <Alert severity={AlertSeverity.WARNING}>
                      {t('booking:newBookingModule.waitingListWarning')}
                    </Alert>
                  )}
                  <MarketplaceBookerModuleBuyableItems
                    availableConsumerPacks={this.state.availableConsumerPacks}
                    bookingConfirmButtonComponent={
                      <BookingConfirmButtonWithOfferSummary
                        buttonLoading={this.state.confirmLoading}
                        disabled={disableBookingButton}
                        displayTax={
                          !!this.props.theme?.is_tax_excluded_in_marketplace
                        }
                        OfferSummaryComponent={
                          <div>
                            {this.getSortedSelectedOffersToDisplay().map(
                              ({ offer }) => {
                                const {
                                  coach,
                                  metaActivity,
                                  establishment,
                                  offerSummaryLoading,
                                } = this.getOfferMissingData(offer);
                                const allowOfferDeletion =
                                  (isGroupedOffer &&
                                    !isFromGroupFullBookingOnly &&
                                    offer.id !== this.props.offerId) ||
                                  (!isGroupedOffer &&
                                    offer.id !== this.props.offerId);
                                return (
                                  <BookerModuleOfferSummary
                                    key={offer.id}
                                    isBookingButtonHidden
                                    noStyledContainer
                                    showCredits
                                    showEstablishmentAddress
                                    coach={coach}
                                    companyTheme={this.props.theme}
                                    doAllowDelete={allowOfferDeletion}
                                    establishment={establishment}
                                    expirationDatetime={this.getSpotExpirationDatetime(
                                      this.props.offerId,
                                    )}
                                    goToCheckout={this.props.goTocheckout}
                                    guestName={`${
                                      this.props.queryParams.guest_first_name
                                    } ${
                                      this.props.queryParams.guest_last_name ??
                                      ''
                                    }`}
                                    handleDelete={this.handleRemoveOffer}
                                    isGuestBooking={this.getIsGuestBooking()}
                                    loading={offerSummaryLoading}
                                    metaActivity={metaActivity}
                                    offer={offer}
                                    spotId={
                                      this.state.selectedSpotsIds[offer.id]
                                    }
                                    spotName={
                                      this.state.selectedSpots[offer.id]
                                    }
                                  />
                                );
                              },
                            )}
                          </div>
                        }
                        onClick={this.onConfirm}
                        price={displayPrice}
                        SimilarOfferButtonComponent={
                          <AddMoreSessionsButton
                            canFetchMoreSimilarOffers={
                              isAbleToFetchMoreSimilarSessions
                            }
                            isGuestBooking={this.getIsGuestBooking()}
                            offerStatusById={this.props.offerStatusById}
                            similarOffers={similarOrGrouppedOffers}
                            toggleSimilarOfferModal={
                              this.toggleSimilarOfferModal
                            }
                          />
                        }
                        // @ts-expect-error
                        tax={this.state.selectedItem?.data?.tax}
                        value={
                          isWaitingList
                            ? t(`booking:offer.mainButton.registerWaitingList`)
                            : t(`booking:notification.form.submit`)
                        }
                      />
                    }
                    buyableItemCategories={this.state.buyableItemCategories}
                    hideCreditsForCustomers={
                      this.props.theme.hide_credits_for_customers
                    }
                    hideUnnecessaryCompatiblePurchaseMethod={
                      this.props.theme
                        .hide_unnecessary_compatible_purchase_method
                    }
                    isExcludingTax={
                      !!this.props.theme.is_tax_excluded_in_marketplace
                    }
                    isLoading={this.getIsLoading()}
                    isShowBuyableItems={this.state.showBuyableItems}
                    onClickAll={this.onClickAll}
                    onClickBuyableItem={this.onClickBuyableItem}
                    onClickCategory={this.onClickCategory}
                    onClickShowBuyableItems={this.onClickShowBuyableItems}
                    onSelectConsumerPaymentPack={
                      this.onSelectConsumerPaymentPack
                    }
                    selectedBuyableItemCategory={
                      this.state.selectedBuyableItemCategory
                    }
                    selectedItem={this.state.selectedItem}
                  />
                </>
              )}
            </div>
            <div className="bs-new-offer-booking__offer__summary__container">
              {!isWaitingList &&
                !this.getIsGuestBooking() &&
                !isGroupedOffer &&
                this.props.relatedMembersList &&
                this.props.relatedMembersList.length > 0 && (
                  <BookingForAnotherSelector
                    handleMemberUpdate={this.handleMemberBookingUpdate}
                    memberBookingId={this.state.memberBookingId}
                    relatedMembersList={this.props.relatedMembersList}
                  />
                )}
              <div className="bs-new-offer-booking__offer-summary">
                <BookingConfirmButtonWithOfferSummary
                  buttonLoading={this.state.confirmLoading}
                  disabled={disableBookingButton}
                  displayTax={
                    !!this.props.theme?.is_tax_excluded_in_marketplace
                  }
                  OfferSummaryComponent={
                    <div>
                      {this.getSortedSelectedOffersToDisplay().map(
                        ({ offer }, index) => {
                          const {
                            coach,
                            metaActivity,
                            establishment,
                            offerSummaryLoading,
                          } = this.getOfferMissingData(offer);
                          const allowOfferDeletion =
                            (isGroupedOffer &&
                              !isFromGroupFullBookingOnly &&
                              offer.id !== this.props.offerId) ||
                            (!isGroupedOffer &&
                              offer.id !== this.props.offerId);
                          const activeOfferSummaryClass =
                            isGroupedOffer &&
                            index > 1 &&
                            !this.state.showHiddenSessionsFromSummary
                              ? 'bs-new-offer-booking__offer__card__summary--hidden'
                              : '';
                          return (
                            <div
                              key={offer.id}
                              className={activeOfferSummaryClass}
                            >
                              <BookerModuleOfferSummary
                                key={offer.id}
                                isBookingButtonHidden
                                noStyledContainer
                                showCredits
                                showEstablishmentAddress
                                coach={coach}
                                companyTheme={this.props.theme}
                                doAllowDelete={allowOfferDeletion}
                                establishment={establishment}
                                expirationDatetime={this.getSpotExpirationDatetime(
                                  this.props.offerId,
                                )}
                                goToCheckout={this.props.goTocheckout}
                                guestName={`${
                                  this.props.queryParams.guest_first_name
                                } ${
                                  this.props.queryParams.guest_last_name ?? ''
                                }`}
                                handleDelete={this.handleRemoveOffer}
                                isGuestBooking={this.getIsGuestBooking()}
                                loading={offerSummaryLoading}
                                metaActivity={metaActivity}
                                offer={offer}
                                spotId={this.state.selectedSpotsIds[offer.id]}
                                spotName={this.state.selectedSpots[offer.id]}
                              />
                            </div>
                          );
                        },
                      )}
                      {isGroupedOffer &&
                        this.state.selectedOffers.length >
                          NUMBER_OF_OFFER_TO_ALWAYS_DISPLAY_IN_SUMMARY && (
                          <ShowSessionsButton
                            isExpanded={
                              this.state.showHiddenSessionsFromSummary
                            }
                            sessionsCount={
                              this.state.selectedOffers.length -
                              NUMBER_OF_OFFER_TO_ALWAYS_DISPLAY_IN_SUMMARY
                            }
                            toggleSession={
                              this.toggleDisplayHiddenGroupedSessions
                            }
                          />
                        )}
                    </div>
                  }
                  onClick={this.onConfirm}
                  price={displayPrice}
                  SimilarOfferButtonComponent={
                    <AddMoreSessionsButton
                      canFetchMoreSimilarOffers={
                        isAbleToFetchMoreSimilarSessions
                      }
                      isGuestBooking={this.getIsGuestBooking()}
                      offerStatusById={this.props.offerStatusById}
                      similarOffers={similarOrGrouppedOffers}
                      toggleSimilarOfferModal={this.toggleSimilarOfferModal}
                    />
                  }
                  tax={
                    !!this.state.selectedItem &&
                    'tax' in this.state.selectedItem?.data
                      ? this.state.selectedItem?.data?.tax
                      : undefined
                  }
                  value={
                    isWaitingList
                      ? t(`booking:offer.mainButton.registerWaitingList`)
                      : t(`booking:notification.form.submit`)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {!this.getIsFromWorkshopTab() &&
          this.state.offerGroupData &&
          this.state.offerGroupData.id && (
            <div className="bs-new-offer-booking-grouped-session__information__modal">
              <GroupedOfferInformationModal
                isFullBookingOnly={isFromGroupFullBookingOnly}
                isOpen={this.state.showGroupedOfferInformationModal}
                maxWidth="sm"
                onClose={this.closeGroupedOfferInformationModal}
                onGoBack={this.goBackToCalendar}
                sessionsTotal={this.state.selectedOffers.length}
              />
            </div>
          )}
        {((similarOrGrouppedOffers && similarOrGrouppedOffers.length > 0) ||
          isAbleToFetchMoreSimilarSessions) && (
          <>
            <MultiSessionModalStepper
              assetByIdBlueprintByIdentifier={
                this.props.assetByIdBlueprintByIdentifier
              }
              companyTheme={this.props.theme}
              establishments={this.props.establishments}
              fetchMoreSessions={this.fetchSimilarOffers}
              fetchOfferStatus={this.fetchOfferStatus}
              fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
              getSpotCurrentlyInBasket={this.getSpotCurrentlyInBasket}
              getSpotExpirationDatetime={this.getSpotExpirationDatetime}
              isAbleToFetchMoreSimilarSessions={
                isAbleToFetchMoreSimilarSessions
              }
              isOpen={this.state.isSimilarOfferModalOpened}
              metaActivities={this.props.metaActivities}
              offerStatusById={this.props.offerStatusById}
              onClose={this.toggleSimilarOfferModal}
              onConfirm={this.handleSelectOffer}
              roomBlueprintsById={this.props.roomBlueprintsById}
              selectedSpotsIds={this.state.selectedSpotsIds}
              similarOffers={this.getUnselectedSimilarOrGroupedOffers(
                similarOrGrouppedOffers,
              )}
              similarOffersLoading={this.props.similarOffersLoading}
              similarOffersTotalCount={this.props.similarOffersTotalCount}
              spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(
                this.props.spotTypes,
              )}
              updateSpotForOffer={this.updateSpotForOffer}
            />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: RootState, props: OwnProps) => {
  const offer = withMetaActivity(
    withGroup(withCoach(withEstablishment(getOfferById))),
  )(state, props.offerId);
  const memberTagList = props.memberTagList || getMemberTagsIdsList(state);
  const authenticated = props.authenticated || state.auth.authenticated;
  const isGroupedOfferFullBookingOnly = offer?.group?.full_booking_only;
  return {
    offer,
    offerStatusById: isGroupedOfferFullBookingOnly
      ? getGroupOffersStatus(state, offer?.group.id)
      : state.offer.offerStatus.byId,
    offerStatusLoading: state.offer.offerStatus.loading,
    consumerPaymentPackList: withPaymentPackForConsumer(
      getConsumerPaymentPackForBooking,
    )(state),
    paymentPackList: excludeUnaccessiblePacks(getPaymentPackForBooking)(state, {
      memberTagList,
      authenticated,
    }),
    paymentComboList: withPaymentPackForCombo(getPaymentComboForBooking)(state),
    paymentPackCategories: getAllPaymentPackCategory(state),
    contractList: withPaymentPackForContract(getContractForBooking)(state),
    bookingFunnelConfiguration: state.marketplace.bookingFunnel.configuration,
    cppMaxoutBookings: state.consumerPaymentPack.maxout_booking.byId,
    theme: state.theme.theme,
    isExcludingTax: state.theme.theme.is_tax_excluded_in_marketplace,
    roomBlueprintsById: state.spotScheduling.roomBlueprint.byId,
    assetByIdBlueprintByIdentifier: getAssetByBlueprintByIdentifier(state),
    spotTypes: getSpotTypesOfCompany(state),
    consumerPaymentPackLoading: state.consumerPaymentPack.forBooking.loading,
    consumerPaymentPackMaxoutLoading:
      state.consumerPaymentPack.maxout_booking.loading,
    paymentPackLoading: state.paymentPack.forBooking.loading,
    paymentComboLoading: state.paymentCombo.forBooking.loading,
    contractLoading: state.subscription.contract.forBooking.loading,
    paymentPackCategoryLoading: state.paymentPack.paymentPackCategory.loading,
    paymentComboForContractLoading: state.paymentCombo.forContracts.loading,
    bookingFunnelLoading: state.marketplace.bookingFunnel.loading,
    roomBlueprintLoading: state.spotScheduling.roomBlueprint.loading,
    assetForBlueprintLoading: state.spotScheduling.assetForBlueprint.loading,
    waitingListConfiguration: state.waitingList.configuration.data,
    waitingListConfigurationLoading: state.waitingList.configuration.loading,
    groupOfferLoading: state.groupOffer.loading,
    partialGroupedOffersBulkLoading: state.offer.bulk.loading,
    groupedOffersStatusLoading: state.offer.offerStatus.loading,
    consumerPacksForBooking: state.consumerPaymentPack.forBooking.allIds,
    consumerPacksForBookingLoading:
      state.consumerPaymentPack.forBooking.loading,
    marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
    marketplaceSettingsLoading: state.marketplace.loading,
    customConfiguration: state.exportableComponents.customCss,
    basket: getCurrentBasket(state),
    basketIsLoading: state.checkout.basket.current.loading,
    bookingGuestRemainingCount: getBookingGuestNumberLeft(state),
    offerStatusWaitingListById: getOfferStatusWaitingListPositionById(state),
    similarOffersTotalCount: getSimilarOffersReworkedCount(state),
    similarOffersAllIds: getSimilarOffersReworkedAllIds(state),
    similarOffers: getSimilarOffersReworkedByIdList(state),
    metaActivities: getMetaActivitiesDict(state),
    establishments: getAllEstablishmentsDict(state),
    coaches: getAllCoachesDict(state),
    getOfferBookableStatus: (offerId: number) =>
      getOfferBookableStatus(state, offerId),
    relatedMembersList: getMyRelatedMemberList(state) as MemberMinimal[],
    consumerProfile: getConsumerProfile(state),
    getGroupedOffer: (groupId: number) => getOffersListByGroup(state, groupId),
    getOfferGroupData: (groupId: number) =>
      getGroupDataById(state, groupId) as OffersGroup,
    similarOffersLoading: getSimilarOffersReworkedIsLoading(state),
  };
};

const mapDispatchToProps = {
  fetchOffer,
  fetchConsumerPaymentPackForBooking,
  resetPaymentPackForBooking,
  fetchBookingFunnelConfiguration,
  fetchPaymentPackForBooking,
  fetchContractForBooking: fetchContractForBookingAction as (
    offer: number,
    company: number,
    options: OptionCallback,
  ) => void,
  fetchMemberTagList,
  fetchAllPaymentPackCategory,
  fetchCompanyTheme: fetchCompanyThemeAction,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
  fetchSpotForBlueprint,
  fetchOfferStatus: fetchOfferStatusAction,
  fetchOfferStatusList: fetchOfferStatusListAction,
  fetchSimilarOffersReworked: fetchSimilarOffersReworkedAction,
  resetSimilarOffersReworked: resetSimilarOffersReworkedAction,
  push: pushAction,
  fetchConsumerPaymentPackMaxoutBooking,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchMetaActivityBulk,
  fetchCoachBulkForCompany: fetchCoachBulkForCompanyAction,
  fetchEstablishmentBulk,
  offerUserRegistration,
  fetchPaymentComboForBooking,
  fetchPaymentComboListFromContract: fetchPaymentComboFromContractAction as (
    params: any,
    options: OptionCallback<Array<PaymentCombo>>,
  ) => void,
  replace: replaceAction,
  fetchCompanyConfiguration,
  fetchMarketplaceSettings,
  goBack,
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
  fetchBookingGuestNumber: fetchBookingGuestNumberAction,
  fetchOfferWaitingListPosition: fetchOfferWaitingListPositionAction,
  fetchMyRelatedMemberList: fetchMyRelatedMemberListAction,
  // Grouped offer
  fetchGroup: fetchGroupOfferAction,
  fetchOffersInGroup: fetchOffersInGroupAction,
  listGroupOfferOffersIdsToBeBooked: listGroupOfferOffersIdsToBeBookedAction,
  getGroupOfferFirstOfferIdToBeBooked:
    getGroupOfferFirstOfferIdToBeBookedAction,
  getGroupOfferBookableStatus: getGroupOfferBookableStatusAction,
  fetchOfferBulk: fetchOfferBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
};

const mapHandlers = {
  requestSetupIntentSecret: () => (companyId: number) =>
    requestSetupIntentSecretAPI(null, companyId),

  fetchContractForBookingHandler:
    ({
      fetchContractForBooking,
      fetchPaymentPackBulk,
      fetchPaymentComboListFromContract,
    }: OwnProps & ConnectedProps<typeof connector>) =>
    (offer: number, company: number) => {
      fetchContractForBooking(offer, company, {
        // @ts-expect-error
        onSuccess: (contractList: Contract[]) => {
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack));
          const uniqPaymentComboIds = uniq(
            contractList.map((c) => c.payment_combo),
          ).filter((id) => !!id);
          if (uniqPaymentComboIds.length) {
            fetchPaymentComboListFromContract(
              {
                company,
                id__in: uniqPaymentComboIds,
              },
              {
                onSuccess: (paymentComboList: Array<PaymentCombo>) => {
                  const paymentPackIds = paymentComboList.reduce(
                    (allIds: Array<number>, combo: PaymentCombo) => [
                      ...allIds,
                      ...combo.payment_packs.map((pp) => pp.id),
                    ],
                    [],
                  );
                  paymentPackIds.filter((id) => !!id);
                  if (paymentPackIds.length) {
                    fetchPaymentPackBulk(paymentPackIds);
                  }
                },
              },
            );
          }
        },
      });
    },
  goToCalendar:
    (props: OwnProps & ConnectedProps<typeof connector>) =>
    (params: { date: string }) => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.closeModal();
        window?.close();
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
  goTocheckout: (props: OwnProps & ConnectedProps<typeof connector>) => () => {
    props.push(getCheckoutUrl(props.companyId));
  },
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  // TODO : What is happening exactly, without this translation domains
  // loaded the full page has a double loading the time it retrieves them
  withTranslation([
    'booking',
    'spotScheduling',
    'common',
    'paymentPack',
    'marketplace',
  ]),
  routerParamsToProps({
    companyId: 'companyId:number',
    offerId: 'offerId:number',
  }),
  withQueryParams([
    [
      'fromWorkshop',
      'guest_booking',
      'guest_first_name',
      'guest_last_name',
      'guest_email',
    ],
    'queryParams',
  ]),
  connector,
  withHandlers(mapHandlers),
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
  withScrollHeightListener,
)(BoutiqueBookerModule);
