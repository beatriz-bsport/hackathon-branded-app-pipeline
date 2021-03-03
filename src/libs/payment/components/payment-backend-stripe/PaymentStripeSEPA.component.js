// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Use the CSS tab above to style your Element's container.
 */
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import Checkbox from '@material-ui/core/Checkbox';
import StripeErrorCode from './StripeErrorCode.component';

import PaymentMethodList from '../PaymentMethodList.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAPI } from '../../api';

// Custom styling can be passed as options when creating an Element.
const IBAN_STYLE = {
  base: {
    color: '#32325d',
    fontSize: '16px',
    ':-webkit-autofill': {
      color: '#32325d',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
    ':-webkit-autofill': {
      color: '#fa755a',
    },
  },
};

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  // Elements can use a placeholder as an example IBAN that reflects
  // the IBAN format of your customer's country. If you know your
  // customer's country, we recommend that you pass it to the Element as the
  // placeholderCountry.
  placeholderCountry: 'FR',
  style: IBAN_STYLE,
};

type PropsIban = {
  disabled: boolean,
  processing: boolean,
  isActive: boolean,
  error: ?Error,
  billingDetails: { name: string, email: string },
  setBillingDetails: ({ name: string, email: string }) => void,
};

const IbanForm = (props: PropsIban) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const { billingDetails, setBillingDetails, processing } = props;
  return (
    <div>
      <div className={classes.nameAndEmailContainer}>
        <TextField
          required={props.isActive}
          fullWidth
          value={billingDetails.name}
          variant="outlined"
          placeholder={t('mandate.name')}
          disabled={props.disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
        />
        <TextField
          type="email"
          required={props.isActive}
          fullWidth
          variant="outlined"
          value={billingDetails.email}
          placeholder={t('mandate.email')}
          disabled={props.disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              email: value,
            });
          }}
        />
      </div>
      <div style={processing ? { display: 'none' } : {}}>
        <div className={classes.sensitiveDataContainer}>
          <div className={classes.sensitiveData}>
            <IbanElement options={IBAN_ELEMENT_OPTIONS} />
            {!!props.error && (
              <StripeErrorCode
                errorCode={props.error.error_code}
                declineCode={props.error.decline_code}
              />
            )}
          </div>
        </div>
      </div>
      <div className={classes.mandate}>
        <Typography color="textSecondary" variant="caption">
          {t('mandate.content')}
        </Typography>
      </div>
    </div>
  );
};

type Props = {
  onError: (Error) => void,
  onSuccess: () => void,
  memberId: number,
  clientSecret: string,
  onCancel: () => void,
  termsAndConditionsAccepted: boolean,
  AcceptTermsAndConditionsComponent: React.Component,
};

export const PaymentStripeSEPA = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const [saveForLater, setSaveForLater] = React.useState(false);
  const [paymentMethodList, setPaymentMethodList] = React.useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] = React.useState(
    null,
  );

  React.useEffect(() => {
    fetchPaymentMethodListAPI({ member: props.memberId }).then((r) =>
      setPaymentMethodList(r.data.filter((pm) => pm.type === 'sepa_debit')),
    );
  }, [props.clientSecret]);

  const [billingDetails, setBillingDetails] = React.useState({
    name: '',
    email: '',
  });

  const handleSubmit = async (event) => {
    setProcessing(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }

    const iban = elements.getElement(IbanElement);

    const result = await stripe.confirmSepaDebitPayment(props.clientSecret, {
      payment_method: paymentMethodSelected || {
        sepa_debit: iban,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
        },
      },
      ...(saveForLater ? { setup_future_usage: 'off_session' } : {}),
    });

    if (result.error) {
      // Show error to your customer.
      setError(result.error);
      setProcessing(false);
      if (props.onError) props.onError();
    } else {
      setError(null);
      props.onSuccess(() => setProcessing(false));
      // Show a confirmation message to your customer.
      // The PaymentIntent is in the 'processing' state.
      // SEPA Direct Debit payments are asynchronous,
      // so funds are not immediately available.
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <IbanForm
        setBillingDetails={setBillingDetails}
        billingDetails={billingDetails}
        error={error}
        disabled={!stripe || !props.clientSecret}
        processing={processing}
        isActive={!paymentMethodSelected}
      />
      <div className={classes.row}>
        <Checkbox
          checked={saveForLater}
          onChange={(ev) => setSaveForLater(ev.target.checked)}
        />
        <Typography variant="caption">
          {t('paymentPanel.actions.saveForLater')}
        </Typography>
      </div>
      {!!paymentMethodList.length && (
        <PaymentMethodList
          savedPaymentMethodList={paymentMethodList}
          selectedSavedPaymentMethodId={paymentMethodSelected}
          isExpandable={false}
          paymentMethodType="sepa_debit"
          onSelect={setPaymentMethodSelected}
        />
      )}
      <div className={classes.actionRow}>
        {props.AcceptTermsAndConditionsComponent}
      </div>
      <div className={classes.actionRow}>
        {processing ? (
          <CircularProgress />
        ) : (
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!stripe || !props.termsAndConditionsAccepted}
            >
              {t('invoice:paymentPanel.actions.confirmPayment')}
            </Button>
            <Button disabled={processing} onClick={props.onCancel}>
              {t('paymentPanel.actions.cancel')}
            </Button>
          </React.Fragment>
        )}
      </div>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  sensitiveDataContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    maxWidth: '80vw',
    width: '100%',
  },
  nameAndEmailContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  mandate: {
    padding: theme.spacing(2),
    maxWidth: 700,
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'alignItems',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
}));

export default PaymentStripeSEPA;
