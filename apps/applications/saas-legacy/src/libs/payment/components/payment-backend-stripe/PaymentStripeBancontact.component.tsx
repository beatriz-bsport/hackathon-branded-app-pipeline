import React, { useImperativeHandle, forwardRef } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Info from '@material-ui/icons/Info';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { saveQueryParamInLocalStorage } from '#src/libs/utils';
import {
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
} from '#src/libs/payment/constants';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT } from '@bsport/common/lib/master-data/payment-group.js';

import {
  verifyPriceBasket as verifyPriceBasketAPI,
  blockPendingBasket as blockPendingBasketAPI,
} from '#src/libs/payment/api';
import PopOver from '#src/components/Popover';

type PaymentStripeBanContactProps = {
  basketId?: string;
  basketTotalPriceCts?: number;
  children?: React.ReactNode;
  clientSecret: string;
  forceDisabled?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  termsAndConditionsAccepted: boolean;
  userDefaultEmail?: string;
  userDefaultName?: string;
  checkItemsBasket: (basketId: string) => boolean;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled: (isLoading: boolean) => void;
  setPaymentProcessing: (processing: boolean) => void;
};

export const PaymentStripeBancontact = forwardRef(
  (
    {
      basketId,
      basketTotalPriceCts,
      children,
      clientSecret,
      forceDisabled,
      forceSave,
      hasAddPaymentMethodPermission = true,
      isEstablishmentBillingGroupSelected,
      loading,
      termsAndConditionsAccepted,
      userDefaultEmail,
      userDefaultName,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
    }: PaymentStripeBanContactProps,
    ref,
  ) => {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = React.useState(false);
    const [name, setName] = React.useState(userDefaultName || '');
    const [email, setEmail] = React.useState(userDefaultEmail || '');
    const [errorMessage, setErrorMessage] = React.useState(null);

    const { t } = useTranslation(['invoice']);
    const classes = useStyles();

    const [saveForLater, setSaveForLater] = React.useState(false);

    const setPaymentPageProcessing = React.useCallback(
      (process) => {
        if (setPaymentProcessing) setPaymentProcessing(process);
        setProcessing(process);
      },
      [setPaymentProcessing],
    );

    const isSubmitButtonDisabled =
      loading ||
      forceDisabled ||
      !stripe ||
      !termsAndConditionsAccepted ||
      !isEstablishmentBillingGroupSelected ||
      !hasAddPaymentMethodPermission;

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

        // For brevity, this example is using uncontrolled components for
        // the accountholder's name. In a real world app you will
        // probably want to use controlled components.
        // https://reactjs.org/docs/uncontrolled-components.html
        // https://reactjs.org/docs/forms.html#controlled-components

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

        const { error } = await stripe.confirmBancontactPayment(clientSecret, {
          payment_method: {
            billing_details: {
              name,
              email,
            },
          },
          ...(saveForLater || forceSave
            ? { setup_future_usage: 'off_session' }
            : {}),
          return_url,
        });

        if (error) {
          // Show error to your customer.
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
                PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
            });
          }
        }

        // Otherwise the customer will be redirected away from your
        // page to complete the payment with their bank.
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        elements,
        email,
        forceSave,
        name,
        saveForLater,
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
          <>
            <div className={classes.fieldContainer}>
              <TextInput
                required
                className={classes.field}
                disabled={!stripe || !clientSecret || processing}
                label={t('paymentPanel.fields.accountHolderName.label')}
                onChange={(ev) => setName(ev.target.value)}
                placeholder={t(
                  'paymentPanel.fields.accountHolderName.placeholder',
                )}
                value={name}
              />
              <TextInput
                required
                className={classes.field}
                disabled={!stripe || !clientSecret || processing}
                label={t('paymentPanel.fields.email.label')}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder={t('paymentPanel.fields.email.placeholder')}
                value={email}
              />
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
            </div>
            <div className={classes.row}>
              <Checkbox
                checked={saveForLater || forceSave}
                color="primary"
                disabled={!stripe || !clientSecret || processing || forceSave}
                onChange={(ev) => setSaveForLater(ev.target.checked)}
              />
              <div className={classes.leftColumn}>
                <Typography variant="body1">
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {t('paymentPanel.actions.saveForLaterAsSEPA')}
                </Typography>
              </div>
              <div className={classes.securityInformationContainer}>
                <PopOver
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  className={classes.securityInformationText}
                  title={t('paymentPanel.actions.paymentSecurityInformation')}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Info className={classes.infoIcon} />
                </PopOver>
              </div>
            </div>
          </>
        )}
        {children}
      </form>
    );
  },
);

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
  securityInformationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.spacing(1),
    },
  },
  securityInformationText: {
    maxWidth: '250px',
    variant: 'tooltip',
    fontWeight: 500,
    fontSize: '10px',
    lineHeight: '14px',
  },
  infoIcon: { color: theme.palette.grey[600] },
}));
export default PaymentStripeBancontact;
