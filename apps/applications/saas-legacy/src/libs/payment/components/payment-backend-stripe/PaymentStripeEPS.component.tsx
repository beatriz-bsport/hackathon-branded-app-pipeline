import React, { useImperativeHandle, forwardRef } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { saveQueryParamInLocalStorage } from '#src/libs/utils';
import {
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
} from '#src/libs/payment/constants';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_EPS } from '@bsport/common/lib/master-data/payment-group.js';
import {
  blockPendingBasket as blockPendingBasketAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';

type PaymentStripeEPSProps = {
  basketId?: string;
  basketTotalPriceCts?: number;
  children?: React.ReactNode;
  clientSecret: string;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  onCancel: () => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing: (processing: boolean) => void;
};

export const PaymentStripeEPS = forwardRef(
  (
    {
      basketId,
      basketTotalPriceCts,
      children,
      clientSecret,
      forceDisabled,
      forceHideConfirmPaymentButton,
      hasAddPaymentMethodPermission = true,
      isEstablishmentBillingGroupSelected,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      onCancel,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
    }: PaymentStripeEPSProps,
    ref,
  ) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = React.useState(false);
    const [name, setName] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState(null);

    const { t } = useTranslation('invoice');
    const classes = useStyles();

    const setPaymentPageProcessing = React.useCallback(
      (process) => {
        if (setPaymentProcessing) setPaymentProcessing(process);
        setProcessing(process);
      },
      [setPaymentProcessing],
    );

    const isSubmitButtonDisabled =
      forceDisabled || !stripe || !isEstablishmentBillingGroupSelected;

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
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

            window.alert(t('paymentPanel.actions.basketInconsistent'));
            window.location.reload();
            return;
          }
        }

        saveQueryParamInLocalStorage(
          USER_REGISTRATION_RESPONSE_QUERY_PARAM,
          USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
        );

        const url = new URL(window.location.toString());
        const params = url.searchParams;
        params.delete('user_registration_response');
        params.set('check_payment_intent', 'true');
        params.set('get_user_registration_from_storage', 'true');

        if (basketId) {
          // Include the current basket id in the return URL, so that the basket page keeps track
          // of it after the redirection
          params.set('basket_redirection', basketId);
        }

        const return_url = url.toString();

        // For brevity, this example is using uncontrolled components for
        // the accountholder's name. In a real world app you will
        // probably want to use controlled components.
        // https://reactjs.org/docs/uncontrolled-components.html
        // https://reactjs.org/docs/forms.html#controlled-components

        const { error } = await stripe.confirmEpsPayment(clientSecret, {
          // @ts-expect-error
          payment_method: {
            billing_details: {
              name,
            },
          },
          return_url,
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
                PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
            });
          }
        }
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        elements,
        name,
        setPaymentPageProcessing,
        stripe,
        t,
      ],
    );

    // This hook is required in the new checkout flow, in order to call the submit callback defined
    // in the payment method component from the parent component.
    useImperativeHandle(
      ref,
      () => {
        return {
          onPaymentConfirm: handleSubmit,
        };
      },
      [handleSubmit],
    );

    return (
      <form onSubmit={handleSubmit}>
        {!hasAddPaymentMethodPermission ? (
          <Typography>
            {t('payment:forms.paymentMethod.actions.addPaymentMethodDenied')}
          </Typography>
        ) : (
          <div className={classes.fieldContainer}>
            <TextInput
              required
              className={classes.field}
              label={t('paymentPanel.fields.accountHolderName.label')}
              onChange={(ev) => setName(ev.target.value)}
              placeholder={t(
                'paymentPanel.fields.accountHolderName.placeholder',
              )}
              value={name}
            />
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </div>
        )}
        {children}
        {!forceHideConfirmPaymentButton && (
          <div className={classes.actionRow}>
            {processing ? (
              <CircularProgress />
            ) : (
              <Button
                color="primary"
                disabled={
                  forceDisabled || !stripe || !hasAddPaymentMethodPermission
                }
                type="submit"
                variant="contained"
              >
                {t('paymentPanel.actions.confirmPayment')}
              </Button>
            )}
            <Button disabled={processing} onClick={onCancel}>
              {t('paymentPanel.actions.cancel')}
            </Button>
          </div>
        )}
      </form>
    );
  },
);

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
