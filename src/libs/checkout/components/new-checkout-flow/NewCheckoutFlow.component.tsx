import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable, { ImmutableArray } from 'seamless-immutable';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';

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
import { OptionCallback } from '../../../../state/types';
import { ActivitiesSummary } from './ActivitiesSummary.component';
import { BasketSummary } from './BasketSummary.component';
import CouponCodeInput from './CouponCodeInput.component';
import { InstalmentPayment } from '#libs/instalment-payment-configuration/types';
import { PriceCount } from './PriceCount.component';
import { CheckoutSteps } from './CheckoutSteps.component';
import { CompanyTheme } from '#libs/theme/types';
import CheckoutButtons from './CheckoutButtons.component';
import { Offer } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';

import {
  useHandleSubmitButtonsCallbacks,
  useSubmitButtonsDisabledState,
  useSubmitButtonsDisplayableState,
  useSubmitButtonsProcessingState,
} from './submitButtonsHooks';

// These checkout item types are displayed in the bill after the basket summary
const BILL_CHECKOUT_ITEMS = [BUYABLE_ITEM_COUPON, BUYABLE_ITEM_FEE];

type NewCheckoutFlowProps = {
  addItemToBasket: (
    basketId: string,
    data: CheckoutItemData,
    options?: OptionCallback,
  ) => void;
  allowConsumerToUseInternalAccount: boolean;
  attachCoupon: (code: string, options: OptionCallback) => void;
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
  instalmentPaymentConfigurationList: Array<InstalmentPayment> | null;
  isExcludingTax: boolean;
  onPaymentSuccess: (callback?: () => void) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  onSelectInstalmentPayment: (id: number, options: OptionCallback) => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  paymentGroupId: number;
  paymentProcessing?: boolean;
  removeItemFromBasket: (
    basketId: string,
    data: OnRemoveCheckoutItemData,
  ) => void;
  setPaymentProcessing: (iPaymentProcessing: boolean) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  termsAndConditionsAccepted: boolean;
  theme: CompanyTheme;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
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
  creditAccountBalance,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  instalmentPaymentConfigurationList,
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
  snackbarErrorMsg,
  snackbarSuccessMsg,
  termsAndConditionsAccepted,
  theme,
  useInternalAccount,
  validateUnpaid,
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

  //  STATE DEFINITION

  const [currentStep, setCurrentStep] = React.useState<StepType>(steps[0]);

  const [isOnlinePaymentDisabled, setIsOnlinePaymentDisabled] =
    React.useState<boolean>(false);

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
    currentStepId: currentStep.id,
    isOnlinePaymentDisabled,
    termsAndConditionsAccepted,
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
  });

  // Definition of the callbacks called on click for each button
  const handleSubmitButtonsCallbacks = useHandleSubmitButtonsCallbacks({
    checkoutStepsRef,
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

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <ArrowBack className={classes.arrowIcon} />
        <Typography variant="h5" className={classes.title}>
          {t('payment.title')}
        </Typography>
      </div>
      <div className={classes.subContainer}>
        <div className={classes.paymentContainer}>
          <CheckoutSteps
            allowConsumerToUseInternalAccount={
              allowConsumerToUseInternalAccount
            }
            auth={auth}
            basket={basket}
            basketLoading={basketLoading}
            checkItemsBasket={checkItemsBasket}
            clientSecret={clientSecret}
            companyId={companyId}
            createPendingBookingsIfNecessary={createPendingBookingsIfNecessary}
            creditAccountBalance={creditAccountBalance}
            currentStep={currentStep}
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            instalmentPaymentConfigurationList={instalmentPaymentConfigurationList.filter(
              (ipc) => ipc.basketId === basket?.id,
            )}
            isOnlinePaymentAvailable={isOnlinePaymentAvailable}
            isPayLaterAvailable={isPayLaterAvailable}
            isTotalPriceNull={isTotalPriceNull}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            onPaymentSuccess={onPaymentSuccess}
            patchBasket={patchBasket}
            paymentGroupId={paymentGroupId}
            paymentProcessing={paymentProcessing}
            paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
              PAYMENT_ENGINE_STRIPE
            ].filter((pm) =>
              (theme.payment_method_available_basket || []).includes(pm),
            )}
            ref={checkoutStepsRef}
            setCurrentStep={setCurrentStep}
            setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
            setPaymentProcessing={setPaymentProcessing}
            setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
            snackbarErrorMsg={snackbarErrorMsg}
            snackbarSuccessMsg={snackbarSuccessMsg}
            steps={steps}
            stripeId={theme.stripe_id}
            termsAndConditions={theme.general_terms_and_conditions}
            termsAndConditionsAccepted={termsAndConditionsAccepted}
            useInternalAccount={useInternalAccount}
            validateUnpaid={validateUnpaid}
          />
        </div>
        <div className={classes.sumupContainer}>
          <div className={classes.scrollableItems}>
            <ActivitiesSummary
              basketOffers={basketOffers}
              activitySummaryCheckoutItems={activitySummaryCheckoutItems}
              companyTheme={theme}
            />
            <BasketSummary
              basketSummaryCheckoutItems={basketSummaryCheckoutItems}
              isExcludingTax={isExcludingTax}
              isItemEditionDisabled={isBasketModificationDisabled}
              onAddCheckoutItem={handleAddCheckoutItem}
              onRemoveCheckoutItem={handleRemoveCheckoutItem}
            />
          </div>
          <CouponCodeInput
            onSubmit={attachCoupon}
            isBasketModificationDisabled={isBasketModificationDisabled}
          />
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
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(3),
    width: '90%',
    height: '46vh',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: { color: theme.palette.grey[600] },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '32px',
  },
  paymentContainer: { flex: 0.65 },
  title: {
    padding: theme.spacing(2),
  },
  featureBanner: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    maxWidth: '90vw',
  },
  paper: {
    padding: theme.spacing(2),
  },
  sumupContainer: {
    flex: 0.32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  scrollableItems: { overflowY: 'auto', maxHeight: '600px' },
}));

export default NewCheckoutFlow;
