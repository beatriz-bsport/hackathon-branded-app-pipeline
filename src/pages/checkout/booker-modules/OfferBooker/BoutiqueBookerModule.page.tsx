import React from 'react';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import {
  replace as replaceAction,
  push as pushAction,
  goBack,
} from 'connected-react-router';
import {
  getOfferContraints,
  getMainOfferNotBookableReasonWithTitle,
  getAvailablePaymentPacks,
  getAvailableConsumerPack,
  getAvailableComboPacks,
  getAvailableContracts,
  getOfferFeature,
} from '@bsport/common/lib/master-data/available-payment';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment-timezone';
import './BoutiqueBookerModule.css';
import ArrowBack from '@material-ui/icons/ArrowBack';
import type { SvgIconComponent } from '@material-ui/icons';
import { WithTranslation, withTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import classNames from 'classnames';
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
// @ts-expect-error
import SubscriptionContractBooking from '../SubscriptionPaymentDialog.component';
import {
  fetchPaymentComboForBooking,
  fetchPaymentComboList as fetchPaymentComboListAction,
} from '#libs/payment-combo/actions';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import { buildUrlParams } from '../../../../http';
import {
  buildBuyableItemCategories,
  buildDataForUserRegistration,
  getBookingBlockedReasonIcon,
  getBookingDisplayPrice,
  urlToMarketplace,
} from '#libs/marketplace/utils';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import ConsumerAppBarContainer from '../../ConsumerAppBar.container';
import MarketplaceFilterBuyableItemCategory from '#libs/marketplace/components/MarketplaceFilterBuyableItemCategory';
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
import { fetchBookingFunnelConfiguration } from '#libs/marketplace/actions';
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
import type { Offer, Offer_FULL } from '#libs/offer/types';
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
  CONSUMER_PAYMENT_PACK_IDENTIFIER,
  PAYMENT_COMBO_BOOKING_FUNNEL_IDENTIFIER,
  PAYMENT_PACK_BOOKING_FUNNEL_IDENTIFIER,
} from '#libs/marketplace/constants';
import {
  fetchSpotForBlueprint,
  fetchRoomBlueprintDetail,
  fetchAssetForBlueprint,
} from '#libs/spot-scheduling/actions';
import MarketplaceBuyableItemCategoryList from '#libs/marketplace/components/MarketplaceBuyableItemCategoryList';
import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifier,
} from '#libs/spot-scheduling/selector';
import MarketplaceConsumerPaymentPackCard from '#libs/marketplace/components/MarketplaceConsumerPaymentPackCard';
import OfferSummary from '#libs/offer/OfferSummary';
import type {
  BookerItem,
  BuyableItem,
  BuyableItemCategory,
  BuyableItemIdentifier,
  OfferConstraint,
} from '#libs/booker-module/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Contract } from '#libs/subscription/types';
import MarketplaceBookingBlockedReason from '#libs/marketplace/components/MarketplaceBookingBlockedReason';
import MarketplaceSpotSelector from '#libs/marketplace/components/MarketplaceSpotSelector';
import type { SpotType } from '#libs/spot-scheduling/types';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';

const DEFAULT_SPOT_TYPE = { id: -1 };

const buildUrlForSuccessPage = (
  companyId: number,
  contractId: number,
  pathname: string,
  search: string,
) => {
  return `/checkout/${companyId}/subscription/${contractId}/validation?success=true&next=${encodeURIComponent(
    `${pathname}${search}`,
  )}`;
};

const buildUrlForUnsuccessPage = (
  companyId: number,
  contractId: number,
  pathname: string,
  search: string,
) => {
  return `/checkout/${companyId}/subscription/${contractId}/validation?success=false&next=${encodeURIComponent(
    `${pathname}${search}`,
  )}`;
};

type State = {
  offersConstraint: OfferConstraint;
  selectedBuyableItemCategory: BuyableItemCategory | null;
  selectedItem: BookerItem;
  isSpotSelectorOpen: boolean;
  selectedSpotId: number | null;
  selectedSpot: string | undefined;
  showBuyableItems: boolean;
  confirmLoading: boolean;
  isContractSelected: boolean;
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
};

type OwnProps = {
  id: number;
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
      isContractSelected: false,
      availableConsumerPacks: [],
      buyableItemCategories: [],
      isBookingBlocked: false,
      isWaitingList: false,
      bookingBlockedReason: null,
    };
  }

  componentDidMount() {
    this.props.fetchOffer(this.props.id, {
      onSuccess: (offer: Offer) => {
        this.props.fetchCompanyTheme(offer.company);
        this.props.fetchCompanyConfiguration(offer.company);
        this.props.fetchBookingFunnelConfiguration(offer.company);
        this.props.resetPaymentPackForBooking();
        this.fetchCompatibleConsumerPaymentPacks();
        this.fetchCompatiblePaymentPacks();
        this.fetchCompatibleComboPacks();
        this.props.fetchContractForBookingHandler(this.props.id, offer.company);
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
      this.props.id,
      this.props.offer?.company,
      1,
      300,
    );
  };

  fetchCompatibleConsumerPaymentPacks = () => {
    this.props.fetchConsumerPaymentPackForBooking(this.props.id, {
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
    if (this.props.offer?.company !== null) {
      this.props.fetchPaymentComboForBooking(
        this.props.offer?.company,
        this.props.id,
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

    this.setState({
      buyableItemCategories:
        this.props.bookingFunnelConfiguration
          ?.current_pricing_option_ordering &&
        buildBuyableItemCategories(
          availableContracts,
          availableComboPacks,
          availablePaymentPacksWithoutCategory,
          availablePaymentPackCategories,
          availablePaymentPacks,
          this.props.bookingFunnelConfiguration.current_pricing_option_ordering,
          this.props.t,
        ),
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.offer?.company !== this.props.offer?.company) {
      this.fetchCompatiblePaymentPacks();
      this.fetchCompatibleComboPacks();
      this.props.fetchContractForBookingHandler(
        this.props.id,
        this.props.offer?.company,
      );
      this.props.fetchAllPaymentPackCategory(this.props.offer?.company);
    }

    if (
      !!this.props.bookingFunnelConfiguration &&
      this.arePropsLoading(prevProps) !== this.arePropsLoading(this.props)
    )
      this.setBuyableItemsAndOfferFeature();
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

  goBackToCalendar = () =>
    this.props.goToCalendar({
      date: moment(this.props.offer.date_start).format('YYYY-MM-DD'),
    });

  goBackToCalendarOrSpotSelector = () => {
    if (this.state.selectedSpot) {
      this.setState({
        isSpotSelectorOpen: true,
        selectedSpot: undefined,
        selectedSpotId: null,
      });
    } else {
      this.props.goBack();
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

  updateSpotForOffer = (offer: number, index: number) => {
    /* This method gets the selected spot in the canvas of plan to build the spot name with the right prefix */
    const spot = this.props.roomBlueprintsById[
      this.props.offer.room_blueprint
    ].canvas.elements.find((element) => element.data.index === index).data;

    let prefix = '';

    if (spot.spotTypeId !== DEFAULT_SPOT_TYPE_ID) {
      prefix =
        this.props.spotTypes?.find(
          (spotType) => spotType.id === spot.spotTypeId,
        ).prefix ?? '';
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

  goToValidationPage = (contractId: number, success: boolean) => {
    if (success) {
      this.props.replace(
        buildUrlForSuccessPage(
          this.props.offer.company,
          contractId,
          window.location.pathname,
          window.location.search,
        ),
      );
    } else {
      this.props.replace(
        buildUrlForUnsuccessPage(
          this.props.offer.company,
          contractId,
          window.location.pathname,
          window.location.search,
        ),
      );
    }
  };

  openSubscriptionDialog = () => {
    this.setState({ isContractSelected: true });
  };

  closeSubscripionDialog = () => {
    this.setState({ isContractSelected: false });
  };

  onConfirm = () => {
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
      this.openSubscriptionDialog,
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

  onClickBuyableItem = (
    buyableItem: BuyableItem,
    itemIdentifier: BuyableItemIdentifier,
  ) =>
    this.setState({
      selectedItem: {
        data: buyableItem,
        itemIdentifier,
      },
    });

  arePropsLoading = (props: Props) =>
    !props.offer ||
    props.offerStatusLoading ||
    props.consumerPaymentPackLoading ||
    props.consumerPaymentPackMaxoutLoading ||
    props.paymentPackLoading ||
    props.paymentComboLoading ||
    props.contractLoading ||
    props.paymentPackCategoryLoading ||
    props.bookingFunnelLoading;

  setBuyableItemsAndOfferFeature = () => {
    this.getBuyableItemCategories();

    const {
      isBookable,
      isWaitingList,
      isRegistered,
      isRegisteredWaitingList,
      blockedByTags,
    } = getOfferFeature(
      // @ts-expect-error
      this.props.offer,
      this.props.offerStatusById,
      this.props.theme.accept_double_booking,
      this.props.theme.accept_double_booking_workshop,
    );

    this.setState({ isWaitingList });

    let isBookingBlocked = !isBookable || blockedByTags;

    const { title, message, icon, color, isWaitingListOpenMainReason } =
      getMainOfferNotBookableReasonWithTitle(
        // @ts-expect-error
        this.props.offer,
        this.props.offerStatusById[this.props.id],
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

  render() {
    const { t } = this.props;
    const loading = this.arePropsLoading(this.props);

    let pageTitle = this.state.bookingBlockedReason?.title;
    if (!this.state.isBookingBlocked) {
      if (this.state.availableConsumerPacks.length > 0) {
        pageTitle = this.props.t('newBookingModule.choosePass');
      } else {
        pageTitle = this.props.t('newBookingModule.buyPass');
      }
    }

    if (
      this.state.isSpotSelectorOpen &&
      !this.props.assetForBlueprintLoading &&
      !this.props.roomBlueprintLoading &&
      !this.props.spotForBlueprintLoading
    ) {
      return (
        // @ts-expect-error
        <ConsumerAppBarContainer backgroundColor="white">
          <div className="bs-new-offer-booking-page">
            <div className="bs-new-offer-booking__spot-selector">
              <div className="bs-new-offer-booking__spot-selector__header">
                <button
                  className="bs-new-offer-booking__consumer-payment-packs__arrow"
                  onClick={this.goBackToCalendar}
                  type="button"
                >
                  <ArrowBack />
                </button>
                <div className="bs-new-offer-booking__spot-selector__header__text">
                  {t('newBookingModule.spotSelectorTitle')}
                </div>
              </div>
              {this.props.roomBlueprintsById[
                this.props.offer.room_blueprint
              ] && (
                <MarketplaceSpotSelector
                  assetByIdBlueprintByIdentifier={
                    this.props.assetByIdBlueprintByIdentifier
                  }
                  closeSpotSelector={this.closeSpotSelector}
                  fetchOfferStatus={this.fetchOfferStatus}
                  fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
                  offer={this.props.offer}
                  offerStatusById={this.props.offerStatusById}
                  roomBlueprintsById={this.props.roomBlueprintsById}
                  selectedSpot={this.state.selectedSpotId}
                  spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(
                    this.props.spotTypes,
                  )}
                  theme={this.props.theme}
                  updateSpotForOffer={this.updateSpotForOffer}
                />
              )}
            </div>
            <div className="bs-new-offer-booking__spot-selector__confirm">
              <button
                className={classNames(
                  'bs-new-offer-booking__spot-selector__confirm-button',
                  {
                    'bs-new-offer-booking__spot-selector__confirm-button--disabled':
                      this.state.selectedSpotId === null,
                  },
                )}
                onClick={this.closeSpotSelectorIfSpotSelected}
                type="button"
              >
                {t('spotScheduling:spotSelector.confirm')}
              </button>
            </div>
          </div>
        </ConsumerAppBarContainer>
      );
    }

    if (loading) {
      return (
        // @ts-expect-error
        <ConsumerAppBarContainer backgroundColor="white">
          <>
            <Skeleton
              animation="pulse"
              height={100}
              id="bs-new-offer-booking__skeleton"
              width="50%"
            />
            <Skeleton
              animation="pulse"
              height={100}
              id="bs-new-offer-booking__skeleton"
              width="50%"
            />
            <Skeleton
              animation="pulse"
              height={100}
              id="bs-new-offer-booking__skeleton"
              width="50%"
            />
          </>
        </ConsumerAppBarContainer>
      );
    }

    const displayPrice = this.state.selectedItem
      ? getBookingDisplayPrice(this.state.selectedItem)
      : '';

    return (
      // @ts-expect-error
      <ConsumerAppBarContainer backgroundColor="white">
        <div className="bs-new-offer-booking-page">
          {this.state.isContractSelected && (
            <SubscriptionContractBooking
              companyId={this.props.offer && this.props.offer.company}
              contract={this.state.selectedItem.data}
              isExcludingTax={this.props.isExcludingTax}
              onCancel={this.closeSubscripionDialog}
              onSubmit={this.goToValidationPage}
              requestSetupIntentSecret={this.requestSetupIntentSecret}
            />
          )}
          <div className="bs-new-offer-booking-with-header">
            <div className="bs-new-offer-booking__header">
              <button
                className="bs-new-offer-booking__consumer-payment-packs__arrow"
                onClick={this.goBackToCalendarOrSpotSelector}
                type="button"
              >
                <ArrowBack />
              </button>
              <div className="bs-new-offer-booking__consumer-payment-packs__title">
                {pageTitle}
              </div>
            </div>
            <div className="bs-new-offer-booking">
              <div className="bs-new-offer-booking__cards-list">
                {!this.state.isBookingBlocked ? (
                  <>
                    {this.state.isWaitingList && (
                      <Alert
                        className="bs-new-offer-booking__waiting-list-warning"
                        severity="warning"
                      >
                        {t('newBookingModule.waitingListWarning')}
                      </Alert>
                    )}
                    {this.state.availableConsumerPacks.length > 0 && (
                      <>
                        <div className="bs-new-offer-booking__consumer-payment-packs__subtitle">
                          {t('newBookingModule.myPasses', {
                            count: this.state.availableConsumerPacks.length,
                          })}
                        </div>
                        {this.state.availableConsumerPacks.map(
                          (
                            consumerPaymentPack: ConsumerPaymentPack<PaymentPack> &
                              MaxoutData,
                          ) => {
                            return (
                              <MarketplaceConsumerPaymentPackCard
                                key={consumerPaymentPack.id}
                                consumerPaymentPack={consumerPaymentPack}
                                isSelected={isEqual(
                                  consumerPaymentPack,
                                  this.state.selectedItem?.data,
                                )}
                                onSelectConsumerPaymentPack={
                                  this.onSelectConsumerPaymentPack
                                }
                              />
                            );
                          },
                        )}
                        {!this.props.theme
                          .hide_unnecessary_compatible_purchase_method && (
                          <div className="bs-new-offer-booking__buyable_items__header">
                            <button
                              className="bs-new-offer-booking__buyable_items__header__arrow"
                              onClick={this.onClickShowBuyableItems}
                              type="button"
                            >
                              {this.state.showBuyableItems ? (
                                <KeyboardArrowDown />
                              ) : (
                                <KeyboardArrowRight />
                              )}
                            </button>
                            <div className="bs-new-offer-booking__buyable_items__header__title">
                              {t('newBookingModule.buyNewPass')}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {((this.state.availableConsumerPacks.length !== 0 &&
                      !this.props.theme
                        .hide_unnecessary_compatible_purchase_method &&
                      this.state.showBuyableItems) ||
                      this.state.availableConsumerPacks.length === 0) && (
                      <>
                        <MarketplaceFilterBuyableItemCategory
                          buyableItemCategories={
                            this.state.buyableItemCategories
                          }
                          onClickCategory={this.onClickCategory}
                          selectedBuyableItemCategory={
                            this.state.selectedBuyableItemCategory
                          }
                        />
                        {!this.state.selectedBuyableItemCategory ? (
                          this.state.buyableItemCategories.map(
                            (buyableItemCategory) => (
                              <MarketplaceBuyableItemCategoryList
                                key={buyableItemCategory.index}
                                buyableItemCategory={buyableItemCategory}
                                isExcludingTax={this.props.isExcludingTax}
                                selectBuyableItem={this.onClickBuyableItem}
                                selectedBuyableItem={
                                  this.state.selectedItem?.data as BuyableItem
                                }
                                theme={this.props.theme}
                              />
                            ),
                          )
                        ) : (
                          <MarketplaceBuyableItemCategoryList
                            buyableItemCategory={
                              this.state.selectedBuyableItemCategory
                            }
                            isExcludingTax={this.props.isExcludingTax}
                            selectBuyableItem={this.onClickBuyableItem}
                            selectedBuyableItem={
                              this.state.selectedItem?.data as BuyableItem
                            }
                            theme={this.props.theme}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <MarketplaceBookingBlockedReason
                    bookingBlockedReason={this.state.bookingBlockedReason}
                    goBackToCalendar={this.goBackToCalendar}
                  />
                )}
              </div>
              <div className="bs-new-offer-booking__offer-summary">
                {/* @ts-expect-error */}
                <OfferSummary
                  coach={this.props.offer.coach}
                  confirmLoading={this.state.confirmLoading}
                  disableButton={
                    this.state.selectedItem === null ||
                    (this.state.isBookingBlocked &&
                      !this.state.bookingBlockedReason
                        .isWaitingListOpenMainReason)
                  }
                  establishment={this.props.offer.establishment}
                  loading={loading}
                  metaActivity={this.props.offer.meta_activity}
                  offer={this.props.offer}
                  offerStatus={this.props.offerStatusById[this.props.id]}
                  onConfirm={this.onConfirm}
                  price={displayPrice}
                  spotId={this.state.selectedSpot}
                  tax={this.props.offer.tax}
                  theme={this.props.theme}
                  variant="default"
                />
              </div>
            </div>
          </div>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const mapStateToProps = (state: RootState, props: OwnProps) => {
  const offer: Offer_FULL = withMetaActivity(
    withCoach(withEstablishment(getOfferById)),
    // @ts-expect-error
  )(state, props.id);
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
  fetchPaymentComboList: fetchPaymentComboListAction as (
    params: any,
    options: OptionCallback<Array<PaymentCombo>>,
  ) => void,
  replace: replaceAction,
  fetchCompanyConfiguration,
  goBack,
};

const mapHandlers = {
  requestSetupIntentSecret: () => (companyId: number) =>
    requestSetupIntentSecretAPI(null, companyId),

  fetchContractForBookingHandler:
    ({
      fetchContractForBooking,
      fetchPaymentPackBulk,
      fetchPaymentComboList,
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
            fetchPaymentComboList(
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  routerParamsToProps({
    id: 'id:number',
  }),
  withQueryParams([['fromWorkshop'], 'queryParams']),
  connector,
  withHandlers(mapHandlers),
  withTranslation(['booking', 'spotScheduling']),
  marketplaceCssHoc(),
)(BoutiqueBookerModule);
