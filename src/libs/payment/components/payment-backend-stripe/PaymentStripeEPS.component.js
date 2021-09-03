// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStripe, useElements } from '@stripe/react-stripe-js';

import Button from '@material-ui/core/Button';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { verifyPriceBasket as verifyPriceBasketAPI } from '../../api';

export const PaymentStripeEPS = (props: {
  clientSecret: string,
  onCancel: () => void,
  forceDisabled?: boolean,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = React.useState(false);
  const [name, setName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

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

    const { error } = await stripe.confirmEpsPayment(props.clientSecret, {
      payment_method: {
        billing_details: {
          name,
        },
      },
      return_url: `${window.location.href}?check_payment_intent=true`,
    });

    if (error) {
      // Inform the customer that there was an error.
      setErrorMessage(error.message);
      setProcessing(false);
    }
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
        />
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>
      <div className={classes.actionRow}>
        {processing ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={props.forceDisabled || !stripe}
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
    marginTop: theme.spacing(1),
  },
}));

export default PaymentStripeEPS;
