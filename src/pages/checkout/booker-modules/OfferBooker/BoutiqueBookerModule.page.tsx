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
} from '@bsport/common/lib/master-data/available-payment';
import moment from 'moment-timezone';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { WithTranslation, withTranslation } from 'react-i18next';
import { SvgIconComponent } from '@material-ui/icons';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import Alert, { AlertSeverity } from '#csscomponents/Alert';
// @ts-expect-error
import Analytics from '#components/analytics/Analytics.component';
import type { WithHandlerType } from '../../../../utils/types';
import type { OptionCallback } from '../../../../state/types';
import type {
  MaxoutData,
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import {
  fetchPaymentComboForBooking,
  fetchPaymentComboFromContract as fetchPaymentComboFromContractAction,
} from '#libs/payment-combo/actions';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '#libs/checkout/actions';
import { getCurrentBasket } from '#libs/checkout/selectors';
import { buildUrlParams } from '../../../../http';
import {
  buildBuyableItemCategories,
  buildDataForUserRegistration,
  getBookingBlockedReasonIcon,
  getBookingDisplayPrice,
  urlToMarketplace,
  urlToMarketplaceTab,
} from '#libs/marketplace/utils';
import {
  RECOMMENDED_BUYABLE_CATEGORY_ID,
  MARKETPLACE_PATH_TAB_PASS,
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
  CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  retrieveOffer as fetchOffer,
  fetchOfferStatus as fetchOfferStatusAction,
  offerUserRegistration,
} from '#libs/offer/actions';
import { getMemberTagsIdsList } from '#libs/tag/selectors';

import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
  // @ts-expect-error
} from '#libs/subscription/selectors';
import { fetchContractForBooking as fetchContractForBookingAction } from '#libs/subscription/actions';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack as withPaymentPackForConsumer,
} from '#libs/consumer-payment-pack/selectors';
import {
  fetchConsumerPaymentPackForBooking,
  fetchConsumerPaymentPackMaxoutBooking,
} from '#libs/consumer-payment-pack/actions';
import { fetchCoachBulk } from '#libs/associated-coach/actions';
import { fetchMetaActivityBulk } from '#libs/meta-activity/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import {
  fetchBookingFunnelConfiguration,
  fetchMarketplaceSettings,
} from '#libs/marketplace/actions';
import { RootState } from '../../../../reducers';
import {
  getPaymentComboForBooking,
  withPaymentPack as withPaymentPackForCombo,
} from '#libs/payment-combo/selectors';
import { fetchEstablishmentBulk } from '#libs/establishment/actions';
import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchAllPaymentPackCategory,
  resetPaymentPackForBooking,
} from '#libs/payment-packs/actions';
import {
  excludeUnaccessiblePacks,
  getPaymentPackForBooking,
  getAllPaymentPackCategory,
} from '#libs/payment-packs/selectors';
import { fetchCompanyConfiguration } from '#libs/waiting-list/actions';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import { type Offer, type OfferStatus } from '#libs/offer/types';
import {
  withEstablishment,
  withCoach,
  withMetaActivity,
  getOfferById,
} from '#libs/offer/selectors';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { fetchMemberTagList } from '#libs/tag/actions';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#libs/spot-scheduling/actions';
import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#libs/spot-scheduling/selector';
import type {
  BookerItem,
  BookerModuleBuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
  OfferConstraint,
} from '#libs/booker-module/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Contract } from '#libs/subscription/types';
import OfferBookingWaitingList from '#libs/offer/components/OfferBookingWaitingList';
import MarketplaceBookingBlockedReason from '#marketplacecomponents/@Booking/MarketplaceBookingBlockedReason';
import MarketplaceSpotSelector from '#marketplacecomponents/@SpotScheduling/MarketplaceSpotSelector';
import type { SpotType } from '#libs/spot-scheduling/types';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';
import {
  getCheckoutUrl,
  getCheckoutValidationUrl,
  getBoutiqueContractCheckoutUrl,
} from '#libs/marketplace/routing-utils';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { OffersGroup } from '#libs/group-offer/types';
import { consumerAppBarHOC } from '#hocs/consumer-app-bar.hoc';
import MarketplaceBookerModuleBuyableItems from '#marketplacecomponents/@BuyableItem/MarketplaceBookerModuleBuyableItems';
import Button, {
  ButtonColor,
  ButtonVariant,
} from '#components/css-only/Fabrique/Button';
import Skeleton, { SkeletonVariant } from '#components/css-only/Skeleton';
import BookingConfirmButtonWithOfferSummary from '#libs/booking/components/BookingConfirmButtonWithOfferSummary.component';
import CountDown from '#components/time/CountDown.component';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#libs/exportable-components/actions';
import WithCustomCssProvider from '#hocs/company-custom-css.hoc';
import BookerModuleOfferSummary from '#libs/marketplace/components/@Offer/BookerModuleOfferSummary';

import './BoutiqueBookerModule.css';

const DEFAULT_SPOT_TYPE = { id: -1 };

type State = {
  offersConstraint: OfferConstraint;
  selectedBuyableItemCategory: BuyableItemCategory | null;
  selectedItem: BookerItem;
  isSpotSelectorOpen: boolean;
  selectedSpotId: number | null;
  selectedSpot: string | undefined;
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
  };
  offerWasRetrieved: boolean;
};

type OwnProps = {
  companyId: number;
  offerId: number;
  queryParams: { fromWorkshop: string };
  memberTagList: number[];
  authenticated: boolean;
  goBack: () => void;
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
      selectedItem: null,
      isSpotSelectorOpen: false,
      selectedSpotId: null,
      selectedSpot: undefined,
      showBuyableItems: false,
      confirmLoading: false,
      availableConsumerPacks: [],
      buyableItemCategories: [],
      isBookingBlocked: false,
      isWaitingList: false,
      bookingBlockedReason: null,
      offerWasRetrieved: false,
    };
  }

  componentDidMount() {
    if (this.props.companyId) {
      this.props.retrieveCompanyCssConfiguration(this.props.companyId);
      this.props.fetchCurrentBasket(this.props.companyId);
    }
    this.props.fetchOffer(this.props.offerId, {
      onSuccess: (offer: Offer) => {
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
        this.props.fetchCoachBulk([offer.coach, offer.coach_override]);
        this.props.fetchEstablishmentBulk([offer.establishment]);
        if (offer.room_blueprint !== null) {
          this.setState({ isSpotSelectorOpen: true });
          this.props.fetchRoomBlueprintDetail(offer.room_blueprint);
          this.props.fetchAssetForBlueprint({
            blueprint: offer.room_blueprint,
          });
        }
        this.fetchOfferStatus();
      },
    });
  }

  getAvailableConsumerPack = () => {
    return getAvailableConsumerPack(
      this.state.offersConstraint,
      this.props.consumerPaymentPackList,
      this.props.cppMaxoutBookings,
      [],
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailablePaymentPacks = () => {
    return getAvailablePaymentPacks(
      this.state.offersConstraint,
      this.props.paymentPackList,
      [],
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailableComboPacks = () => {
    return getAvailableComboPacks(
      this.state.offersConstraint,
      this.props.paymentComboList,
      [],
      this.props.offer,
      this.props.offer?.timezone_name,
    );
  };

  getAvailableContracts = () => {
    return getAvailableContracts(
      this.state.offersConstraint,
      this.props.contractList,
      [],
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
        if (cppList.length > 0) {
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
    const availablePaymentPacks = this.getAvailablePaymentPacks();
    const availablePaymentPackCategories =
      this.getAvailablePaymentPackCategories(availablePaymentPacks);
    const availableComboPacks = this.getAvailableComboPacks();
    const availableContracts = this.getAvailableContracts();
    const availablePaymentPacksWithoutCategory = availablePaymentPacks.filter(
      (paymentPack: PaymentPack) => paymentPack.category === null,
    );
    if (
      this.props.bookingFunnelConfiguration?.current_pricing_option_ordering
    ) {
      const buyableItemCategories = buildBuyableItemCategories(
        availableContracts,
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

      // If there are any recommended items, then preselect the 'Recommended' category
      this.setState((prevState) => ({
        buyableItemCategories,
        selectedBuyableItemCategory:
          recommendedCategory ?? prevState.selectedBuyableItemCategory,
      }));
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
        this.props.paymentComboLoading ||
        this.props.contractLoading ||
        this.props.paymentPackCategoryLoading ||
        this.props.bookingFunnelLoading) !==
        (!prevProps.offer ||
          prevProps.offerStatusLoading ||
          prevProps.consumerPaymentPackLoading ||
          prevProps.consumerPaymentPackMaxoutLoading ||
          prevProps.paymentPackLoading ||
          prevProps.paymentComboLoading ||
          prevProps.contractLoading ||
          prevProps.paymentPackCategoryLoading ||
          prevProps.bookingFunnelLoading)
    ) {
      this.setBuyableItemsAndOfferFeature();
    }
  }

  requestSetupIntentSecret = () => {
    return this.props.requestSetupIntentSecret(this.props.offer?.company);
  };

  updateOfferConstraints = () => {
    this.setState(() => {
      return {
        offersConstraint: getOfferContraints(
          // @ts-expect-error
          this.props.offer,
          [],
          this.props.offerStatusById,
          0,
        ),
      };
    });
  };

  goBackToCalendar = () => {
    if (this.state.selectedSpot) {
      this.setState({
        isSpotSelectorOpen: true,
        selectedSpot: undefined,
        selectedSpotId: null,
      });
    } else {
      this.props.goToCalendar({
        date: moment(this.props.offer.date_start).format('YYYY-MM-DD'),
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
    if (this.props.offer.id) {
      this.props.fetchOfferStatus(
        this.props.offer.id,
        {},
        {
          onSuccess: this.updateOfferConstraints,
        },
      );
    } else {
      this.updateOfferConstraints();
    }
  };

  updateSpotForOffer = (_: number, index: number) => {
    /* This method gets the selected spot in the canvas of plan to build the spot name with the right prefix */
    const spot =
      this.props.roomBlueprintsById?.[
        this.props.offer?.room_blueprint
      ].canvas?.elements?.find((element) => element.data.index === index)
        ?.data ?? '';

    let prefix = '';

    if (this.props.spotTypes && spot?.spotTypeId !== DEFAULT_SPOT_TYPE_ID) {
      prefix =
        this.props.spotTypes?.find?.(
          (spotType) => spotType.id === spot.spotTypeId,
        )?.prefix ?? '';
    }

    const selectedSpot = prefix + spot.indexType.toString();

    this.setState({
      selectedSpot,
      selectedSpotId: index,
    });
  };

  closeSpotSelector = () => {
    this.setState({
      isSpotSelectorOpen: false,
    });
  };

  closeSpotSelectorIfSpotSelected = () => {
    if (this.state.selectedSpotId !== null) {
      this.closeSpotSelector();
    }
  };

  goToSubscriptionPage = (contractId: number) => {
    this.props.push(
      getBoutiqueContractCheckoutUrl(this.props.offer.company, contractId, {
        offerId: this.props.offerId,
        selectedSpotId: this.state.selectedSpotId,
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

    const offerFeature = getOfferFeature(
      // @ts-expect-error
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
    );

    const data = buildDataForUserRegistration(
      offerFeature,
      this.state.selectedItem,
      this.props.offer.id,
      this.state.selectedSpotId,
    );

    if (
      this.state.selectedItem?.itemIdentifier ===
      PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER
    ) {
      data.payment_pack = this.state.selectedItem?.data.id;
      Analytics.addPassToCart(this.state.selectedItem?.data);
    } else if (
      this.state.selectedItem?.itemIdentifier ===
      PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER
    ) {
      data.payment_combo = this.state.selectedItem?.data.id;
      Analytics.addPackToCart(this.state.selectedItem?.data);
    }

    this.props.offerUserRegistration(
      data,
      {
        onSuccess: (responseData: any) => {
          this.setState({ confirmLoading: false });
          if (data.consumer_payment_pack || !data.offers.length) {
            this.props.push(
              getCheckoutValidationUrl(this.props.offer.company, true, {
                basket: 'null',
                user_registration_response: encodeURIComponent(
                  JSON.stringify(responseData),
                ),
              }),
            );
          } else {
            this.props.push(
              getCheckoutUrl(this.props.offer.company, true, {
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
      { check_offer_unicity: true },
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
  ) =>
    this.setState({
      selectedItem: {
        data: buyableItem,
        itemIdentifier,
      },
    });

  getIsLoading: () => boolean = () => {
    return (
      !this.state.offerWasRetrieved ||
      !this.props.offer ||
      this.props.offerStatusLoading ||
      this.props.consumerPaymentPackLoading ||
      this.props.consumerPaymentPackMaxoutLoading ||
      this.props.paymentPackLoading ||
      this.props.paymentComboLoading ||
      this.props.contractLoading ||
      this.props.paymentPackCategoryLoading ||
      this.props.bookingFunnelLoading
    );
  };

  setBuyableItemsAndOfferFeature = () => {
    this.getBuyableItemCategories();

    const { isBookable, blockedByTags, isRegistered, isRegisteredWaitingList } =
      getOfferFeature(
        // @ts-expect-error
        this.props.offer,
        this.props.offerStatusById,
        this.props.theme.accept_double_booking,
        this.props.theme.accept_double_booking_workshop,
      );

    let isBookingBlocked = !isBookable || blockedByTags;

    const { title, message, icon, color, isWaitingListOpenMainReason } =
      getMainOfferNotBookableReasonWithTitle(
        // @ts-expect-error
        this.props.offer,
        this.props.offerStatusById[this.props.offerId],
        {
          isBookable,
          isRegistered,
          isRegisteredWaitingList,
          blockedByTags,
        },
        this.props.t,
      );

    if (
      isWaitingListOpenMainReason &&
      this.props.waitingListConfiguration.check_credit
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

    const availableConsumerPacks = this.getAvailableConsumerPack();

    this.setState({
      availableConsumerPacks,
    });

    if (availableConsumerPacks.length >= 1 && !isBookingBlocked) {
      this.setState({
        selectedItem: {
          data: availableConsumerPacks[0],
          itemIdentifier: CONSUMER_PAYMENT_PACK_IDENTIFIER,
        },
      });
    }
  };

  getMarketplaceSettingsPassTab = () => {
    return !!this.props.marketplaceSettings?.config?.find(
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

    return (this.props.consumerPacksForBooking || [])?.length > 0
      ? this.props.t('booking:newBookingModule.reviewAndConfirm')
      : this.props.t('booking:newBookingModule.buyPass');
  };

  getCheckoutItemRelatedToOfferSpot = () => {
    if (this.props.basketIsLoading) return null;

    const offerCheckoutItem = this.props.basket?.checkout_items?.find(
      (checkoutItem) =>
        !!checkoutItem?.extra_data?.offers_data?.[0]?.extra_data?.spot_id &&
        checkoutItem?.extra_data?.offers_data?.[0]?.offer_id ===
          this.props.offerId,
    );
    return offerCheckoutItem;
  };

  getSpotExpirationDatetime = () => {
    return this.getCheckoutItemRelatedToOfferSpot()?.expiration_datetime;
  };

  getSpotCurrentlyInBasket = () => {
    return this.getCheckoutItemRelatedToOfferSpot()?.extra_data
      ?.offers_data?.[0]?.extra_data?.spot_id;
  };

  render() {
    const { t } = this.props;
    const offerSummaryLoading =
      !this.props.offer ||
      !this.props.offer?.coach ||
      !this.props.offer?.establishment ||
      !this.props.offer?.meta_activity;

    const displayPrice = this.state.selectedItem
      ? getBookingDisplayPrice(this.state.selectedItem)
      : '';

    const isWaitingList = this.props.offer?.full;

    const isRegistered =
      this.props.offerStatusById?.[this.props.offer?.id]?.is_registered;

    const isNoPassCompatibleForBooking =
      this.props.waitingListConfiguration?.check_credit &&
      this.props.consumerPacksForBooking?.length === 0;

    const offerStatus =
      this.props.offerStatusById?.[this.props.offerId] ?? ({} as OfferStatus);

    const isBookable =
      offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
    const isWaitlistOpen =
      offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;

    const disableBookingButton =
      this.state.selectedItem === null ||
      (this.state.isBookingBlocked &&
        !this.state.bookingBlockedReason.isWaitingListOpenMainReason);
    if (
      this.state.isSpotSelectorOpen &&
      !this.props.assetForBlueprintLoading &&
      !this.props.roomBlueprintLoading &&
      !this.props.spotForBlueprintLoading &&
      !isWaitingList
    ) {
      return (
        <div className="bs-new-offer-booking-page">
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
                {t('newBookingModule.spotSelectorTitle')}
              </div>
            </div>
            <div className="bs-new-offer-booking__spot-selector__blueprint">
              {this.props.roomBlueprintsById[
                this.props.offer.room_blueprint
              ] && (
                <MarketplaceSpotSelector
                  assetByIdBlueprintByIdentifier={
                    this.props.assetByIdBlueprintByIdentifier
                  }
                  closeSpotSelector={this.closeSpotSelector}
                  expirationDatetime={this.getSpotExpirationDatetime()}
                  fetchOfferStatus={this.fetchOfferStatus}
                  fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
                  goToCheckout={this.props.goTocheckout}
                  offer={this.props.offer}
                  offerStatusById={this.props.offerStatusById}
                  roomBlueprintsById={this.props.roomBlueprintsById}
                  selectedSpot={this.state.selectedSpotId}
                  spotCurrentlyInBasket={this.getSpotCurrentlyInBasket()}
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
              isDisabled={this.state.selectedSpotId === null}
              onClick={this.closeSpotSelectorIfSpotSelected}
            >
              {t('spotScheduling:spotSelector.confirm')}
            </Button>

            {this.getSpotExpirationDatetime() && (
              <CountDown
                timestamp={moment(this.getSpotExpirationDatetime()).unix()}
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
      return (
        <div className="bs-new-offer-booking-page">
          <OfferBookingWaitingList
            bookingSpotId={this.state.selectedSpot}
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
          />
        </div>
      );
    }

    return (
      <div className="bs-new-offer-booking-page">
        <div className="bs-new-offer-booking-page__pricing_container">
          <div className="bs-new-offer-booking-header">
            {this.getIsLoading() ? (
              <Skeleton
                className="bs-new-offer-booking__header--loading"
                variant={SkeletonVariant.RECTANGLE}
              />
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
                  buyableItemCategories={this.state.buyableItemCategories}
                  companyTheme={this.props.theme}
                  hideCreditsForCustomers={
                    this.props.theme.hide_credits_for_customers
                  }
                  hideUnnecessaryCompatiblePurchaseMethod={
                    this.props.theme.hide_unnecessary_compatible_purchase_method
                  }
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  isLoading={this.getIsLoading()}
                  isShowBuyableItems={this.state.showBuyableItems}
                  onClickAll={this.onClickAll}
                  onClickBuyableItem={this.onClickBuyableItem}
                  onClickCategory={this.onClickCategory}
                  onClickShowBuyableItems={this.onClickShowBuyableItems}
                  onSelectConsumerPaymentPack={this.onSelectConsumerPaymentPack}
                  selectedBuyableItemCategory={
                    this.state.selectedBuyableItemCategory
                  }
                  selectedItem={this.state.selectedItem}
                />
              </>
            )}
          </div>
          <div className="bs-new-offer-booking__offer-summary">
            <BookingConfirmButtonWithOfferSummary
              buttonLoading={this.state.confirmLoading}
              disabled={
                (offerStatus && !isBookable && !isWaitlistOpen) ||
                disableBookingButton ||
                this.state.confirmLoading ||
                this.getIsLoading()
              }
              displayTax={this.props.theme?.is_tax_excluded_in_marketplace}
              isBookable={isBookable}
              OfferSummaryComponent={() => (
                <BookerModuleOfferSummary
                  isBookingButtonHidden
                  noStyledContainer
                  showCredits
                  showEstablishmentAddress
                  coach={this.props.offer?.coach}
                  // Must be change, these information can be fetch and display faster to reduce loadig time feelling.
                  companyTheme={this.props.theme}
                  establishment={this.props.offer?.establishment}
                  expirationDatetime={this.getSpotExpirationDatetime()}
                  goToCheckout={this.props.goTocheckout}
                  loading={offerSummaryLoading}
                  metaActivity={this.props.offer?.meta_activity}
                  offer={this.props.offer}
                  spotId={this.state.selectedSpot}
                />
              )}
              onClick={this.onConfirm}
              price={displayPrice}
              // @ts-expect-error
              tax={this.state.selectedItem?.data?.tax}
              value={
                !this.props.offer?.full
                  ? t(`booking:notification.form.submit`)
                  : t(`booking:offer.mainButton.registerWaitingList`)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, props: OwnProps) => {
  const offer: Offer<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    OffersGroup
  > = withMetaActivity(withCoach(withEstablishment(getOfferById)))(
    state,
    props.offerId,
  );
  const memberTagList = props.memberTagList || getMemberTagsIdsList(state);
  const authenticated = props.authenticated || state.auth.authenticated;
  return {
    offer,
    offerStatusById: state.offer.offerStatus.byId,
    offerStatusLoading: state.offer.offerStatus.loading,
    consumerPaymentPackList: withPaymentPackForConsumer(
      getConsumerPaymentPackForBooking,
    )(state) as ConsumerPaymentPack<PaymentPack>[],
    paymentPackList: excludeUnaccessiblePacks(getPaymentPackForBooking)(state, {
      memberTagList,
      authenticated,
    }),
    paymentComboList: withPaymentPackForCombo(getPaymentComboForBooking)(
      state,
    ) as PaymentCombo[],
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
    bookingFunnelLoading: state.marketplace.bookingFunnel.loading,
    roomBlueprintLoading: state.spotScheduling.roomBlueprint.loading,
    assetForBlueprintLoading: state.spotScheduling.assetForBlueprint.loading,
    spotForBlueprintLoading: state.spotScheduling.spotForBlueprint.loading,
    waitingListConfiguration: state.waitingList.configuration.data,
    waitingListConfigurationLoading: state.waitingList.configuration.loading,
    consumerPacksForBooking: state.consumerPaymentPack.forBooking.allIds,
    consumerPacksForBookingLoading:
      state.consumerPaymentPack.forBooking.loading,
    marketplaceSettings: state.marketplace.settings,
    marketplaceSettingsLoading: state.marketplace.loading,
    customConfiguration: state.exportableComponents.customCss,
    basket: getCurrentBasket(state),
    basketIsLoading: state.checkout.basket.current.loading,
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
  push: pushAction,
  fetchConsumerPaymentPackMaxoutBooking,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchMetaActivityBulk,
  fetchCoachBulk,
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
    props.push(getCheckoutUrl(props.companyId, true));
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
  withQueryParams([['fromWorkshop'], 'queryParams']),
  connector,
  withHandlers(mapHandlers),
  marketplaceCssHoc(),
  WithCustomCssProvider,
  consumerAppBarHOC(),
)(BoutiqueBookerModule);
