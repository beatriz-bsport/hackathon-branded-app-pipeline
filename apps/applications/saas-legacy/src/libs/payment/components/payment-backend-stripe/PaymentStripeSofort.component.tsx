import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Info from '@material-ui/icons/Info';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT } from '@bsport/common/lib/master-data/payment-group';
import { saveQueryParamInLocalStorage } from '#src/libs/utils';
import {
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
} from '#src/libs/payment/constants';

import {
  blockPendingBasket as blockPendingBasketAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import { CheckoutContext } from '#src/pages/checkout/basket/CheckoutContext';
import CountrySelector from '#src/components/input/CountrySelector.component';
import PopOver from '#src/components/Popover';

type PaymentStripeSofortProps = {
  AcceptTermsAndConditionsComponent: React.Component;
  basketId?: string;
  basketTotalPriceCts?: number;
  children?: React.ReactNode;
  clientSecret?: string;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  termsAndConditionsAccepted: boolean;
  userDefaultEmail?: string;
  userDefaultName?: string;
  onCancel: () => void;
  checkItemsBasket: (basketId: string) => boolean;
  setPaymentProcessing: (processing: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled: (isLoading: boolean) => void;
};

export const PaymentStripeSofort = forwardRef(
  (
    {
      AcceptTermsAndConditionsComponent,
      basketId,
      basketTotalPriceCts,
      children,
      clientSecret,
      forceDisabled,
      forceHideConfirmPaymentButton,
      forceSave,
      hasAddPaymentMethodPermission = true,
      isEstablishmentBillingGroupSelected,
      loading,
      termsAndConditionsAccepted,
      userDefaultEmail,
      userDefaultName,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      onCancel,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
    }: PaymentStripeSofortProps,
    ref,
  ) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = React.useState(false);
    const [country, setCountry] = React.useState('DE');
    const [name, setName] = React.useState(userDefaultName);
    const [email, setEmail] = React.useState(userDefaultEmail);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const { t } = useTranslation(['invoice']);
    const classes = useStyles();
    const [saveForLater, setSaveForLater] = React.useState(false);

    const isNewCheckoutFlow = React.useContext(CheckoutContext);

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
      !isEstablishmentBillingGroupSelected;

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
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

        const { error } = await stripe.confirmSofortPayment(clientSecret, {
          payment_method: {
            sofort: {
              country,
            },
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
                PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
            });
          }
        }
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        country,
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
              <CountrySelector
                label={t('paymentPanel.fields.country.label')}
                onChange={(
                  ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => {
                  setCountry(ev.target.value);
                }}
                value={country}
              />
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
              <TextInput
                required
                className={classes.field}
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
                disabled={!!forceSave}
                onChange={(ev) => setSaveForLater(ev.target.checked)}
              />
              <div className={classes.leftColumn}>
                <Typography variant={isNewCheckoutFlow ? 'body1' : 'caption'}>
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant={isNewCheckoutFlow ? 'body1' : 'caption'}
                >
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
        {!isNewCheckoutFlow && !forceHideConfirmPaymentButton && (
          <>
            <div className={classes.conditions}>
              {AcceptTermsAndConditionsComponent}
            </div>
            <div className={classes.actionRow}>
              {processing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  disabled={
                    loading ||
                    forceDisabled ||
                    !stripe ||
                    !termsAndConditionsAccepted ||
                    !hasAddPaymentMethodPermission
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
          </>
        )}
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
export default PaymentStripeSofort;
