import React from 'react';
import {
  replace as replaceRouter,
  push as pushRouter,
  goBack,
} from 'connected-react-router';
import flatten from 'lodash/flatten';
import { compose, withHandlers, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import { RouterProps } from 'react-router';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';
import { OFFER_BOOKABLE_STATUS_ALREADY_BOOKED } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import themeSelectors from '#src/libs/theme/selectors';
import { getBasket } from '#src/libs/checkout/selectors';
import {
  getOfferFromList,
  withMetaActivity,
  withCoach,
  withEstablishment,
  getBookingGuestNumberLeft,
  getOfferBookableStatus,
  getOfferStatusWaitingListPosition,
  getBookableStatusData,
} from '#src/libs/offer/selectors';
import { withCustomLevel } from '#src/libs/level/selectors';
import { getSubscriptionDetail } from '#src/libs/subscription/selectors';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import {
  fetchOfferBulk as fetchOfferBulkAction,
  fetchOfferStatusList as fetchOfferStatusListAction,
  fetchBookingGuestNumber as fetchBookingGuestNumberAction,
  fetchOfferWaitingListPosition as fetchOfferWaitingListPositionAction,
} from '#src/libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
import { fetchBasket as fetchBasketAction } from '#src/libs/checkout/actions';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { fetchPrivatePassBulk as fetchPrivatePassBulkAction } from '#src/libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';
import { fetch as fetchBillingPlanAction } from '#src/libs/subscription/actions';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { urlToMarketplace } from '#src/libs/marketplace/utils';
import { withExtraDataFromQueryParams } from '#src/libs/booker-module/utils';

import type { CompanyTheme } from '#src/libs/theme/types';
import type { OfferWithSpotInformation } from '#src/libs/offer/types';
import type {
  ExtraDataFromQueryParams,
  UserRegistrationResponse,
} from '#src/libs/booker-module/types';
import { BuyableItemOptions, type Basket } from '#src/libs/checkout/types';

import MarketplaceOfferBookingList from '#src/libs/marketplace/components/@Booking/MarketplaceOfferBookingList';

import {
  checkIfPurchasedPassGrantsDoorAccess,
  getConfirmationStatus,
  getNumberOfListToDisplay,
  getOneClickCheckoutConfirmationStatus,
  sortCheckoutItemByBuyableItemIdentifier,
} from '#src/libs/checkout/utils';
import { getPaymentPackById } from '#src/libs/payment-packs/selectors';
import { getPrivatePassById } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentComboDataDict } from '#src/libs/payment-combo/selectors';
import MarketplaceCheckoutItemsWithPaymentPackList from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPaymentPackList';
import MarketplaceCheckoutItemsWithPrivatePassList from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPrivatePassList';
import MarketplaceCheckoutItemsWithPaymentComboList from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceCheckoutItemsWithPaymentComboList';
import MarketplaceProductItemList from '#src/libs/marketplace/components/@CheckoutItem/MarketplaceProductItemList';
import MinimalSubscriptionCard from '#src/libs/marketplace/components/@Subscription/MinimalSubscriptionCard';
import { Subscription } from '#src/libs/subscription/types';

import ConfirmationMessage from '#src/libs/checkout/components/ConfirmationMessage';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import DoorAccessPurchasedAlert from '#src/libs/self-service-access/components/DoorAccessPurchasedAlert.component';
import MarketplaceBookingAddGuestModal, {
  AddGuestFormValues,
} from '#src/libs/marketplace/components/@Booking/MarketplaceBookingAddGuestModal';
import {
  getOfferBookerUrl,
  getUserSpaceUrl,
} from '#src/libs/marketplace/routing-utils';
import { ConfirmationCheckoutSkeleton } from '.';
import ConsumerAppBarContainer from '../../ConsumerAppBar.container';
import type { RootState } from '../../../../reducers';
import { sortByDate } from '../../../../utils/datetime';
import { buildUrlParams } from '../../../../http';

import { getItemInStorage, removeItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES } from '#src/actions/constants';
import type { LightSignupFormValues } from '#src/pages/checkout/express-checkouts/components/LightSignupForm';
// @ts-expect-error
import { requestLogin as requestLoginAction } from '#src/actions/auth.actions';

import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import { trackBookingConfirmedEvent } from '#src/events/booking/trackers';

import './styles.css';

type QueryParams = {
  basket: string;
  billingPlanId: string;
  dialogMode: string;
  onValidation: string;
  express_checkout?: string;
  user_registration_response: string;
};

type ConfirmationCheckoutProps = {
  queryParams: QueryParams;
  offerBookedIdList: number[];
  offerPreBookedIdList: number[];
  offerNotBookableIdWithErrorCodeList: Array<number[]>;
  offerBookedList: OfferWithSpotInformation[];
  offerPreBookedList: OfferWithSpotInformation[];
  offerNotBookableList: OfferWithSpotInformation[];
  billingPlan: Subscription;
  companyId: number;
  goToMemberProfile: () => void;
  goToMemberBookings: () => void;
  goToMarketplace: () => void;
  goToMemberPasses: () => void;
  goToMemberProfilePage: () => void;
  goToMemberSubscriptions: () => void;
  goBack: () => void;
  onAddGuestSubmit: (values: AddGuestFormValues) => void;
};

type State = {
  isAddGuestDialogOpen: boolean;
};

type Props = ConfirmationCheckoutProps &
  ConnectedProps<typeof connector> &
  ConnectedProps<typeof basketConnector> &
  WithTranslation;

const buildUrlForWidget = (path: string, theme: CompanyTheme, params?: any) => {
  const { company, company_name } = theme;
  return `/widget/${company_name}/${company}/${path}${buildUrlParams({
    context: 'widget',
    ...(params || {}),
  })}`;
};

export class ConfirmationCheckout extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isAddGuestDialogOpen: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.offerBookedIdList !== this.props.offerBookedIdList) {
      this.fetchOfferData();
    }
  }

  componentDidMount() {
    this.handleExpressCheckoutLogin();
    if (WidgetUtils.isWidget()) {
      WidgetUtils.paymentSuccess();
    }
    if (
      this.props.offerBookedIdList?.[0] &&
      typeof this.props.offerBookedIdList?.[0] === 'number' // dont fetch if [undefined]
    ) {
      this.props.fetchBookingGuestNumber(this.props.offerBookedIdList?.[0]);
      this.props.fetchOfferStatusList(this.props.offerBookedIdList);
      this.props.offerBookedIdList.forEach((id) => {
        this.props.fetchOfferWaitingListPosition(id);
      });
    }
    this.props.retrieveCompanyCssConfiguration(this.props.companyId);
    if (this.props.queryParams.user_registration_response) {
      this.fetchOfferData();
    }
    if (
      this.props.queryParams?.basket &&
      this.props.queryParams.basket !== 'null'
    ) {
      this.props.fetchBasket(this.props.queryParams.basket, {
        onSuccess: () => {
          this.fetchCheckoutItemData();
        },
      });
    }
    if (
      this.props.queryParams?.billingPlanId &&
      this.props.queryParams.billingPlanId !== 'null'
    ) {
      const parsedBillingPlanId = parseInt(
        this.props.queryParams.billingPlanId,
        10,
      );
      this.props.fetchBillinPlan(parsedBillingPlanId, {});
    }
  }

  handleExpressCheckoutLogin = () => {
    if (
      !(this.props.queryParams?.express_checkout === 'true') ||
      this.props.authenticated
    ) {
      return;
    }
    try {
      const lightSignupFormValues = getItemInStorage(
        'local',
        STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES,
      );

      if (!lightSignupFormValues) return;

      const { email, password }: LightSignupFormValues = JSON.parse(
        lightSignupFormValues,
      );

      if (!email || !password) return;
      this.props.requestLogin(email, password, {
        onDone: () => {
          removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);
        },
        onError: () => {
          removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);
        },
      });
    } catch (error) {
      console.error('Error during express checkout login:', error);
      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);
    }
  };

  trackBookings = () => {
    // Add booking success analytics
    // this.props.offerBookedList.forEach((offerBooked) => {
    //   Analytics.bookingSuccess(offerBooked);
    // });
    this.props.offerBookedList.forEach((offerBooked) => {
      try {
        analyticsClientB2C.track(
          trackBookingConfirmedEvent({
            activity_id: offerBooked.meta_activity.id,
            activity_name: offerBooked.meta_activity.name,
            offer_id: offerBooked.id,
            session_type: offerBooked.meta_activity.is_workshop
              ? 'workshop'
              : 'group-activity',
          }),
        );
      } catch (error) {
        console.error('Failed to track booking confirmation:', {
          error,
          offerId: offerBooked?.id,
          metaActivityId: offerBooked?.meta_activity?.id,
        });
      }
    });
  };

  fetchOfferData = () => {
    const offerIds = [
      ...this.props.offerBookedIdList,
      ...this.props.offerPreBookedIdList,
      ...this.props.offerNotBookableIdWithErrorCodeList.map(
        (offerIdWithErrorCode) => offerIdWithErrorCode[0],
      ),
    ];
    !!offerIds.length &&
      this.props.fetchOfferBulk(
        offerIds,
        {
          onSuccess: (offerList) => {
            const establishmentIds = offerList.map(
              (offer) => offer.establishment,
            );

            const coachIds = [
              ...offerList.map((offer) => offer.coach),
              ...offerList.map((offer) => offer.coach_override),
            ];

            const metaActivityIds = offerList.map(
              (offer) => offer.meta_activity,
            );

            const promises = [
              this.props.fetchLevelList({
                company: this.props.companyId,
              }),
              ...(establishmentIds.length
                ? [this.props.fetchEstablishmentBulk(establishmentIds)]
                : []),
              ...(coachIds.length ? [this.props.fetchCoachBulk(coachIds)] : []),
              ...(metaActivityIds.length
                ? [this.props.fetchMetaActivityBulk(metaActivityIds)]
                : []),
            ];

            Promise.all(promises).then(() =>
              // setTimeout to make sure properties were injected by the
              // withCoach / withMetaActivity / withEstablishment selectors
              setTimeout(this.trackBookings, 500),
            );
          },
          onCacheUsed: () => {
            // setTimeout to make sure properties were injected by the
            // withCoach / withMetaActivity / withEstablishment selectors
            setTimeout(this.trackBookings, 500);
          },
        },
        true,
      );
  };

  fetchCheckoutItemData = () => {
    const sortedCheckoutItems = sortCheckoutItemByBuyableItemIdentifier(
      this.props.basket.checkout_items,
    );

    const paymentPackIds =
      sortedCheckoutItems[BuyableItemOptions.BUYABLE_ITEM_PASS]?.map(
        (checkoutItem) => checkoutItem?.buyable_item_id,
      ) ?? [];

    const privatePassIds =
      sortedCheckoutItems[BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS]?.map(
        (checkoutItem) => checkoutItem?.buyable_item_id,
      ) ?? [];

    const paymentComboIds =
      sortedCheckoutItems[BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM]?.map(
        (checkoutItem) => checkoutItem?.buyable_item_id,
      ) ?? [];

    this.props.fetchPaymentPackBulk(paymentPackIds);
    this.props.fetchPrivatePassBulk(privatePassIds);
    this.props.fetchPaymentComboList({
      id__in: paymentComboIds,
      company: this.props.companyId,
    });
  };

  getParsedUserRegistrationResponse: () => Omit<
    UserRegistrationResponse,
    'offers_booked'
  > & {
    offers_booked: number[];
  } = () =>
    this.props.queryParams?.user_registration_response &&
    JSON.parse(
      decodeURIComponent(this.props.queryParams.user_registration_response),
    );

  handleOpenAddGuestDialog = () =>
    this.setState({ isAddGuestDialogOpen: true });

  handleCloseAddGuestDialog = () =>
    this.setState({ isAddGuestDialogOpen: false });

  /**
   * Disable the "Invite a guest" button according to offer bookable status
   *
   * we want to be able to book even if double booking is disabled
   * @param {number} offerId
   * @returns {boolean}
   */
  getIsAddGuestDisabled = (offerId: number) =>
    ![
      OFFER_BOOKABLE_STATUS_BOOKABLE,
      OFFER_BOOKABLE_STATUS_ALREADY_BOOKED,
    ].includes(this.props.getOfferBookableStatus(offerId)) ||
    this.props.bookingGuestRemainingCount === 0;

  isError = () => {
    const noOfferWasBooked = !this.props.offerBookedIdList.length;
    const noOfferOnWaitingList = !this.props.offerPreBookedIdList.length;
    const withErrorCodeList =
      !!this.props.offerNotBookableIdWithErrorCodeList.length;
    return noOfferWasBooked && noOfferOnWaitingList && withErrorCodeList;
  };

  isLoading = () => {
    return (
      this.props.isBasketLoading ||
      this.props.isOfferLoading ||
      this.props.isEstablishmentLoading ||
      this.props.isLevelLoading ||
      this.props.isCoachLoading ||
      this.props.arePassesLoading ||
      this.props.isMetaActivityLoading ||
      this.props.isOfferStatusLoading
    );
  };

  /**
   * Retrieve the name from query params if a booking is for a guest
   * @param index The index of booking from the list in extra data
   * returns {string}
   */
  getGuestNameFromQueryParams = (index: number) => {
    const userRegistrationResponse =
      this.getParsedUserRegistrationResponse()?.extra_data;
    const guest =
      // @ts-expect-error
      userRegistrationResponse?.[index]?.additional_guest_info?.[0] ?? null;
    if (guest) {
      return `${guest?.first_name}${
        guest?.last_name ? ` ${guest?.last_name}` : ''
      }`;
    }
    return null;
  };

  /**
   * Retrieves the offer status for display purposes
   * @param offerId The offer ID
   */
  getOfferStatus = (offerId: number) => {
    return this.props.offerStatusById[offerId];
  };

  render() {
    const {
      t,
      offerBookedList,
      offerPreBookedList,
      basket,
      billingPlan,
      companyTheme,
      hideCoach,
      paymentPackById,
      privatePassById,
      paymentComboById,
      offerNotBookableIdWithErrorCodeList,
      offerNotBookableList,
    } = this.props;

    const offers = [...(offerBookedList ?? []), ...(offerPreBookedList ?? [])];

    const isPartiallyConfirmed =
      !!offerNotBookableIdWithErrorCodeList?.length &&
      !!offerBookedList?.length;

    const sortedOfferList = sortByDate(
      offers,
      'date_start',
    ) as OfferWithSpotInformation[];

    const checkoutItems =
      (basket?.checkout_items &&
        basket.checkout_items.filter((checkoutItem) => !!checkoutItem)) ??
      [];

    const sortedCheckoutItems =
      sortCheckoutItemByBuyableItemIdentifier(checkoutItems);

    const checkoutItemsWithPaymentCombo =
      sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM] ?? [];

    const checkoutItemsWithPaymentPack =
      sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_PASS] ?? [];

    const checkoutItemsWithPrivatePass =
      sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS] ?? [];

    const checkoutItemsWithShopItem =
      sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM] ?? [];

    const checkoutItemsWithGiftcard =
      sortedCheckoutItems?.[BuyableItemOptions.BUYABLE_ITEM_GIFTCARD] ?? [];

    const {
      shoudlDisplayPassList,
      shouldDisplayPackList,
      shouldDisplayShopItemList,
      shouldDisplayGiftcardList,
      numberOfListToDisplay,
    } = getNumberOfListToDisplay({
      checkoutItemsWithPaymentCombo,
      checkoutItemsWithPaymentPack,
      checkoutItemsWithPrivatePass,
      checkoutItemsWithShopItem,
      checkoutItemsWithGiftcard,
    });

    const isTwoColumnsDisplay = numberOfListToDisplay !== 1;

    const errorCode = offerNotBookableIdWithErrorCodeList[0]?.[1];

    const userRegistrationResponse = this.getParsedUserRegistrationResponse();

    const isFromOneClickCheckout = !!this.props.queryParams?.express_checkout;

    const hasDoorAccess = checkIfPurchasedPassGrantsDoorAccess(
      checkoutItems,
      this.props.paymentPackById,
      this.props.privatePassById,
    );

    const confirmationStatus = isFromOneClickCheckout
      ? getOneClickCheckoutConfirmationStatus(
          this.isError(),
          errorCode,
          offerBookedList,
          this.props.basket,
        )
      : getConfirmationStatus(
          this.isError(),
          errorCode,
          offerBookedList,
          this.props.basket,
          billingPlan,
          this.props.offerPreBookedIdList,
          userRegistrationResponse?.extra_data?.[0]?.booking_for_invitee_only,
          isPartiallyConfirmed,
        );

    const isLoading = this.isLoading();

    const showCallToActionButtons = !WidgetUtils.isWidget();

    if (isLoading) {
      return (
        <div className="bs-confirmation-checkout-container">
          <ConfirmationCheckoutSkeleton />
        </div>
      );
    }

    return (
      <ConsumerAppBarContainer>
        <div className="bs-confirmation-checkout-container">
          {this.state.isAddGuestDialogOpen && (
            <MarketplaceBookingAddGuestModal
              bookingGuestFrequency={
                this.props.companyTheme.allow_guest_frequency
              }
              bookingGuestRemainingCount={this.props.bookingGuestRemainingCount}
              onCancel={this.handleCloseAddGuestDialog}
              onSubmit={this.props.onAddGuestSubmit}
            />
          )}

          <div className="bs-confirmation-checkout-container--with-padding">
            <div className="bs-confirmation-checkout-message__container">
              <ConfirmationMessage
                billingPlan={billingPlan}
                checkoutItems={checkoutItems}
                hasDoorAccess={hasDoorAccess}
                {...(showCallToActionButtons && { goBack: this.props.goBack })}
                goToCalendar={this.props.goToMarketplace}
                {...(showCallToActionButtons && {
                  goToMemberPasses: this.props.goToMemberPasses,
                })}
                goToMemberProfile={this.props.goToMemberProfile}
                goToMemberProfilePage={this.props.goToMemberProfilePage}
                {...(showCallToActionButtons && {
                  goToMemberSubscriptions: this.props.goToMemberSubscriptions,
                })}
                goToMemberBookings={this.props.goToMemberBookings}
                isLoading={isLoading}
                offers={offers}
                status={confirmationStatus}
              />
              {hasDoorAccess && showCallToActionButtons && (
                <DoorAccessPurchasedAlert
                  androidAppUrl={this.props.companyTheme.android_app_url}
                  companyId={this.props.companyId}
                  iosAppUrl={this.props.companyTheme.ios_app_url}
                  onViewProfile={this.props.goToMemberProfilePage}
                />
              )}
            </div>
            <div
              className={clsx(
                'bs-confirmation-checkout-booking-list__container',
              )}
            >
              <div
                className={clsx('bs-confirmation-checkout-booking-list', {
                  'bs-confirmation-checkout-booking-list__confirmed-bookings--hidden':
                    !sortedOfferList?.length,
                })}
              >
                <h5 className="bs-confirmation-checkout-booking-list__title">
                  {userRegistrationResponse?.extra_data?.[0]
                    ?.booking_for_invitee_only
                    ? t('validation.sections.offerGuestBooked', {
                        count: sortedOfferList?.length,
                      })
                    : t('validation.sections.offerBooked', {
                        count: sortedOfferList?.length,
                      })}
                </h5>
                <MarketplaceOfferBookingList
                  bookingGuestFrequency={
                    this.props.companyTheme.allow_guest_frequency
                  }
                  bookingGuestNumberLeft={this.props.bookingGuestRemainingCount}
                  classes={{
                    'bs-confirmation-checkout-booking-list__list':
                      'bs-confirmation-checkout-booking-list__list',
                  }}
                  companyTheme={companyTheme}
                  getBookableStatus={this.props.getOfferBookableStatus}
                  getGuestNameFromQueryParams={this.getGuestNameFromQueryParams}
                  getIsAddGuestDisabled={this.getIsAddGuestDisabled}
                  getOfferStatus={this.getOfferStatus}
                  getOfferWaitListPosition={
                    this.props.getOfferStatusWaitingListPosition
                  }
                  hideBookForAGuestButton={isFromOneClickCheckout}
                  hideCoach={hideCoach}
                  isLoading={isLoading}
                  offers={sortedOfferList}
                  onOpenAddGuestModal={this.handleOpenAddGuestDialog}
                />
              </div>
              <div
                className={clsx('bs-confirmation-checkout-booking-list', {
                  'bs-confirmation-checkout-booking-list--hidden':
                    !offerNotBookableList?.length,
                })}
              >
                <h5 className="bs-confirmation-checkout-booking-list__title">
                  {t('validation.sections.unableToBookSession', {
                    count: offerNotBookableList?.length,
                  })}
                </h5>
                <MarketplaceOfferBookingList
                  classes={{
                    'bs-confirmation-checkout-booking-list__list':
                      'bs-confirmation-checkout-booking-list__list',
                  }}
                  companyTheme={companyTheme}
                  getBookableStatus={this.props.getOfferBookableStatus}
                  getGuestNameFromQueryParams={this.getGuestNameFromQueryParams}
                  getIsAddGuestDisabled={this.getIsAddGuestDisabled}
                  getOfferStatus={this.getOfferStatus}
                  getOfferWaitListPosition={
                    this.props.getOfferStatusWaitingListPosition
                  }
                  hideBookForAGuestButton={isFromOneClickCheckout}
                  hideCoach={hideCoach}
                  isLoading={isLoading}
                  offerNotBookableIdWithErrorCodeList={
                    offerNotBookableIdWithErrorCodeList
                  }
                  offers={offerNotBookableList}
                  onOpenAddGuestModal={this.handleOpenAddGuestDialog}
                />
              </div>
            </div>
            <div
              className={clsx(
                'bs-confirmation-checkout-billing-plan__container',
                {
                  'bs-confirmation-checkout-billing-plan__container--hidden':
                    !billingPlan,
                },
              )}
            >
              <h5 className="bs-confirmation-checkout-booking-list__title">
                {t('validation.sections.mySubscription')}
              </h5>
              <MinimalSubscriptionCard
                isLoading={isLoading}
                subscription={billingPlan}
              />
            </div>
            <div
              className={clsx(
                'bs-confirmation-checkout-product-list__container',
                {
                  'bs-confirmation-checkout-product-list__container--two-columns':
                    isTwoColumnsDisplay,
                  'bs-confirmation-checkout-product-list__container--hidden':
                    !checkoutItems?.length,
                },
              )}
            >
              <div
                className={clsx(
                  'bs-confirmation-checkout-product-list__pass-list__container',
                  {
                    'bs-confirmation-checkout-product-list__pass-list__container--hidden':
                      !shoudlDisplayPassList,
                  },
                )}
              >
                <h5 className="bs-confirmation-checkout-product-list__pass-list__title">
                  {t('validation.sections.myPass', {
                    count:
                      checkoutItemsWithPaymentPack?.length +
                      checkoutItemsWithPrivatePass?.length,
                  })}
                </h5>
                <div className="bs-confirmation-checkout-product-list__pass-list">
                  <MarketplaceCheckoutItemsWithPaymentPackList
                    classes={{
                      'bs-confirmation-checkout-product-list__pass-list__item-list':
                        'bs-confirmation-checkout-product-list__pass-list__item-list',
                    }}
                    isLoading={isLoading}
                    items={checkoutItemsWithPaymentPack}
                    paymentPacksById={paymentPackById}
                  />
                  <MarketplaceCheckoutItemsWithPrivatePassList
                    classes={{
                      'bs-confirmation-checkout-product-list__pass-list__item-list':
                        'bs-confirmation-checkout-product-list__pass-list__item-list',
                    }}
                    isLoading={isLoading}
                    items={checkoutItemsWithPrivatePass}
                    privatePassById={privatePassById}
                  />
                </div>
              </div>
              <div
                className={clsx(
                  'bs-confirmation-checkout-product-list__pack-list__container',
                  {
                    'bs-confirmation-checkout-product-list__pack-list__container--hidden':
                      !shouldDisplayPackList,
                  },
                )}
              >
                <h5 className="bs-confirmation-checkout-product-list__pack-list__title">
                  {t('validation.sections.myPack', {
                    count: checkoutItemsWithPaymentCombo?.length,
                  })}
                </h5>
                <MarketplaceCheckoutItemsWithPaymentComboList
                  isLoading={isLoading}
                  items={checkoutItemsWithPaymentCombo}
                  paymentComboById={paymentComboById}
                />
              </div>
              <div
                className={clsx(
                  'bs-confirmation-checkout-product-list__webshop-list__container',
                  {
                    'bs-confirmation-checkout-product-list__webshop-list__container--hidden':
                      !shouldDisplayShopItemList,
                  },
                )}
              >
                <h5 className="bs-confirmation-checkout-product-list__webshop-list__title">
                  {t('validation.sections.myProduct', {
                    count: checkoutItemsWithShopItem?.length,
                  })}
                </h5>
                <MarketplaceProductItemList
                  isLoading={isLoading}
                  items={checkoutItemsWithShopItem}
                />
              </div>

              <div
                className={clsx(
                  'bs-confirmation-checkout-product-list__giftcard-list__container',
                  {
                    'bs-confirmation-checkout-product-list__giftcard-list__container--hidden':
                      !shouldDisplayGiftcardList,
                  },
                )}
              >
                <h5 className="bs-confirmation-checkout-product-list__giftcard-list__title">
                  {t('validation.sections.myGiftcard', {
                    count: checkoutItemsWithGiftcard?.length,
                  })}
                </h5>
                <MarketplaceProductItemList
                  isLoading={isLoading}
                  items={checkoutItemsWithGiftcard}
                />
              </div>
            </div>
          </div>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const mapWithHandlers = {
  onAddGuestSubmit:
    ({ push, companyId, offerBookedIdList }: RouterProps & Props) =>
    (values: AddGuestFormValues) => {
      push(
        getOfferBookerUrl(companyId, offerBookedIdList[0]) +
          buildUrlParams({
            guest_first_name: encodeURIComponent(values.firstName),
            ...(values.lastName && {
              guest_last_name: encodeURIComponent(values.lastName),
            }),
            ...(values.email && {
              guest_email: encodeURIComponent(values.email),
            }),
            guest_booking: 'true',
          }),
      );
    },
  goToMemberProfile:
    ({
      replace,
      companyId,
      companyTheme,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      queryParams: QueryParams;
      companyTheme: CompanyTheme;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        replace(buildUrlForWidget('bookings/', companyTheme));
        return;
      }
      replace(getUserSpaceUrl(companyId));
    },
  goToMemberBookings:
    ({
      replace,
      companyId,
      companyTheme,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      companyTheme: CompanyTheme;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        replace(buildUrlForWidget('bookings/', companyTheme));
        return;
      }
      replace(`/c/${companyId}/booking/`);
    },
  goToMarketplace:
    ({
      replace,
      companyId,
      queryParams,
      companyTheme,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      queryParams: QueryParams;
      companyTheme: CompanyTheme;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.closeModal();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(
        urlToMarketplace(companyTheme.company_name, companyId.toString()),
      );
    },
  goToMemberPasses:
    ({ replace, companyId, queryParams }: RouterProps & Props) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.closeModal();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(`/c/${companyId}/pack/`);
    },
  goToMemberProfilePage:
    ({ replace, companyId }: RouterProps & Props) =>
    () => {
      replace(`/c/${companyId}/profile/`);
    },
  goToMemberSubscriptions:
    ({ replace, companyId, queryParams }: RouterProps & Props) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.closeModal();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(`/c/${companyId}/subscription/`);
    },
};

const basketConnector = connect(
  (state: RootState, { queryParams }: { queryParams: QueryParams }) => ({
    basket:
      queryParams?.basket && queryParams.basket !== 'null'
        ? getBasket(state, queryParams.basket)
        : null,
  }),
  {
    fetchBasket: fetchBasketAction,
  },
);

const mapStateToProps = (
  state: RootState,
  {
    offerBookedIdList,
    offerPreBookedIdList,
    offerNotBookableIdWithErrorCodeList,
    offerExtraDataList,
    queryParams,
  }: ConfirmationCheckoutProps & {
    offerExtraDataList: ExtraDataFromQueryParams;
  },
) => ({
  offerStatusById: getBookableStatusData(state),
  bookingGuestRemainingCount: getBookingGuestNumberLeft(state),
  hideCoach: themeSelectors.getTheme(state).hideCoach,
  isBasketLoading: state.checkout.basket.loading,
  isOfferLoading: state.offer.bulk.loading,
  isOfferStatusLoading: state.offer.offerStatus.loading,
  isEstablishmentLoading: state.establishment.loading,
  isLevelLoading: state.level.loading,
  isCoachLoading: state.coach.loading,
  arePassesLoading:
    state.paymentPack.loading ||
    state.paymentCombo.loading ||
    state.privateService.privatePass.loading,
  isMetaActivityLoading: state.metaActivity.loading,
  companyTheme: themeSelectors.getTheme(state),
  offerBookedList: withExtraDataFromQueryParams(
    withCoach(
      withMetaActivity(withCustomLevel(withEstablishment(getOfferFromList))),
    )(state, offerBookedIdList),
    offerExtraDataList,
  ),
  offerPreBookedList: withExtraDataFromQueryParams(
    withCoach(
      withMetaActivity(withCustomLevel(withEstablishment(getOfferFromList))),
    )(state, offerPreBookedIdList),
    offerExtraDataList,
  ),
  offerNotBookableList: withExtraDataFromQueryParams(
    withCoach(
      withMetaActivity(withCustomLevel(withEstablishment(getOfferFromList))),
    )(
      state,
      offerNotBookableIdWithErrorCodeList.map((ie) => ie[0]),
    ),
    offerExtraDataList,
  ),
  paymentPackById: getPaymentPackById(state),
  privatePassById: getPrivatePassById(state),
  paymentComboById: getPaymentComboDataDict(state),
  billingPlan:
    queryParams.billingPlanId &&
    // @ts-expect-error
    getSubscriptionDetail(state, queryParams.billingPlanId),
  customConfiguration: state.exportableComponents.customCss,
  getOfferBookableStatus: (offerId: number) =>
    getOfferBookableStatus(state, offerId),
  getOfferStatusWaitingListPosition: (offerId: number) => {
    return getOfferStatusWaitingListPosition(state, offerId);
  },
  authenticated: state.auth.authenticated,
});

const mapDispatchToProps = {
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchPaymentComboList: fetchPaymentComboListAction,
  fetchBillinPlan: fetchBillingPlanAction,
  fetchOfferBulk: fetchOfferBulkAction,
  fetchOfferStatusList: fetchOfferStatusListAction,
  fetchBookingGuestNumber: fetchBookingGuestNumberAction,
  fetchOfferWaitingListPosition: fetchOfferWaitingListPositionAction,
  fetchLevelList: fetchLevelListAction,
  replace: replaceRouter,
  push: pushRouter,
  goBack,
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  requestLogin: requestLoginAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any, ConfirmationCheckoutProps>(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    [
      'user_registration_response',
      'basket',
      'dialogMode',
      'onValidation',
      'billingPlanId',
      'express_checkout',
    ],
    'queryParams',
    'setQueryParams',
  ]),
  withTranslation(['checkout', 'snackbar']),
  basketConnector,
  withProps(
    ({
      queryParams,
    }: {
      queryParams: {
        basket: string;
        dialogMode: string;
        onValidation: string;
        user_registration_response: string;
      };
    }) => {
      return {
        user_registration_response:
          queryParams?.user_registration_response &&
          JSON.parse(
            decodeURIComponent(queryParams.user_registration_response),
          ),
      };
    },
  ),
  withProps(
    ({
      user_registration_response,
      basket,
    }: {
      user_registration_response: UserRegistrationResponse;
      basket: Basket;
    }) => ({
      offerBookedIdList: [
        ...((user_registration_response || {}).offers_booked ?? []),
        ...flatten(
          ((basket || {}).checkout_items ?? []).map((checkoutItem) =>
            checkoutItem?.extra_data?.offers_data?.map(
              (offerData) => offerData.offer_id,
            ),
          ),
        ),
      ],
      offerPreBookedIdList:
        (user_registration_response || {}).offer_on_waiting_list || [],
      offerNotBookableIdWithErrorCodeList:
        (user_registration_response || {}).error_codes || [],
      offerExtraDataList: (user_registration_response || {}).extra_data || [],
    }),
  ),
  connector,
  WithCustomCssProvider,
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConfirmationCheckout);
