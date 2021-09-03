// @flow

import React from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import { verifyPriceBasket as verifyPriceBasketAPI } from '../../api';

export function PaymentStripeBancontact(props: {
  onCancel: () => void,
  clientSecret: string,
  termsAndConditionsAccepted: boolean,
  AcceptTermsAndConditionsComponent: React.Component,
  forceDisabled?: boolean,
  userDefaultName?: string,
  userDefaultEmail?: string,
  loading?: boolean,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = React.useState(false);
  const [name, setName] = React.useState(props.userDefaultName || '');
  const [email, setEmail] = React.useState(props.userDefaultEmail || '');
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  const [saveForLater, setSaveForLater] = React.useState(false);

  // const setSaveForLater = () => {};

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    if (props.basketId) {
      const { data } = await verifyPriceBasketAPI(props.basketId);

      if (
        (!!props.basketTotalPriceCts || props.basketTotalPriceCts === 0) &&
        props.basketTotalPriceCts !== data
      ) {
        setProcessing(false);
        window.alert(t('paymentPanel.actions.basketInconsistent'));
        window.location.reload();
        return;
      }
    }

    // For brevity, this example is using uncontrolled components for
    // the accountholder's name. In a real world app you will
    // probably want to use controlled components.
    // https://reactjs.org/docs/uncontrolled-components.html
    // https://reactjs.org/docs/forms.html#controlled-components

    const { error } = await stripe.confirmBancontactPayment(
      props.clientSecret,
      {
        payment_method: {
          billing_details: {
            name,
            email,
          },
        },
        ...(saveForLater ? { setup_future_usage: 'off_session' } : {}),
        return_url: `${window.location.href}?check_payment_intent=true`,
      },
    );

    if (error) {
      // Show error to your customer.
      setErrorMessage(error.message);
      setProcessing(false);
    }

    // Otherwise the customer will be redirected away from your
    // page to complete the payment with their bank.
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.fieldContainer}>
        <TextInput
          value={name}
          label={t('paymentPanel.fields.accountHolderName.label')}
          placeholder={t('paymentPanel.fields.accountHolderName.placeholder')}
          required
          onChange={(ev) => setName(ev.target.value)}
          className={classes.field}
          disabled={!stripe || !props.clientSecret || processing}
        />
        <TextInput
          value={email}
          label={t('paymentPanel.fields.email.label')}
          placeholder={t('paymentPanel.fields.email.placeholder')}
          required
          onChange={(ev) => setEmail(ev.target.value)}
          className={classes.field}
          disabled={!stripe || !props.clientSecret || processing}
        />
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>
      <div className={classes.row}>
        <Checkbox
          checked={saveForLater}
          disabled={!stripe || !props.clientSecret || processing}
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
      <div className={classes.conditions}>
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
              props.loading ||
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
}

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
  },
  row: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  conditions: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
}));
export default PaymentStripeBancontact;
