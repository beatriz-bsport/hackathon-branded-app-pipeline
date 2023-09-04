import React from 'react';
import { replace as replaceRouter, goBack } from 'connected-react-router';
import flatten from 'lodash/flatten';
import { compose, withHandlers, withProps } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import classNames from 'classnames';

// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import themeSelectors from '#libs/theme/selectors';
import { getBasket } from '#libs/checkout/selectors';
import {
  getOfferFromList,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '#libs/offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
// @ts-expect-error
import { getSubscriptionDetail } from '#libs/subscription/selectors';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchBasket as fetchBasketAction } from '#libs/checkout/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { fetchPrivatePassBulk as fetchPrivatePassBulkAction } from '#libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#libs/payment-combo/actions';
import { fetch as fetchBillingPlanAction } from '#libs/subscription/actions';

import WidgetUtils from '#libs/widget/WidgetUtils';
import { urlToMarketplace } from '#libs/marketplace/utils';
import { withExtraDataFromQueryParams } from '#libs/booker-module/utils';
import { sortByDate } from '../../../../utils/datetime';

import type { CompanyTheme } from '#libs/theme/types';
import type { OfferWithSpotInformation, Offer_FULL } from '#libs/offer/types';
import type { ExtraDataFromQueryParams } from '#libs/booker-module/types';
import type { RootState } from '../../../../reducers';
import { BuyableItemOptions, type Basket } from '#libs/checkout/types';

import ConsumerAppBarContainer from '../../ConsumerAppBar.container';
import MarketplaceOfferBookingList from '#libs/marketplace/components/MarketplaceOfferBookingList';

import './styles.css';
import {
  getConfirmationStatus,
  getNumberOfListToDisplay,
  sortCheckoutItemByBuyableItemIdentifier,
} from '#libs/checkout/utils';
import { getPaymentPackById } from '#libs/payment-packs/selectors';
import { getPrivatePassById } from '#libs/private-service/selectors/private-pass';
import { getPaymenComboDataDict } from '#libs/payment-combo/selectors';
import MarketplaceCheckoutItemsWithPaymentPackList from '#libs/marketplace/components/MarketplaceCheckoutItemsWithPaymentPackList';
import MarketplaceCheckoutItemsWithPrivatePassList from '#libs/marketplace/components/MarketplaceCheckoutItemsWithPrivatePassList';
import MarketplaceCheckoutItemsWithPaymentComboList from '#libs/marketplace/components/MarketplaceCheckoutItemsWithPaymentComboList';
import MarketplaceProductItemList from '#libs/marketplace/components/MarketplaceProductItemList';
import MinimalSubscriptionCard from '#libs/marketplace/components/MinimalSubscriptionCard';
import { Subscription } from '#libs/subscription/types';

import ConfirmationMessage from '#libs/checkout/components/ConfirmationMessage';
import { ConfirmationCheckoutSkeleton } from '.';

type UserRegistrationResponse = {
  offer_on_waiting_list: number[];
  error_codes: number[];
  extra_data: ExtraDataFromQueryParams;
  offers_booked: Offer_FULL[];
};

type QueryParams = {
  basket: string;
  billingPlanId: string;
  dialogMode: string;
  onValidation: string;
  user_registration_response: UserRegistrationResponse;
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
  onContinue: () => void;
  goToMarketplace: () => void;
  goToMemberPasses: () => void;
  goToMemberSubscriptions: () => void;
  goBack: () => void;
};

type Props = ConfirmationCheckoutProps &
  ConnectedProps<typeof connector> &
  ConnectedProps<typeof basketConnector> &
  WithTranslation;

export class ConfirmationCheckout extends React.PureComponent<Props> {
  componentDidMount() {
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

            !!establishmentIds.length &&
              this.props.fetchEstablishmentBulk(establishmentIds);

            !!coachIds.length && this.props.fetchCoachBulk(coachIds);

            !!metaActivityIds.length &&
              this.props.fetchMetaActivityBulk(metaActivityIds);

            this.props.fetchLevelList({
              company: this.props.companyId,
            });
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

  isError = () => {
    const noOfferWasBooked = !this.props.offerBookedIdList.length;
    const noOfferOnWaitingList = !this.props.offerPreBookedIdList.length;
    const withErrorCodeList =
      this.props.offerNotBookableIdWithErrorCodeList.length;
    const noBasket =
      !this.props.queryParams?.basket ||
      this.props.queryParams?.basket === 'null';
    return (
      !noOfferWasBooked &&
      !noOfferOnWaitingList &&
      withErrorCodeList &&
      noBasket
    );
  };

  isLoading = () => {
    return (
      this.props.isBasketLoading ||
      this.props.isOfferLoading ||
      this.props.isEstablishmentLoading ||
      this.props.isLevelLoading ||
      this.props.isCoachLoading ||
      this.props.arePassesLoading ||
      this.props.isMetaActivityLoading
    );
  };

  render() {
    const {
      t,
      offerBookedList,
      basket,
      billingPlan,
      companyTheme,
      hideCoach,
      paymentPackById,
      privatePassById,
      paymentComboById,
    } = this.props;

    const sortedOfferList = sortByDate(
      offerBookedList,
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

    const {
      shoudlDisplayPassList,
      shouldDisplayPackList,
      shouldDisplayShopItemList,
      numberOfListToDisplay,
    } = getNumberOfListToDisplay({
      checkoutItemsWithPaymentCombo,
      checkoutItemsWithPaymentPack,
      checkoutItemsWithPrivatePass,
      checkoutItemsWithShopItem,
    });

    const isTwoColumnsDisplay = numberOfListToDisplay !== 1;

    const errorCode = this.props.offerNotBookableIdWithErrorCodeList[0]?.[1];

    const confirmationStatus = getConfirmationStatus(
      this.isError(),
      errorCode,
      offerBookedList,
      this.props.basket,
      billingPlan,
      this.props.offerPreBookedIdList,
    );
    const isLoading = this.isLoading();

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
          <div className="bs-confirmation-checkout-container--with-padding">
            <div className="bs-confirmation-checkout-message__container">
              <ConfirmationMessage
                billingPlan={billingPlan}
                checkoutItems={checkoutItems}
                goBack={this.props.goBack}
                goToCalendar={this.props.goToMarketplace}
                goToMemberPasses={this.props.goToMemberPasses}
                goToMemberProfile={this.props.onContinue}
                goToMemberSubscriptions={this.props.goToMemberSubscriptions}
                isLoading={isLoading}
                offers={offerBookedList}
                status={confirmationStatus}
              />
            </div>
            <div
              className={classNames(
                'bs-confirmation-checkout-booking-list__container',
                {
                  'bs-confirmation-checkout-booking-list__container--hidden':
                    !sortedOfferList?.length,
                },
              )}
            >
              <h5 className="bs-confirmation-checkout-booking-list__title">
                {t('validation.sections.offerBooked', {
                  count: sortedOfferList?.length,
                })}
              </h5>
              <MarketplaceOfferBookingList
                classes={{
                  'bs-confirmation-checkout-booking-list__list':
                    'bs-confirmation-checkout-booking-list__list',
                }}
                companyTheme={companyTheme}
                hideCoach={hideCoach}
                isLoading={isLoading}
                offers={sortedOfferList}
              />
            </div>
            <div
              className={classNames(
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
              className={classNames(
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
                className={classNames(
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
                className={classNames(
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
                className={classNames(
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
            </div>
          </div>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const mapWithHandlers = {
  onContinue:
    ({
      replace,
      companyId,
      queryParams,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      queryParams: QueryParams;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(`/c/${companyId}`);
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
        WidgetUtils.paymentSuccess();
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
    ({
      replace,
      companyId,
      queryParams,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      queryParams: QueryParams;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(`/c/${companyId}/pack/`);
    },
  goToMemberSubscriptions:
    ({
      replace,
      companyId,
      queryParams,
    }: {
      replace: typeof replaceRouter;
      companyId: number;
      queryParams: QueryParams;
    }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
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
  hideCoach: themeSelectors.getTheme(state).hideCoach,
  isBasketLoading: state.checkout.basket.loading,
  isOfferLoading: state.offer.bulk.loading,
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
  paymentComboById: getPaymenComboDataDict(state),
  billingPlan:
    queryParams.billingPlanId &&
    getSubscriptionDetail(state, queryParams.billingPlanId),
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
  fetchLevelList: fetchLevelListAction,
  replace: replaceRouter,
  goBack,
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
        ...((user_registration_response || {}).offers_booked || []),
        ...flatten(
          ((basket || {}).checkout_items || []).map((checkoutItem) =>
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
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConfirmationCheckout);
