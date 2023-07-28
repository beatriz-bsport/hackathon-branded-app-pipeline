import React, { forwardRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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

import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import PaymentStripeBacsDebit from './PaymentStripeBacsDebit.component';
import PaymentStripeCard from './PaymentStripeCard.component';
import PaymentStripeSEPA from './PaymentStripeSEPA.component';
import PaymentStripeBancontact from './PaymentStripeBancontact.component';
import PaymentStripeSofort from './PaymentStripeSofort.component';
import PaymentStripeIdeal from './PaymentStripeIdeal.component';
import PaymentStripeEPS from './PaymentStripeEPS.component';
import PaymentStripeGiropay from './PaymentStripeGiropay.component';
// @ts-expect-error
import PriceInput from '../../../../components/input/PriceInput.component';
import InstalmentPaymentSelector from '../../../instalment-payment-configuration/components/InstalmentPaymentSelector.component';

import PaymentMethodCardSelector from '../PaymentMethodCardSelector.component';
import AcceptTermsAndConditions from '../AcceptTermsAndConditions.component';

import {
  getStripePkKey,
  getCurrencyDisplayWithPrice,
  getCompanyCountry,
  getStripeRegion,
} from '../../../theme/selectors';
import type { OptionCallback } from '../../../../state/types';
import { InstalmentPayment } from '#libs/instalment-payment-configuration/types';
import {
  updateIntentToSavePaymentMethod as updateIntentToSavePaymentMethodAPI,
  updateIntentToSavePaymentMethodWebview as updateIntentToSavePaymentMethodWebviewAPI,
} from '#libs/payment/api';
import { TermsAndConditionType } from '#libs/payment/types';

const stripePromise = loadStripe(getStripePkKey());

const SAVE_FOR_LATER_OFF_SESSION = 'off_session';

type PaymentStripeProps = {
  loading: boolean;
  paymentMethodChoices: Array<number>;
  memberId: number;
  companyId: number;
  clientSecret: string;
  onCancel: () => void;
  onSuccess: (callback?: () => void) => void;
  onError?: () => void;
  paymentGroupPriceCts?: number;
  termsAndConditions?: string;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  termsAndConditionsAccepted: boolean;
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;

  sepaDefaultName?: string;
  sepaDefaultEmail?: string;

  basketId?: string;
  basketTotalPriceCts?: number;

  basketTotalPricePrepaidLines?: number;
  allowConsumerToUseInternalAccount?: boolean;
  useInternalAccount?: (amount: number) => void;
  applyBalanceToInvoice?: () => void;
  creditAccountBalance?: number | null;
  applyBalanceLoading?: boolean;

  instalmentPaymentConfigurationList: Array<InstalmentPayment> | null;
  instalmentPaymentSelectedId: number;
  onSelectInstalmentPayment: (id: number, options: OptionCallback) => void;
  checkItemsBasket: (basketId: string) => boolean;
  paymentProcessing?: boolean;
  setPaymentProcessing?: (process: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;

  fromApp?: boolean;
  paymentGroupId: number;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  ref?: React.Ref<any>;
  stripeId: string | null;
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
      loading,
      paymentMethodChoices,
      memberId,
      companyId,
      clientSecret,
      onCancel,
      onSuccess,
      onError,
      paymentGroupPriceCts,
      termsAndConditions,
      setTermsAndConditionsAccepted,
      termsAndConditionsAccepted,
      updatePriceCts,
      detachPaymentMethodLoading,
      detachPaymentMethod,
      snackbarErrorMsg,
      snackbarSuccessMsg,

      sepaDefaultName,
      sepaDefaultEmail,

      basketId,
      basketTotalPriceCts,

      basketTotalPricePrepaidLines,
      allowConsumerToUseInternalAccount,
      useInternalAccount,
      applyBalanceToInvoice,
      creditAccountBalance,
      applyBalanceLoading,

      instalmentPaymentConfigurationList,
      instalmentPaymentSelectedId,
      onSelectInstalmentPayment,
      checkItemsBasket,
      paymentProcessing,
      setPaymentProcessing,
      createPendingBookingsIfNecessary,

      fromApp,
      paymentGroupId,
      setIsOnlinePaymentDisabled,
      stripeId,
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

    // This useEffect is mandatory in thenew checkout flow, since if this condition is not
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

    return (
      <div className={classes.container}>
        {!!priceUpdaterOpen && (
          <div className={classes.priceContainer}>
            <PriceInput
              value={priceUpdateAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPriceUpdateAmount(parseInt(e.target.value, 10));
              }}
            />
            <IconButton
              color="primary"
              onClick={() =>
                // @ts-expect-error
                updatePriceCts(parseInt(priceUpdateAmount * 100, 10), {
                  onSuccess: () => setPriceUpdaterOpen(false),
                })
              }
            >
              <SaveIcon />
            </IconButton>
          </div>
        )}
        {!priceUpdaterOpen && !!paymentGroupPriceCts && (
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
            selectPaymentMethod={handleSelectPaymentMethod}
            paymentMethodSelected={paymentMethodSelected}
            paymentMethodChoices={paymentMethodChoices}
            paymentProcessing={paymentProcessing}
          />
          <InstalmentPaymentSelector
            instalmentPaymentConfigurationSelectedId={
              instalmentPaymentSelectedId
            }
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            paymentProcessing={paymentProcessing}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            basketPriceCts={
              basketTotalPriceCts - (basketTotalPricePrepaidLines || 0)
            }
            fromApp={fromApp}
          />
        </>
        {processing || !totalPriceCts ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            <Elements stripe={stripePromise} options={elementOptions}>
              <StripePaymentMethodForm
                onSuccess={onSuccess}
                onError={onError}
                clientSecret={clientSecret}
                forceDisabled={priceUpdaterOpen}
                fromApp={fromApp}
                basketTotalPriceCts={basketTotalPriceCts}
                basketId={basketId}
                forceSave={!!instalmentPaymentSelectedId}
                onCancel={onCancel}
                loading={loading || applyBalanceLoading}
                memberId={memberId}
                detachPaymentMethodLoading={detachPaymentMethodLoading}
                detachPaymentMethod={detachPaymentMethod}
                snackbarErrorMsg={snackbarErrorMsg}
                snackbarSuccessMsg={snackbarSuccessMsg}
                companyId={companyId}
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
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                userDefaultName={sepaDefaultName}
                userDefaultEmail={sepaDefaultEmail}
                allowConsumerToUseInternalAccount={
                  allowConsumerToUseInternalAccount &&
                  (useInternalAccount || applyBalanceToInvoice)
                }
                useInternalAccount={useInternalAccount}
                applyBalanceToInvoice={applyBalanceToInvoice}
                creditAccountBalance={creditAccountBalance}
                applyBalanceLoading={applyBalanceLoading}
                checkItemsBasket={checkItemsBasket}
                setPaymentProcessing={setPaymentProcessing}
                paymentGroupId={paymentGroupId}
                saveForLaterBacsDebit={saveForLaterBacsDebit}
                setSaveForLaterBacsDebit={setSaveForLaterBacsDebit}
                createPendingBookingsIfNecessary={
                  createPendingBookingsIfNecessary
                }
                setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                ref={ref}
              />
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
}));

export default PaymentStripe;
