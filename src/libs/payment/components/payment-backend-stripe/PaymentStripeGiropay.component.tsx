// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStripe, useElements } from '@stripe/react-stripe-js';

import Button from '@material-ui/core/Button';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY } from '@bsport/common/lib/master-data/payment-group';

import {
  verifyPriceBasket as verifyPriceBasketAPI,
  blockPendingBasket as blockPendingBasketAPI,
} from '../../api';

type PaymentStripeGiropayProps = {
  clientSecret: string;
  onCancel: () => void;
  forceDisabled?: boolean;
  userDefaultName?: string;
  basketId?: string;
  basketTotalPriceCts?: number;
  checkItemsBasket: (basketId: string) => boolean;
  setPaymentProcessing: (processing: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
};

export const PaymentStripeGiropay = ({
  clientSecret,
  onCancel,
  forceDisabled,
  userDefaultName,
  basketId,
  basketTotalPriceCts,
  checkItemsBasket,
  setPaymentProcessing,
  createPendingBookingsIfNecessary,
}: PaymentStripeGiropayProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = React.useState(false);
  const [name, setName] = React.useState(userDefaultName || '');
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  const setPaymentPageProcessing = React.useCallback(
    (process) => {
      if (setPaymentProcessing) setPaymentProcessing(process);
      setProcessing(process);
    },
    [setPaymentProcessing],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }
    setPaymentPageProcessing(true);
    setErrorMessage(null);

    if (basketId) {
      const { data } = await verifyPriceBasketAPI(basketId);

      const basketItemsChecked = await checkItemsBasket(basketId);
      if (!basketItemsChecked) {
        setPaymentPageProcessing(false);
        return;
      }

      if (
        (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
        basketTotalPriceCts !== data
      ) {
        setPaymentPageProcessing(false);
        // eslint-disable-next-line
        window.alert(t('paymentPanel.actions.basketInconsistent'));
        window.location.reload();
        return;
      }
    }

    const { error } = await stripe.confirmGiropayPayment(clientSecret, {
      payment_method: {
        billing_details: {
          name,
        },
      },
      return_url: window.location.href,
    });

    if (error) {
      // Inform the customer that there was an error.
      setErrorMessage(error.message);
      setPaymentPageProcessing(false);
    } else {
      if (basketId) {
        try {
          await blockPendingBasketAPI(basketId);
        } catch (err) {
          console.error(err);
        }
      }
      if (createPendingBookingsIfNecessary) {
        createPendingBookingsIfNecessary({
          payment_group_method_identifier:
            PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
        });
      }
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
            disabled={forceDisabled || !stripe}
          >
            {t('paymentPanel.actions.confirmPayment')}
          </Button>
        )}
        <Button onClick={onCancel} disabled={processing}>
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

export default PaymentStripeGiropay;
