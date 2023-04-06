// @flow
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
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
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
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
import PaymentStripeMobilePay from './PaymentStripeMobilePay.component';
import PriceInput from '../../../../components/input/PriceInput.component';
import InstalmentPaymentSelector from '../../../instalment-payment-configuration/components/InstalmentPaymentSelector.component';

import PaymentMethodCardSelector from '../PaymentMethodCardSelector.component';
import AcceptTermsAndConditions from '../AcceptTermsAndConditions.component';

import {
  getStripePkKey,
  getCurrencyDisplayWithPrice,
} from '../../../theme/selectors';
import type { OptionCallback } from '../../../../state/types';
import { InstalmentPayment } from '#libs/instalment-payment-configuration/types';
import { updateIntentToSavePaymentMethod as updateIntentToSavePaymentMethodAPI } from '#libs/payment/api';

const stripePromise = loadStripe(getStripePkKey());

const SAVE_FOR_LATER_OFF_SESSION = 'off_session';

type Props = {
  loading: boolean;
  paymentMethodSelected: number;
  selectPaymentMethod: (paymentMethod: number) => void;
  paymentMethodChoices: Array<number>;
  memberId: number;
  companyId: number;
  clientSecret: string;
  onCancel: () => void;
  onSuccess: (callback?: () => void) => void;
  onError: () => void;
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

  fromApp: boolean;
  paymentGroupId: number;
};

const STRIPE_PAYMENT_METHOD_FORM_COMPONENT: { [key: number]: any } = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: PaymentStripeCard,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: PaymentStripeSEPA,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: PaymentStripeBancontact,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: PaymentStripeIdeal,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: PaymentStripeSofort,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: PaymentStripeEPS,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: PaymentStripeGiropay,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: PaymentStripeMobilePay,
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

export const PaymentStripe = (props: Props) => {
  const classes = useStyles();

  const isBacsDebitSelected =
    props.paymentMethodSelected === PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT;

  const StripePaymentMethodForm =
    STRIPE_PAYMENT_METHOD_FORM_COMPONENT[props.paymentMethodSelected];

  const [processing, setProcessing] = React.useState(true);
  const [elementOptions, setElementOptions] = React.useState({});
  const [saveForLaterBacsDebit, setSaveForLaterBacsDebit] =
    React.useState<boolean>(false);
  const [priceUpdaterOpen, setPriceUpdaterOpen] = React.useState(false);
  const [priceUpdateAmount, setPriceUpdateAmount] = React.useState(
    props.paymentGroupPriceCts / 100,
  );

  const totalPriceCts = props.basketTotalPriceCts || props.paymentGroupPriceCts;

  const handleSelectPaymentMethod = async (paymentMethod: number) => {
    setProcessing(true);
    if (paymentMethod !== PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT) {
      setElementOptions({});
      try {
        await updateIntentToSavePaymentMethodAPI({
          save_for_later: false,
          payment_group_id: props.paymentGroupId,
        });
        setSaveForLaterBacsDebit(false);
      } catch (err) {
        console.error(err);
      }
    }
    props.selectPaymentMethod(paymentMethod);
  };

  // Avoid to have the Elements component mounted before the clientSecret properly fetched, or the BACS Direct Debit
  // component mounted without the Element options set.
  useEffect(() => {
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
      });
      setProcessing(false);
    } else if (props.clientSecret) {
      setProcessing(false);
    }
  }, [
    props.clientSecret,
    isBacsDebitSelected,
    totalPriceCts,
    saveForLaterBacsDebit,
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
              props.updatePriceCts(parseInt(priceUpdateAmount * 100, 10), {
                onSuccess: () => setPriceUpdaterOpen(false),
              })
            }
          >
            <SaveIcon />
          </IconButton>
        </div>
      )}
      {!priceUpdaterOpen && !!props.paymentGroupPriceCts && (
        <div className={classes.priceContainer}>
          <Typography variant="h5">
            {`${getCurrencyDisplayWithPrice(
              (props.paymentGroupPriceCts / 100).toFixed(2),
            )}`}
          </Typography>
          {!!props.updatePriceCts && (
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
          paymentMethodSelected={props.paymentMethodSelected}
          paymentMethodChoices={props.paymentMethodChoices}
        />
        <InstalmentPaymentSelector
          instalmentPaymentConfigurationSelectedId={
            props.instalmentPaymentSelectedId
          }
          instalmentPaymentConfigurationList={
            props.instalmentPaymentConfigurationList
          }
          onSelectInstalmentPayment={props.onSelectInstalmentPayment}
          basketPriceCts={
            props.basketTotalPriceCts -
            (props.basketTotalPricePrepaidLines || 0)
          }
          fromApp={props.fromApp}
        />
      </>
      {processing || !totalPriceCts ? (
        <CircularProgress />
      ) : (
        <div className={classes.innerContainer}>
          <Elements stripe={stripePromise} options={elementOptions}>
            <StripePaymentMethodForm
              onSuccess={props.onSuccess}
              onError={props.onError}
              clientSecret={props.clientSecret}
              forceDisabled={priceUpdaterOpen}
              basketTotalPriceCts={props.basketTotalPriceCts}
              basketId={props.basketId}
              forceSave={!!props.instalmentPaymentSelectedId}
              onCancel={props.onCancel}
              loading={props.loading || props.applyBalanceLoading}
              memberId={props.memberId}
              detachPaymentMethodLoading={props.detachPaymentMethodLoading}
              detachPaymentMethod={props.detachPaymentMethod}
              snackbarErrorMsg={props.snackbarErrorMsg}
              snackbarSuccessMsg={props.snackbarSuccessMsg}
              companyId={props.companyId}
              AcceptTermsAndConditionsComponent={
                props.termsAndConditions ? (
                  <AcceptTermsAndConditions
                    accepted={props.termsAndConditionsAccepted}
                    onChecked={props.setTermsAndConditionsAccepted}
                    termsAndConditions={props.termsAndConditions}
                    type="theTermsAndConditions"
                  />
                ) : null
              }
              termsAndConditionsAccepted={props.termsAndConditionsAccepted}
              userDefaultName={props.sepaDefaultName}
              userDefaultEmail={props.sepaDefaultEmail}
              allowConsumerToUseInternalAccount={
                props.allowConsumerToUseInternalAccount &&
                (props.useInternalAccount || props.applyBalanceToInvoice)
              }
              useInternalAccount={props.useInternalAccount}
              applyBalanceToInvoice={props.applyBalanceToInvoice}
              creditAccountBalance={props.creditAccountBalance}
              applyBalanceLoading={props.applyBalanceLoading}
              checkItemsBasket={props.checkItemsBasket}
              paymentGroupId={props.paymentGroupId}
              saveForLaterBacsDebit={saveForLaterBacsDebit}
              setSaveForLaterBacsDebit={setSaveForLaterBacsDebit}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

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

export default compose(
  withState(
    'paymentMethodSelected',
    'selectPaymentMethod',
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  ),
)(PaymentStripe);
