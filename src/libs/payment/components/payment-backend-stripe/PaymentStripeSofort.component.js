// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import Checkbox from '@material-ui/core/Checkbox';
import CountrySelector from '../../../../components/input/CountrySelector.component';

type Props = {
  clientSecret: ?string,
  onCancel: () => void,
  termsAndConditionsAccepted: boolean,
  AcceptTermsAndConditionsComponent: React.Component,
  forceDisabled?: boolean,
};

export const PaymentStripeSofort = (props: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = React.useState(false);
  const [country, setCountry] = React.useState('DE');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const [saveForLater, setSaveForLater] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setProcessing(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      return;
    }

    const { error } = await stripe.confirmSofortPayment(props.clientSecret, {
      payment_method: {
        sofort: {
          country,
        },
        billing_details: {
          name,
          email,
        },
      },
      ...(saveForLater ? { setup_future_usage: 'off_session' } : {}),
      return_url: `${window.location.href}?check_payment_intent=true`,
    });

    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.fieldContainer}>
        <CountrySelector
          value={country}
          label={t('paymentPanel.fields.country.label')}
          onChange={(ev) => {
            setCountry(ev.target.value);
          }}
        />
        <TextInput
          value={name}
          label={t('paymentPanel.fields.accountHolderName.label')}
          placeholder={t('paymentPanel.fields.accountHolderName.placeholder')}
          required
          onChange={(ev) => setName(ev.target.value)}
          className={classes.field}
        />
        <TextInput
          value={email}
          label={t('paymentPanel.fields.email.label')}
          placeholder={t('paymentPanel.fields.email.placeholder')}
          required
          onChange={(ev) => setEmail(ev.target.value)}
          className={classes.field}
        />
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <div className={classes.row}>
          <Checkbox
            checked={saveForLater}
            onChange={(ev) => setSaveForLater(ev.target.checked)}
          />
          <div className={classes.leftColumn}>
            <Typography variant="caption">
              {t('paymentPanel.actions.saveForLater')}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {t('paymentPanel.actions.saveForLaterAsSEPA')}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.actionRow}>
        {props.AcceptTermsAndConditionsComponent}
      </div>
      <div className={classes.actionRow}>
        {processing ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={
              props.forceDisabled ||
              !stripe ||
              !props.termsAndConditionsAccepted
            }
          >
            {t('paymentPanel.actions.confirmPayment')}
          </Button>
        )}
        <Button onClick={props.onCancel} disabled={processing}>
          {t('paymentPanel.actions.cancel')}
        </Button>
      </div>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(1),
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  row: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
}));
export default PaymentStripeSofort;
