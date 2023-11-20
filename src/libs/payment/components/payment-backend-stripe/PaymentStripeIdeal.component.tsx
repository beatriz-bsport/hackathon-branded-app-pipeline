import React, { useImperativeHandle, forwardRef } from 'react';

import {
  useStripe,
  useElements,
  IdealBankElement,
} from '@stripe/react-stripe-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextInput from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL } from '@bsport/common/lib/master-data/payment-group';
import { Info } from '@material-ui/icons';
import { CheckoutContext } from '../../../../pages/checkout/basket/CheckoutContext';
import {
  verifyPriceBasket as verifyPriceBasketAPI,
  blockPendingBasket as blockPendingBasketAPI,
} from '../../api';
import PopOver from '#components/Popover';

const IDEAL_ELEMENT_OPTIONS = {
  // Custom styling can be passed to options when creating an Element
  style: {
    base: {
      padding: '10px 12px',
      zIndex: 9999,
      color: '#32325d',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

function IdealBankSection() {
  return (
    <div>
      <Typography>iDEAL Bank</Typography>
      <IdealBankElement options={IDEAL_ELEMENT_OPTIONS} />
    </div>
  );
}

type PaymentStripeIdealProps = {
  clientSecret: string;
  onCancel: () => void;
  termsAndConditionsAccepted: boolean;
  AcceptTermsAndConditionsComponent: React.Component;
  forceDisabled?: boolean;
  userDefaultName?: string;
  userDefaultEmail?: string;
  loading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  forceSave?: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  setPaymentProcessing: (processing: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  isEstablishmentBillingGroupSelected?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  children?: React.ReactNode;
};

export const PaymentStripeIdeal = forwardRef(
  (
    {
      clientSecret,
      onCancel,
      termsAndConditionsAccepted,
      AcceptTermsAndConditionsComponent,
      forceDisabled,
      userDefaultName,
      userDefaultEmail,
      loading,
      basketId,
      basketTotalPriceCts,
      forceSave,
      checkItemsBasket,
      setPaymentProcessing,
      createPendingBookingsIfNecessary,
      setIsOnlinePaymentDisabled,
      hasAddPaymentMethodPermission = true,
      isEstablishmentBillingGroupSelected,
      children,
    }: PaymentStripeIdealProps,
    ref,
  ) => {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = React.useState(false);
    const [name, setName] = React.useState(userDefaultName || '');
    const [email, setEmail] = React.useState(userDefaultEmail || '');
    const [errorMessage, setErrorMessage] = React.useState(null);

    const [saveForLater, setSaveForLater] = React.useState(false);

    const isNewCheckoutFlow = React.useContext(CheckoutContext);

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

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }

        const idealBank = elements.getElement(IdealBankElement);

        const return_url = window.location.search
          ? `${window.location.href}&check_payment_intent=true`
          : `${window.location.href}?check_payment_intent=true`;

        const { error } = await stripe.confirmIdealPayment(clientSecret, {
          payment_method: {
            ideal: idealBank,
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
                PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
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
            <IdealBankSection />
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
        {!isNewCheckoutFlow && (
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
                  disabled={isSubmitButtonDisabled}
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
    marginBottom: theme.spacing(2),
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
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
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

export default PaymentStripeIdeal;
