import React, { forwardRef, useCallback } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
} from '@bsport/common/lib/master-data/payment-group';

import type { OptionCallback } from '#state/types';
import type { Basket } from '#libs/checkout/types';
import type { EstablishmentBillingGroup } from '#libs/establishment/types';
import type { InstalmentPaymentApiWithBasketId } from '#libs/instalment-payment-configuration/types';
import { TermsAndConditionType, type StripeInit } from '#libs/payment/types';

import AcceptTermsAndConditions from '#libs/payment/components/AcceptTermsAndConditions.component';
import CheckoutBillingGroupSelector from '#libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import InstalmentPaymentSelector from '#libs/instalment-payment-configuration/components/InstalmentPaymentSelector.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import PaymentMethodCardSelector from '#libs/payment/components/PaymentMethodCardSelector.component';
import PriceInput from '#components/input/PriceInput.component';
import {
  getStripePkKey,
  getCurrencyDisplayWithPrice,
  getCompanyCountry,
  getStripeRegion,
} from '#libs/theme/selectors';
import {
  updateIntentToSavePaymentMethod as updateIntentToSavePaymentMethodAPI,
  updateIntentToSavePaymentMethodWebview as updateIntentToSavePaymentMethodWebviewAPI,
} from '#libs/payment/api';
import PaymentStripeBacsDebit from './PaymentStripeBacsDebit.component';
import PaymentStripeBancontact from './PaymentStripeBancontact.component';
import PaymentStripeCard from './PaymentStripeCard.component';
import PaymentStripeEPS from './PaymentStripeEPS.component';
import PaymentStripeGiropay from './PaymentStripeGiropay.component';
import PaymentStripeIdeal from './PaymentStripeIdeal.component';
import PaymentStripeSEPA from './PaymentStripeSEPA.component';
import PaymentStripeSofort from './PaymentStripeSofort.component';


const fallbackStripePromise = loadStripe(getStripePkKey());

const SAVE_FOR_LATER_OFF_SESSION = 'off_session';

type PaymentStripeProps = {
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  basketTotalPricePrepaidLines?: number;
  cardBillingDetailsMandatory: boolean;
  clientSecret: string;
  companyId: number;
  creditAccountBalance?: number | null;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
  forceHideButton?: boolean;
  fromApp?: boolean;
  hidePrice?: boolean;
  instalmentPaymentConfigurationList?:
    | InstalmentPaymentApiWithBasketId[]
    | null;
  instalmentPaymentSelectedId?: number;
  isEstablishmentBillingGroupSelected?: boolean;
  loading: boolean;
  memberId: number;
  paymentGroupId: number;
  paymentGroupPriceCts?: number;
  paymentMethodChoices: number[];
  paymentProcessing?: boolean;
  ref?: React.Ref<any>;
  selectedEstablishmentBillingGroup?: EstablishmentBillingGroup;
  sepaDefaultEmail?: string;
  sepaDefaultName?: string;
  stripeId: string | null;
  termsAndConditions?: string;
  termsAndConditionsAccepted?: boolean;
  applyBalanceToInvoice?: () => void;
  checkItemsBasket?: (basketId: string) => boolean; // Only necessary if there is there is a basketId
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  detachPaymentMethod: (pm_id: string) => void;
  onCancel: () => void;
  onError?: () => void;
  onSelectInstalmentPayment?: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onSuccess: (callback?: () => void) => void;
  setIsEstablishmentBillingGroupSelected?: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setSelectedEstablishmentBillingGroup?: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  snackbarErrorMsg?: (msg: string) => void;
  snackbarSuccessMsg?: (msg: string) => void;
  updateMemberBillingGroup?: (establishmentBillingGroupId: number) => void;
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  useInternalAccount?: (amount: number) => void;
  stripePromise?: StripeInit;
};

type PaymentStripePropsNewCheckoutFlow = Omit<
  PaymentStripeProps,
  'onCancel' | 'paymentGroupPriceCts' | 'updatePriceCts'
> &
  Partial<PaymentStripeProps>;

const STRIPE_PAYMENT_METHOD_FORM_COMPONENT: { [key: number]: any } = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: PaymentStripeCard,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: PaymentStripeSEPA,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: PaymentStripeBancontact,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: PaymentStripeIdeal,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: PaymentStripeSofort,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: PaymentStripeEPS,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: PaymentStripeGiropay,
  // [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: PaymentStripeMobilePay,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]: PaymentStripeBacsDebit,
};

const BACS_DEBIT_ELEMENT_APPEARANCE: Appearance = {
  theme: 'stripe',

  variables: {
    colorPrimary: '#32325d',
    fontFamily: 'Roboto, sans-serif',
    fontSizeBase: '16px',
    fontWeightNormal: '400',
    fontLineHeight: '1.5',
  },
};

const PaymentStripe: React.FC<
  PaymentStripeProps | PaymentStripePropsNewCheckoutFlow
> = forwardRef(
  (
    {
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      basketId,
      basketTotalPriceCts,
      basketTotalPricePrepaidLines,
      cardBillingDetailsMandatory,
      clientSecret,
      companyId,
      creditAccountBalance,
      detachPaymentMethodLoading,
      enableMultiLocalization,
      establishmentBillingGroups,
      forceHideButton,
      fromApp,
      hidePrice,
      instalmentPaymentConfigurationList,
      instalmentPaymentSelectedId,
      isEstablishmentBillingGroupSelected = true,
      loading,
      memberId,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodChoices,
      paymentProcessing,
      selectedEstablishmentBillingGroup,
      sepaDefaultEmail,
      sepaDefaultName,
      stripeId,
      termsAndConditions,
      termsAndConditionsAccepted,
      applyBalanceToInvoice,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      detachPaymentMethod,
      onCancel,
      onError,
      onSelectInstalmentPayment,
      onSuccess,
      setIsEstablishmentBillingGroupSelected,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      updateMemberBillingGroup,
      updatePriceCts,
      useInternalAccount,
      stripePromise,
    },
    ref,
  ) => {
    const classes = useStyles();

    const [paymentMethodSelected, selectPaymentMethod] = React.useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );

    const isBacsDebitSelected =
      paymentMethodSelected === PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT;

    const companyCountry = getCompanyCountry();
    const stripeRegion = getStripeRegion();

    // If the company is in UK Europe Country, BACS Direct Debit could be available and so the PaymentIntent could need a reset
    const isInUkEurope = stripeRegion === 'Europe' && companyCountry === 'GB';

    const StripePaymentMethodForm =
      STRIPE_PAYMENT_METHOD_FORM_COMPONENT[paymentMethodSelected];

    const updateIntentToSavePaymentMethodAdaptedAPI = fromApp
      ? updateIntentToSavePaymentMethodWebviewAPI
      : updateIntentToSavePaymentMethodAPI;

    const [processing, setProcessing] = React.useState(true);
    const [elementOptions, setElementOptions] = React.useState({});
    const [saveForLaterBacsDebit, setSaveForLaterBacsDebit] =
      React.useState<boolean>(false);
    const [priceUpdaterOpen, setPriceUpdaterOpen] = React.useState(false);
    const [priceUpdateAmount, setPriceUpdateAmount] = React.useState(
      paymentGroupPriceCts / 100,
    );

    const totalPriceCts = basketTotalPriceCts || paymentGroupPriceCts;

    const handleSelectPaymentMethod = useCallback(
      async (paymentMethod: number) => {
        // If we change the payment method we want to reinitialize the 'save_for_later"
        // option on the Payment Intent, for the companies where BACS Direct Debit is available
        if (
          paymentGroupId &&
          paymentMethod !== PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT
        ) {
          setElementOptions({});
          try {
            if (isInUkEurope && (!fromApp || basketId)) {
              await updateIntentToSavePaymentMethodAdaptedAPI({
                save_for_later: false,
                payment_group_id: paymentGroupId,
                ...(fromApp ? { basket_id: basketId } : {}),
              });
              setSaveForLaterBacsDebit(false);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          // If we change the payment method to BACS Direct Debit we want to be sure
          // not to try to mount the PaymentStripeBacsDebit component without having updated
          // the elementOptions.
          setProcessing(true);
        }
        selectPaymentMethod(paymentMethod);
      },
      [
        basketId,
        fromApp,
        isInUkEurope,
        paymentGroupId,
        selectPaymentMethod,
        updateIntentToSavePaymentMethodAdaptedAPI,
      ],
    );

    // This useEffect is mandatory in the new checkout flow, since if this condition is not
    // fullfilled no Stripe PaymentMethodForm component is mounted yet and so we don't want the
    // Pay button to be active
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(processing || !totalPriceCts);
    }, [processing, setIsOnlinePaymentDisabled, totalPriceCts]);

    // Avoid to have the Elements component mounted before the clientSecret properly fetched, or the BACS Direct Debit
    // component mounted without the Element options set.
    React.useEffect(() => {
      if (isBacsDebitSelected && totalPriceCts) {
        setElementOptions({
          appearance: BACS_DEBIT_ELEMENT_APPEARANCE,
          mode: 'payment',
          currency: 'gbp',
          amount: totalPriceCts,
          paymentMethodTypes: ['bacs_debit'],
          setupFutureUsage: saveForLaterBacsDebit
            ? SAVE_FOR_LATER_OFF_SESSION
            : null,
          // TEMPORARY: The behaviour of PaymentElement for BACS DirectDebit payments needs to be tested in the Stripe live mode.
          // However since Stripe webhooks for processing BACS DD payments aren't fully operational, we don't want to allow the
          // BACS DD payments for real members
          ...(window.location.search.includes('debug=true')
            ? { onBehalfOf: stripeId }
            : {}),
        });
        setProcessing(false);
      } else if (clientSecret) {
        setProcessing(false);
      }
    }, [
      clientSecret,
      isBacsDebitSelected,
      totalPriceCts,
      saveForLaterBacsDebit,
      stripeId,
    ]);

    const enhancedSetPaymentProcessing = setPaymentProcessing
      ? (value: boolean) => {
          if (
            value &&
            !!updateMemberBillingGroup &&
            !!selectedEstablishmentBillingGroup
          ) {
            // Update the member's default establishment billing group when payment starts
            // being processed
            updateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
          }
          setPaymentProcessing(value);
        }
      : null;

    return (
      <div className={classes.container}>
        {!!priceUpdaterOpen && (
          <div className={classes.priceContainer}>
            <PriceInput
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPriceUpdateAmount(parseInt(e.target.value, 10));
              }}
              value={priceUpdateAmount}
            />
            <IconButton
              color="primary"
              onClick={() =>
                // @ts-expect-error
                updatePriceCts(parseInt(priceUpdateAmount * 100, 10) || 0, {
                  onSuccess: () => setPriceUpdaterOpen(false),
                })
              }
            >
              <SaveIcon />
            </IconButton>
          </div>
        )}
        {!priceUpdaterOpen && !!paymentGroupPriceCts && !hidePrice && (
          <div className={classes.priceContainer}>
            <Typography variant="h5">
              {`${getCurrencyDisplayWithPrice(
                (paymentGroupPriceCts / 100).toFixed(2),
              )}`}
            </Typography>
            {!!updatePriceCts && (
              <IconButton
                color="primary"
                onClick={() => {
                  setPriceUpdaterOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
        )}
        <>
          <PaymentMethodCardSelector
            paymentMethodChoices={paymentMethodChoices}
            paymentMethodSelected={paymentMethodSelected}
            paymentProcessing={paymentProcessing}
            selectPaymentMethod={handleSelectPaymentMethod}
          />
          {instalmentPaymentConfigurationList?.length > 0 &&
            !!onSelectInstalmentPayment && (
              <InstalmentPaymentSelector
                basketPriceCts={
                  basketTotalPriceCts - (basketTotalPricePrepaidLines || 0)
                }
                fromApp={fromApp}
                instalmentPaymentConfigurationList={
                  instalmentPaymentConfigurationList
                }
                instalmentPaymentConfigurationSelectedId={
                  instalmentPaymentSelectedId
                }
                onSelectInstalmentPayment={onSelectInstalmentPayment}
                paymentProcessing={paymentProcessing}
              />
            )}
        </>
        {processing || !totalPriceCts ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            <Elements
              options={elementOptions}
              stripe={stripePromise ?? fallbackStripePromise}
            >
              <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.addPaymentMethod">
                {(hasAddPaymentMethodPermission) => (
                  <StripePaymentMethodForm
                    ref={ref}
                    AcceptTermsAndConditionsComponent={
                      termsAndConditions ? (
                        <AcceptTermsAndConditions
                          accepted={termsAndConditionsAccepted}
                          onChecked={setTermsAndConditionsAccepted}
                          termsAndConditions={termsAndConditions}
                          type={TermsAndConditionType.TERMS_AND_CONDITIONS}
                        />
                      ) : null
                    }
                    allowConsumerToUseInternalAccount={
                      allowConsumerToUseInternalAccount &&
                      (useInternalAccount || applyBalanceToInvoice)
                    }
                    applyBalanceLoading={applyBalanceLoading}
                    applyBalanceToInvoice={applyBalanceToInvoice}
                    basketId={basketId}
                    basketTotalPriceCts={basketTotalPriceCts}
                    cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                    checkItemsBasket={checkItemsBasket}
                    clientSecret={clientSecret}
                    companyCountry={companyCountry}
                    companyId={companyId}
                    createPendingBookingsIfNecessary={
                      createPendingBookingsIfNecessary
                    }
                    creditAccountBalance={creditAccountBalance}
                    detachPaymentMethod={detachPaymentMethod}
                    detachPaymentMethodLoading={detachPaymentMethodLoading}
                    forceDisabled={priceUpdaterOpen}
                    forceHideButton={forceHideButton}
                    forceSave={!!instalmentPaymentSelectedId}
                    fromApp={fromApp}
                    hasAddPaymentMethodPermission={
                      hasAddPaymentMethodPermission
                    }
                    isEstablishmentBillingGroupSelected={
                      isEstablishmentBillingGroupSelected
                    }
                    loading={loading || applyBalanceLoading}
                    memberId={memberId}
                    onCancel={onCancel}
                    onError={onError}
                    onSuccess={onSuccess}
                    paymentGroupId={paymentGroupId}
                    saveForLaterBacsDebit={saveForLaterBacsDebit}
                    setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                    setPaymentProcessing={enhancedSetPaymentProcessing}
                    setSaveForLaterBacsDebit={setSaveForLaterBacsDebit}
                    snackbarErrorMsg={snackbarErrorMsg} // Unused as it does not exist in the child component
                    snackbarSuccessMsg={snackbarSuccessMsg} // Unused as it does not exist in the child component
                    termsAndConditionsAccepted={termsAndConditionsAccepted}
                    useInternalAccount={useInternalAccount}
                    userDefaultEmail={sepaDefaultEmail}
                    userDefaultName={sepaDefaultName}
                  >
                    <div className={classes.billingGroupSelector}>
                      {!!establishmentBillingGroups && (
                        <CheckoutBillingGroupSelector
                          enableMultiLocalization={enableMultiLocalization}
                          establishmentBillingGroups={
                            establishmentBillingGroups
                          }
                          selectedEstablishmentBillingGroup={
                            selectedEstablishmentBillingGroup
                          }
                          setIsEstablishmentBillingGroupSelected={
                            setIsEstablishmentBillingGroupSelected
                          }
                          setSelectedEstablishmentBillingGroup={
                            setSelectedEstablishmentBillingGroup
                          }
                        />
                      )}
                    </div>
                  </StripePaymentMethodForm>
                )}
              </ObjectLevelPermissionProvider>
            </Elements>
          </div>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingGroupSelector: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(PaymentStripe);
