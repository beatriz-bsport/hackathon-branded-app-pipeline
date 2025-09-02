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

import ActivitiesSummary from './ActivitiesSummary.component';
import BasketSummary from './BasketSummary.component';
import CheckoutButtons from './CheckoutButtons.component';
import { CheckoutItemList } from './CheckoutItemList.component';
import { CheckoutSteps } from './CheckoutSteps.component';
import CouponCodeInput from './CouponCodeInput.component';
import EmptyBasket from './EmptyBasket';
import ExpiredSpotDialog from './ExpiredSpotDialog';
import PriceCount from './PriceCount';

import { useWidth } from '#src/hooks/useWidth';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { Offer } from '#src/libs/offer/types';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '#src/libs/establishment/types';
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
import {
  useHandleSubmitButtonsCallbacks,
  useSubmitButtonsDisabledState,
  useSubmitButtonsDisplayableState,
  useSubmitButtonsProcessingState,
} from './submitButtonsHooks';

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
    options: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  basket: Basket<string, PrepaidLine>;
  basketItemRemovalStatusLoading: boolean;
  basketLoading: boolean;
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  clientSecretLoading: boolean;
  companyId: number;
  enableMultiLocalization?: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  goBack: () => void;
  goToCalendar: () => void;
  goToMarketplace: () => void;
  goToMyProfile: () => void;
  isEstablishmentBillingGroupSelected: boolean;
  isExcludingTax: boolean;
  monitorExpiredItemRemoval: (
    companyId: number,
    checkoutItemId: string,
    pollOptionCallback?: APIPollOptionCallback,
  ) => void;
  onPaymentSuccess: (callback?: () => void) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  paymentEngine: number;
  paymentPackOrComboCanNotBookAllOffers: boolean;
  paymentProcessing?: boolean;
  refreshBasket: (options?: OptionCallback) => void;
  removeItemFromBasket: (
    basketId: string,
    data: OnRemoveCheckoutItemData,
  ) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setPaymentProcessing: (iPaymentProcessing: boolean) => void;
  setSelectedEstablishmentBillingGroup: (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  termsAndConditionsAccepted: boolean;
  theme: CompanyTheme;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
};

export const NewCheckoutFlow: React.FC<Props> = ({
  addItemToBasket,
  attachCoupon,
  basket,
  basketItemRemovalStatusLoading,
  basketLoading,
  basketOffers,
  checkItemsBasket,
  clientSecret,
  clientSecretLoading,
  companyId,
  enableMultiLocalization,
  establishmentBillingGroups,
  goBack,
  goToCalendar,
  goToMarketplace,
  goToMyProfile,
  isEstablishmentBillingGroupSelected,
  isExcludingTax,
  monitorExpiredItemRemoval,
  onPaymentSuccess,
  onRemoveInternalAccountPrepaidLine,
  onSelectInstalmentPayment,
  patchBasket,
  paymentEngine,
  paymentPackOrComboCanNotBookAllOffers,
  paymentProcessing,
  refreshBasket,
  removeItemFromBasket,
  selectedEstablishmentBillingGroup,
  setIsEstablishmentBillingGroupSelected,
  setPaymentProcessing,
  setSelectedEstablishmentBillingGroup,
  setTermsAndConditionsAccepted,
  termsAndConditionsAccepted,
  theme,
  updateMemberBillingGroup,
  validateUnpaid,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

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
  const [lastSubmitButtonClicked, setLastSubmitButtonClicked] = useState<
    number | null
  >(null);
  const [isBasketDisplayed, setIsBasketDisplayed] = useState(true);
  const [expiredSpotDialogOpen, setExpiredSpotDialogOpen] = useState(false);
  const [expiredCheckoutItemIdToMonitor, setExpiredCheckoutItemIdToMonitor] =
    useState<string | null>(null);

  const isOnlinePaymentAvailable = basket.available_payment_methods.includes(
    PAYMENT_METHOD_CB.id,
  );
  const isPayLaterAvailable = basket.available_payment_methods.includes(
    PAYMENT_METHOD_CREDIT_ACCOUNT.id,
  );
  const isTotalPriceNull = !(
    (basket.total_price_cts || 0) - (basket.total_price_prepaid_lines_cts || 0)
  );
  const isBasketModificationDisabled = paymentProcessing || basketLoading;
  const noOfferInCheckoutItems = basketOffers?.length === 0;
  const companyCountry = useMemo(() => theme.locale.split('_')[1], [theme]);
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

  // Handlers
  const checkoutStepsRef = useRef(null);
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

  // DISPLAY CONSTANTS DEFINITION

  // All the submit buttons display logic should be here.

  // NOTE: If one day we gather all payment methods (including Pay Later or something online different
  // from Stripe) in one card selector/carousel, with only one submit button for all these payment methods,
  // it would be more convenient to handle the state (including activated/disabled, processing and submit callback definition)
  // of the submit button in the`PaymentStep` component.

  // Indeed this component would handle a kind of 'selectedPaymentMethod' and redefine the activated/
  // disabled state of the button according to this 'selectedPaymentMethod'.

  // Then, this higher - level component
  // `NewCheckoutFlow` should not be concerned about the chosen payment method and only look at the activated/disabled
  // state of the submit button.

  // Definition of the activated/disabled state of each button
  const submitButtonsDisabledState = useSubmitButtonsDisabledState({
    basketLoading,
    paymentProcessing: paymentProcessing ?? false,
    currentStepId: currentStep.id,
    isOnlinePaymentDisabled: false,
    termsAndConditionsAccepted,
    isEstablishmentBillingGroupSelected,
  });
  const submitButtonsDisplayableState = useSubmitButtonsDisplayableState({
    currentStepId: currentStep.id,
    isOnlinePaymentAvailable,
    paymentEngine,
    isPayLaterAvailable,
    isTotalPriceNull,
  });
  const submitButtonsProcessingState = useSubmitButtonsProcessingState({
    paymentProcessing: paymentProcessing ?? false,
    lastSubmitButtonClicked,
  });
  const handleSubmitButtonsCallbacks = useHandleSubmitButtonsCallbacks({
    checkoutStepsRef,
    setLastSubmitButtonClicked,
  });

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
    <>
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
            <CheckoutSteps
              ref={checkoutStepsRef}
              basket={basket}
              basketHasOffers={!noOfferInCheckoutItems}
              checkItemsBasket={checkItemsBasket}
              companyCountry={companyCountry}
              companyId={companyId}
              currentStep={currentStep}
              enableMultiLocalization={enableMultiLocalization ?? false}
              establishmentBillingGroups={establishmentBillingGroups}
              isOnlinePaymentAvailable={isOnlinePaymentAvailable}
              isPayLaterAvailable={isPayLaterAvailable}
              isTotalPriceNull={isTotalPriceNull}
              onPaymentSuccess={onPaymentSuccess}
              onSelectInstalmentPayment={onSelectInstalmentPayment}
              patchBasket={patchBasket}
              selectedEstablishmentBillingGroup={
                selectedEstablishmentBillingGroup
              }
              setCurrentStep={setCurrentStep}
              setIsEstablishmentBillingGroupSelected={
                setIsEstablishmentBillingGroupSelected
              }
              setPaymentProcessing={setPaymentProcessing}
              setSelectedEstablishmentBillingGroup={
                setSelectedEstablishmentBillingGroup
              }
              setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
              steps={steps}
              termsAndConditionsAccepted={termsAndConditionsAccepted}
              updateMemberBillingGroup={updateMemberBillingGroup}
              validateUnpaid={validateUnpaid}
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
              <CheckoutButtons
                clientSecret={clientSecret ?? ''}
                clientSecretLoading={clientSecretLoading}
                handleSubmitButtonsCallbacks={handleSubmitButtonsCallbacks}
                submitButtonsDisabledState={submitButtonsDisabledState}
                submitButtonsDisplayableState={submitButtonsDisplayableState}
                submitButtonsProcessingState={submitButtonsProcessingState}
              />
            )}
          </div>
          {isMobile && (
            <div className={classes.checkoutButtonsContainer}>
              <CheckoutButtons
                clientSecret={clientSecret ?? ''}
                clientSecretLoading={clientSecretLoading}
                handleSubmitButtonsCallbacks={handleSubmitButtonsCallbacks}
                submitButtonsDisabledState={submitButtonsDisabledState}
                submitButtonsDisplayableState={submitButtonsDisplayableState}
                submitButtonsProcessingState={submitButtonsProcessingState}
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
    </>
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
