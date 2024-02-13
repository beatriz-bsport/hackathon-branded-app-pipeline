import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable, { ImmutableArray } from 'seamless-immutable';

import { isWidthDown, makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';
import {
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  CB as PAYMENT_METHOD_CB,
} from '@bsport/common/lib/master-data/payment-methods';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items';

import {
  CheckoutItem,
  Basket,
  PrepaidLine,
  BasketAddress,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
  StepType,
  STEPS,
} from '../../types';
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
  APIPollOptionCallback,
} from '../../../../state/types';
import ActivitiesSummary from './ActivitiesSummary.component';
import BasketSummary from './BasketSummary.component';
import CouponCodeInput from './CouponCodeInput.component';
import type { InstalmentPaymentApiWithBasketId } from '#libs/instalment-payment-configuration/types';
import PriceCount from '#libs/checkout/components/new-checkout-flow/PriceCount';
import { CheckoutSteps } from './CheckoutSteps.component';
import type { CompanyTheme } from '#libs/theme/types';
import CheckoutButtons from './CheckoutButtons.component';
import type { Offer } from '#libs/offer/types';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import EmptyBasket from '#libs/checkout/components/new-checkout-flow/EmptyBasket';
import ExpiredSpotDialog from '#libs/checkout/components/new-checkout-flow/ExpiredSpotDialog';

import {
  useHandleSubmitButtonsCallbacks,
  useSubmitButtonsDisabledState,
  useSubmitButtonsDisplayableState,
  useSubmitButtonsProcessingState,
} from './submitButtonsHooks';
import type { Coupon } from '#libs/coupon/types';
import { CouponErrorCodes } from '#libs/coupon/constants';
import { useWidth } from '../../../../hooks/useWidth';

// These checkout item types are displayed in the bill after the basket summary
const BILL_CHECKOUT_ITEMS = [BUYABLE_ITEM_COUPON, BUYABLE_ITEM_FEE];

type NewCheckoutFlowProps = {
  addItemToBasket: (
    basketId: string,
    data: CheckoutItemData,
    options?: OptionCallback,
  ) => void;
  allowConsumerToUseInternalAccount: boolean;
  attachCoupon: (
    code: string,
    options: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  auth: any;
  basket: Basket<string, PrepaidLine>;
  basketLoading: boolean;
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  creditAccountBalance?: number | null;
  detachPaymentMethod: (paymentMethodId: string) => void;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization?: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  goBack: () => void;
  instalmentPaymentConfigurationList: InstalmentPaymentApiWithBasketId[] | null;
  isEstablishmentBillingGroupSelected: boolean;
  isExcludingTax: boolean;
  onPaymentSuccess: (callback?: () => void) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  paymentGroupId: number;
  paymentProcessing?: boolean;
  removeItemFromBasket: (
    basketId: string,
    data: OnRemoveCheckoutItemData,
  ) => void;
  setPaymentProcessing: (iPaymentProcessing: boolean) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  termsAndConditionsAccepted: boolean;
  theme: CompanyTheme;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
  goToMarketplace: () => void;
  goToCalendar: () => void;
  goToMyProfile: () => void;
  basketItemRemovalStatusLoading: boolean;
  monitorExpiredItemRemoval: (
    companyId: number,
    checkoutItemId: string,
    pollOptionCallback?: APIPollOptionCallback,
  ) => void;
  refreshBasket: (options?: OptionCallback) => void;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setSelectedEstablishmentBillingGroup: (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => void;
};

export const NewCheckoutFlow: React.FC<NewCheckoutFlowProps> = ({
  addItemToBasket,
  allowConsumerToUseInternalAccount,
  attachCoupon,
  auth,
  basket,
  basketLoading,
  basketOffers,
  checkItemsBasket,
  clientSecret,
  companyId,
  createPendingBookingsIfNecessary,
  updateMemberBillingGroup,
  creditAccountBalance,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  enableMultiLocalization,
  establishmentBillingGroups,
  goBack,
  instalmentPaymentConfigurationList,
  isEstablishmentBillingGroupSelected,
  isExcludingTax,
  onPaymentSuccess,
  onRemoveInternalAccountPrepaidLine,
  onSelectInstalmentPayment,
  patchBasket,
  paymentGroupId,
  paymentProcessing,
  removeItemFromBasket,
  setPaymentProcessing,
  setTermsAndConditionsAccepted,
  setIsEstablishmentBillingGroupSelected,
  snackbarErrorMsg,
  snackbarSuccessMsg,
  termsAndConditionsAccepted,
  theme,
  useInternalAccount,
  validateUnpaid,
  goToMarketplace,
  goToCalendar,
  goToMyProfile,
  basketItemRemovalStatusLoading,
  monitorExpiredItemRemoval,
  refreshBasket,
  selectedEstablishmentBillingGroup,
  setSelectedEstablishmentBillingGroup,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  const steps: ImmutableArray<StepType> = React.useMemo(
    () =>
      basket.need_address
        ? Immutable([STEPS.ADDRESS_STEP, STEPS.PAYMENT_STEP])
        : Immutable([STEPS.PAYMENT_STEP]),
    [basket.need_address],
  );

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

  const checkoutStepsRef = React.useRef(null);
  const billingGroupSelectorRef = React.useRef(null);

  //  STATE DEFINITION

  const [currentStep, setCurrentStep] = React.useState<StepType>(steps[0]);

  const [lastSubmitButtonClicked, setLastSubmitButtonClicked] = React.useState<
    number | null
  >(null);

  const [isOnlinePaymentDisabled, setIsOnlinePaymentDisabled] =
    React.useState<boolean>(false);

  const [isBasketDisplayed, setIsBasketDisplayed] = React.useState(true);

  const [expiredSpotDialogOpen, setExpiredSpotDialogOpen] =
    React.useState(false);

  const [expiredCheckoutItemIdToMonitor, setExpiredCheckoutItemIdToMonitor] =
    React.useState<string | null>(null);

  const handleCheckoutItemExpiration = React.useCallback(
    (checkoutItemId: string) => {
      setExpiredCheckoutItemIdToMonitor(checkoutItemId);
      setExpiredSpotDialogOpen(true);
    },
    [],
  );

  const handleCloseExpiredSpotDialog = React.useCallback(() => {
    monitorExpiredItemRemoval(companyId, expiredCheckoutItemIdToMonitor, {
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

  // If the basket does not need anymore an adress, we should go to the next step directly
  React.useEffect(() => {
    if (!steps.map((step) => step.id).includes(currentStep.id))
      setCurrentStep(steps[0]);
  }, [currentStep, steps]);

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
    paymentProcessing,
    currentStepId: currentStep.id,
    isOnlinePaymentDisabled,
    termsAndConditionsAccepted,
    isEstablishmentBillingGroupSelected,
  });

  // Definition of the presence on the screen or not of each button
  const submitButtonsDisplayableState = useSubmitButtonsDisplayableState({
    currentStepId: currentStep.id,
    isOnlinePaymentAvailable,
    isPayLaterAvailable,
    isTotalPriceNull,
  });

  // Definition of the processing state of each button, processing meaning that the
  // button will be filled with a Circular Progress an disabled
  const submitButtonsProcessingState = useSubmitButtonsProcessingState({
    paymentProcessing,
    lastSubmitButtonClicked,
  });

  // Definition of the callbacks called on click for each button
  const handleSubmitButtonsCallbacks = useHandleSubmitButtonsCallbacks({
    checkoutStepsRef,
    setLastSubmitButtonClicked,
  });

  // In the basket summary we don't want to display the checkout items already in the bill
  // below (the NOT_DISPLAYABLE_CHECKOUT_ITEMS), and also all items linked to an offer since
  // they are already displayed above
  const basketSummaryCheckoutItems: Array<CheckoutItem> = useMemo(
    () =>
      basket.checkout_items.filter(
        (checkoutItem) =>
          !BILL_CHECKOUT_ITEMS.includes(checkoutItem.buyable_item_identifier) &&
          !checkoutItem.extra_data?.offers_data,
      ),
    [basket.checkout_items],
  );

  // In the activity summary we don't want to display the checkout items already in the bill
  // below (the NOT_DISPLAYABLE_CHECKOUT_ITEMS), but we want to display items linked to an offer
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

  // CALLBACKS DEFINITION

  const handleRemoveCheckoutItem = React.useCallback(
    (handleRemoveCheckoutItemData: OnRemoveCheckoutItemData) => {
      removeItemFromBasket(basket.id, handleRemoveCheckoutItemData);
    },
    [basket.id, removeItemFromBasket],
  );

  const handleAddCheckoutItem = React.useCallback(
    (handleAddCheckoutItemData: CheckoutItemData) => {
      addItemToBasket(basket.id, handleAddCheckoutItemData);
    },
    [addItemToBasket, basket.id],
  );
  const companyCountry = useMemo(() => theme.locale.split('_')[1], [theme]);

  const OnBasketRequest = React.useCallback(
    () => setIsBasketDisplayed(!isBasketDisplayed),
    [isBasketDisplayed],
  );

  const noOfferInCheckoutItems = basketOffers?.length === 0;
  const width = useWidth();
  const isMobile = isWidthDown('sm', width);

  if (!basketLoading && basket?.checkout_items?.length === 0) {
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
              allowConsumerToUseInternalAccount={
                allowConsumerToUseInternalAccount
              }
              auth={auth}
              basket={basket}
              basketHasOffers={!noOfferInCheckoutItems}
              basketLoading={basketLoading}
              billingGroupSelectorRef={billingGroupSelectorRef}
              cardBillingDetailsMandatory={theme.force_billing_details_on_cards}
              checkItemsBasket={checkItemsBasket}
              clientSecret={clientSecret}
              companyCountry={companyCountry}
              companyId={companyId}
              createPendingBookingsIfNecessary={
                createPendingBookingsIfNecessary
              }
              creditAccountBalance={creditAccountBalance}
              currentStep={currentStep}
              detachPaymentMethod={detachPaymentMethod}
              detachPaymentMethodLoading={detachPaymentMethodLoading}
              enableMultiLocalization={enableMultiLocalization}
              establishmentBillingGroups={establishmentBillingGroups}
              instalmentPaymentConfigurationList={instalmentPaymentConfigurationList.filter(
                (ipc) => ipc.basketId === basket?.id,
              )}
              isEstablishmentBillingGroupSelected={
                isEstablishmentBillingGroupSelected
              }
              isOnlinePaymentAvailable={isOnlinePaymentAvailable}
              isPayLaterAvailable={isPayLaterAvailable}
              isTotalPriceNull={isTotalPriceNull}
              onPaymentSuccess={onPaymentSuccess}
              onSelectInstalmentPayment={onSelectInstalmentPayment}
              patchBasket={patchBasket}
              paymentGroupId={paymentGroupId}
              paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
                PAYMENT_ENGINE_STRIPE
              ].filter((pm) =>
                (theme.payment_method_available_basket || []).includes(pm),
              )}
              paymentProcessing={paymentProcessing}
              selectedEstablishmentBillingGroup={
                selectedEstablishmentBillingGroup
              }
              setCurrentStep={setCurrentStep}
              setIsEstablishmentBillingGroupSelected={
                setIsEstablishmentBillingGroupSelected
              }
              setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
              setPaymentProcessing={setPaymentProcessing}
              setSelectedEstablishmentBillingGroup={
                setSelectedEstablishmentBillingGroup
              }
              setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
              snackbarErrorMsg={snackbarErrorMsg}
              snackbarSuccessMsg={snackbarSuccessMsg}
              steps={steps}
              stripeId={theme.stripe_id}
              termsAndConditions={theme.general_terms_and_conditions}
              termsAndConditionsAccepted={termsAndConditionsAccepted}
              updateMemberBillingGroup={updateMemberBillingGroup}
              useInternalAccount={useInternalAccount}
              validateUnpaid={validateUnpaid}
            />
          </div>
          <div className={classes.scrollableItems}>
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
            <CheckoutButtons
              handleSubmitButtonsCallbacks={handleSubmitButtonsCallbacks}
              submitButtonsDisabledState={submitButtonsDisabledState}
              submitButtonsDisplayableState={submitButtonsDisplayableState}
              submitButtonsProcessingState={submitButtonsProcessingState}
            />
          </div>
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

const useStyles = makeStyles((theme: Theme) => ({
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
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: 'auto 1fr auto',
    columnGap: theme.spacing(3),
  },
  paymentContainer: {
    marginTop: '0',
    gridColumnStart: '1',
    gridColumnEnd: 'span 1',
    gridRowStart: '1',
    gridRowEnd: 'span 2',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
      gridColumnStart: '1',
      gridColumnEnd: 'span 2',
      gridRowStart: '2',
      gridRowEnd: 'span 1',
    },
  },
  scrollableItems: {
    gridColumnStart: '2',
    gridColumnEnd: 'span 1',
    gridRowStart: '1',
    overflowY: 'auto',
    maxHeight: '600px',
    [theme.breakpoints.down('sm')]: {
      gridColumnStart: '1',
      gridColumnEnd: 'span 2',
      maxHeight: 'none',
      overflowY: 'none',
    },
  },
  validationContainer: {
    marginTop: '0',
    gridColumnStart: '2',
    gridColumnEnd: 'span 1',
    gridRowStart: '2',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
      gridColumnStart: '1',
      gridColumnEnd: 'span 2',
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
}));

export default NewCheckoutFlow;
