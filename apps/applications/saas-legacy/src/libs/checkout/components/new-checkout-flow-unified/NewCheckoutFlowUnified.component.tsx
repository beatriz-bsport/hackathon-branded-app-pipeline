import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Immutable, { ImmutableArray } from 'seamless-immutable';
import { isWidthDown, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ActivitiesSummary from '../new-checkout-flow/ActivitiesSummary.component';
import { BasketPaymentProvider } from './BasketPaymentContext';
import BasketSummary from '../new-checkout-flow/BasketSummary.component';
import CheckoutButtonsUnified from './CheckoutButtonsUnified.component';
import { CheckoutItemList } from '../new-checkout-flow/CheckoutItemList.component';
import type { CheckoutStepsRef } from './types';
import CouponCodeInput from '../new-checkout-flow/CouponCodeInput.component';
import EmptyBasket from '../new-checkout-flow/EmptyBasket';
import ExpiredSpotDialog from '../new-checkout-flow/ExpiredSpotDialog';
import PriceCount from '../new-checkout-flow/PriceCount';

import { useWidth } from '#src/hooks/useWidth';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { Offer } from '#src/libs/offer/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Coupon } from '#src/libs/coupon/types';
import type {
  APIPollOptionCallback,
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '#src/state/types';
import {
  type Basket,
  type BasketAddress,
  type CheckoutItem,
  type CheckoutItemData,
  type OnRemoveCheckoutItemData,
  type PrepaidLine,
  STEPS,
  type StepType,
} from '#src/libs/checkout/types';
import {
  CB as PAYMENT_METHOD_CB,
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods.js';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import { CheckoutStepsUnified } from '#src/libs/checkout/components/new-checkout-flow-unified/CheckoutStepsUnified.component';
import { useBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasket';
import { useBasketPaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentStatusTracker';
import { getLocaleCountry } from '#src/utils/language';

// These checkout item types are displayed in the bill after the basket summary
const BILL_CHECKOUT_ITEMS = [BUYABLE_ITEM_COUPON, BUYABLE_ITEM_FEE];

type Props = {
  addItemToBasket: (
    basketId: string,
    data: CheckoutItemData,
    options?: OptionCallback,
  ) => void;
  attachCoupon: (
    code: string,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  basket: Basket<string, PrepaidLine>;
  basketItemRemovalStatusLoading: boolean;
  basketLoading: boolean;
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>;
  companyId: number;
  enableMultiLocalization?: boolean;
  goBack: () => void;
  goToCalendar: () => void;
  goToMarketplace: () => void;
  goToMyProfile: () => void;
  isExcludingTax: boolean;
  monitorExpiredItemRemoval: (
    companyId: number,
    checkoutItemId: string,
    pollOptionCallback?: APIPollOptionCallback,
  ) => void;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  paymentPackOrComboCanNotBookAllOffers: boolean;
  refreshBasket: (options?: OptionCallback) => void;
  removeItemFromBasket: (
    basketId: string,
    data: OnRemoveCheckoutItemData,
  ) => void;
  theme: CompanyTheme;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
};

export const NewCheckoutFlow: React.FC<Props> = ({
  addItemToBasket,
  attachCoupon,
  basket,
  basketItemRemovalStatusLoading,
  basketLoading,
  basketOffers,
  companyId,
  enableMultiLocalization,
  goBack,
  goToCalendar,
  goToMarketplace,
  goToMyProfile,
  isExcludingTax,
  monitorExpiredItemRemoval,
  onConfirmPaymentSuccess,
  onRemoveInternalAccountPrepaidLine,
  patchBasket,
  paymentPackOrComboCanNotBookAllOffers,
  refreshBasket,
  removeItemFromBasket,
  theme,
  updateMemberBillingGroup,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  const checkoutStepsRef = useRef<CheckoutStepsRef>(null);

  const steps: ImmutableArray<StepType> = useMemo(
    () =>
      basket.need_address
        ? Immutable([STEPS.ADDRESS_STEP, STEPS.PAYMENT_STEP])
        : Immutable([STEPS.PAYMENT_STEP]),
    [basket.need_address],
  );
  const [currentStep, setCurrentStep] = useState<StepType>(steps[0]);
  useEffect(() => {
    if (!steps.map((step) => step.id).includes(currentStep.id))
      setCurrentStep(steps[0]);
  }, [currentStep, steps]);

  // Payment and basket state
  const [isBasketDisplayed, setIsBasketDisplayed] = useState(true);
  const [expiredSpotDialogOpen, setExpiredSpotDialogOpen] = useState(false);
  const [expiredCheckoutItemIdToMonitor, setExpiredCheckoutItemIdToMonitor] =
    useState<string | null>(null);

  const { isPaymentProcessing } = useBasketPaymentStatusTracker(
    basket.id,
    basket.member,
  );
  const { isCurrentBasketProcessing } = useBasket(
    basket.id,
    companyId,
    basket.member,
  );

  const isOnlinePaymentAvailable = basket.available_payment_methods.includes(
    PAYMENT_METHOD_CB.id,
  );
  const isPayLaterAvailable = basket.available_payment_methods.includes(
    PAYMENT_METHOD_CREDIT_ACCOUNT.id,
  );
  const displayedAmountToPayCts =
    (basket.total_price_cts || 0) - (basket.total_price_prepaid_lines_cts || 0);
  const isBasketModificationDisabled =
    isPaymentProcessing || isCurrentBasketProcessing || basketLoading;
  const noOfferInCheckoutItems = basketOffers?.length === 0;
  const companyCountry = useMemo(() => getLocaleCountry(theme.locale), [theme]);
  const width = useWidth();
  const isMobile = isWidthDown('sm', width);

  // Basket/Activity summary
  const basketSummaryCheckoutItems: Array<CheckoutItem> = useMemo(
    () =>
      basket.checkout_items.filter(
        (checkoutItem) =>
          !BILL_CHECKOUT_ITEMS.includes(checkoutItem.buyable_item_identifier) &&
          !checkoutItem.extra_data?.offers_data,
      ),
    [basket.checkout_items],
  );
  const activitySummaryCheckoutItems: Array<CheckoutItem> = useMemo(
    () =>
      basket.checkout_items.filter(
        (checkoutItem) =>
          !BILL_CHECKOUT_ITEMS.includes(checkoutItem.buyable_item_identifier) &&
          checkoutItem.extra_data?.offers_data &&
          checkoutItem.extra_data?.offers_data.length,
      ),
    [basket.checkout_items],
  );

  const handleRemoveCheckoutItem = useCallback(
    (handleRemoveCheckoutItemData: OnRemoveCheckoutItemData) => {
      removeItemFromBasket(basket.id, handleRemoveCheckoutItemData);
    },
    [basket.id, removeItemFromBasket],
  );
  const handleAddCheckoutItem = useCallback(
    (handleAddCheckoutItemData: CheckoutItemData) => {
      addItemToBasket(basket.id, handleAddCheckoutItemData);
    },
    [addItemToBasket, basket.id],
  );
  const handleCheckoutItemExpiration = useCallback((checkoutItemId: string) => {
    setExpiredCheckoutItemIdToMonitor(checkoutItemId);
    setExpiredSpotDialogOpen(true);
  }, []);
  const handleCloseExpiredSpotDialog = useCallback(() => {
    monitorExpiredItemRemoval(companyId, expiredCheckoutItemIdToMonitor ?? '', {
      onPollSuccess: () => {
        setExpiredSpotDialogOpen(false);
        // refreshBasket will fetch the updated current basket as well as available instalment payments
        refreshBasket();
      },
      onPollError: () => setExpiredSpotDialogOpen(false),
    });
  }, [
    companyId,
    monitorExpiredItemRemoval,
    expiredCheckoutItemIdToMonitor,
    refreshBasket,
  ]);
  const OnBasketRequest = useCallback(
    () => setIsBasketDisplayed((prev) => !prev),
    [],
  );

  // Empty basket
  const basketIsEmpty = useMemo(
    () =>
      !basketLoading &&
      (basket?.checkout_items ?? []).filter(
        (item) => item.buyable_item_identifier !== BUYABLE_ITEM_COUPON,
      )?.length === 0,
    [basketLoading, basket],
  );
  if (basketIsEmpty) {
    return (
      <div className={classes.container}>
        <EmptyBasket
          goToCalendar={goToCalendar}
          goToMarketplace={goToMarketplace}
          goToMyProfile={goToMyProfile}
        />
      </div>
    );
  }

  // Main render
  return (
    <BasketPaymentProvider>
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <IconButton onClick={goBack}>
            <ArrowBack className={classes.arrowIcon} />
          </IconButton>
          <Typography className={classes.title} variant="h5">
            {t('payment.title')}
          </Typography>
        </div>
        <div className={classes.subContainer}>
          <div className={classes.paymentContainer}>
            <CheckoutStepsUnified
              ref={checkoutStepsRef}
              basket={basket}
              basketHasOffers={!noOfferInCheckoutItems}
              companyCountry={companyCountry}
              companyId={companyId}
              currentStep={currentStep}
              displayedAmountToPayCts={displayedAmountToPayCts}
              displayedAmountToPayPrepaidLinesCts={
                basket.total_price_prepaid_lines_cts
              }
              enableMultiLocalization={enableMultiLocalization ?? false}
              isOnlinePaymentAvailable={isOnlinePaymentAvailable}
              isPayLaterAvailable={isPayLaterAvailable}
              isTotalPriceNull={displayedAmountToPayCts <= 0}
              onConfirmPaymentSuccess={onConfirmPaymentSuccess}
              patchBasket={patchBasket}
              setCurrentStep={setCurrentStep}
              steps={steps}
              updateMemberBillingGroup={updateMemberBillingGroup}
            />
          </div>
          <div className={classes.scrollableItems}>
            {paymentPackOrComboCanNotBookAllOffers && (
              <Alert className={classes.basketAlert} severity="error">
                {t('myBasket.error.unavailableSessions')}
              </Alert>
            )}
            <CheckoutItemList
              activitySummaryCheckoutItems={activitySummaryCheckoutItems}
              connectedToOtherComponents={
                !isMobile || basketSummaryCheckoutItems.length > 0
              }
              handleRemoveCheckoutItem={handleRemoveCheckoutItem}
            />
            <Collapse in={!isMobile || isBasketDisplayed}>
              <BasketSummary
                noPriceBackground
                basketSummaryCheckoutItems={basketSummaryCheckoutItems}
                displayBasketTitle={noOfferInCheckoutItems}
                isExcludingTax={isExcludingTax}
                isItemEditionDisabled={isBasketModificationDisabled}
                onAddCheckoutItem={handleAddCheckoutItem}
                onRemoveCheckoutItem={handleRemoveCheckoutItem}
              />
            </Collapse>
            {isMobile && basketSummaryCheckoutItems.length > 0 && (
              <Button
                className={classes.expandContainer}
                onClick={OnBasketRequest}
              >
                {isBasketDisplayed ? <ExpandLess /> : <ExpandMore />}
              </Button>
            )}
          </div>
          <div className={classes.purchaseSummary}>
            <ActivitiesSummary
              activitySummaryCheckoutItems={activitySummaryCheckoutItems}
              basketLoading={basketLoading}
              basketOffers={basketOffers}
              companyTheme={theme}
              connectedToOtherComponents={
                !isMobile || basketSummaryCheckoutItems.length > 0
              }
              handleCheckoutItemExpiration={handleCheckoutItemExpiration}
            />
          </div>
          <div className={classes.validationContainer}>
            <div className={classes.couponCodeInput}>
              <CouponCodeInput
                isBasketModificationDisabled={isBasketModificationDisabled}
                onSubmit={attachCoupon}
              />
            </div>
            <PriceCount
              basket={basket}
              isDeleteButtonDisabled={isBasketModificationDisabled}
              isExcludingTax={isExcludingTax}
              onRemoveCheckoutItem={handleRemoveCheckoutItem}
              onRemoveInternalAccountPrepaidLine={
                onRemoveInternalAccountPrepaidLine
              }
              prepaidLines={basket.prepaid_lines}
            />
            {!isMobile && (
              <CheckoutButtonsUnified
                checkoutStepsRef={checkoutStepsRef}
                onConfirmPaymentSuccess={onConfirmPaymentSuccess}
                paymentContext={{
                  basketId: basket.id,
                  memberId: basket.member,
                  companyId: companyId,
                }}
                totalAmountToPay={displayedAmountToPayCts / 100}
              />
            )}
          </div>
          {isMobile && (
            <div className={classes.checkoutButtonsContainer}>
              <CheckoutButtonsUnified
                checkoutStepsRef={checkoutStepsRef}
                onConfirmPaymentSuccess={onConfirmPaymentSuccess}
                paymentContext={{
                  basketId: basket.id,
                  memberId: basket.member,
                  companyId: companyId,
                }}
                totalAmountToPay={displayedAmountToPayCts / 100}
              />
            </div>
          )}
        </div>
      </div>
      <ExpiredSpotDialog
        handleClose={handleCloseExpiredSpotDialog}
        loading={basketItemRemovalStatusLoading}
        open={expiredSpotDialogOpen}
      />
    </BasketPaymentProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
  arrowIcon: { color: theme.palette.grey[600] },
  subContainer: {
    display: 'grid',
    gridTemplateAreas: `"payment basket"
                        "payment confirm"
                        "payment summary"
                        "payment checkoutButtons"`,
    gridTemplateColumns: '2fr 1fr',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `"basket"
                          "summary"
                          "confirm"
                          "payment"
                          "checkoutButtons"`,
    },
  },
  paymentContainer: {
    gridArea: 'payment',
    marginTop: '0',
    gridColumnStart: '1',
    gridColumnEnd: 'span 1',
    gridRowStart: '1',
    [theme.breakpoints.down('sm')]: {
      gridRowStart: '4',
    },
  },
  basketAlert: {
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  scrollableItems: {
    gridArea: 'basket',
    gridColumnStart: '2',
    overflowY: 'auto',
    maxHeight: '600px',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: '1',
      maxHeight: 'none',
      overflowY: 'none',
      gridRowStart: '1',
    },
  },
  validationContainer: {
    gridArea: 'confirm',
    marginTop: '0',
    gridColumnStart: '2',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: '1',
      gridRowStart: '3',
    },
  },
  expandContainer: {
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '0 0 12px 12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  couponCodeInput: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.grey[100],
    [theme.breakpoints.down('sm')]: {
      borderWidth: '0px',
    },
  },
  purchaseSummary: {
    gridArea: 'summary',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: '1',
      gridRowStart: '2',
      gridRowEnd: 'span 1',
    },
  },
  checkoutButtonsContainer: {
    gridArea: 'checkoutButtons',
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(NewCheckoutFlow);
