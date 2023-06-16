// @flow
import React, { useImperativeHandle, forwardRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group';
import { Info } from '@material-ui/icons';
import { CheckoutContext } from '../../../../pages/checkout/basket/CheckoutContext';
import StripeErrorCode from './StripeErrorCode.component';
import PaymentMethodList from '../payment-method-list/PaymentMethodList.component';
import {
  blockPendingBasket as blockPendingBasketAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '../../api';
import UseInternalAccountForm from '#libs/payment/components/UseInternalAccountForm.component';
import PopOver from '#components/Popover';

type Props = {
  memberId: number;
  companyId: number;
  onSuccess: (callback: () => void) => void;
  onError: () => void;
  setPaymentProcessing?: (processing: boolean) => void;
  onCancel: () => void;
  clientSecret: string;
  termsAndConditionsAccepted: boolean;
  AcceptTermsAndConditionsComponent: React.Component;
  forceDisabled?: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  loading?: boolean;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  basketId?: string;
  basketTotalPriceCts?: number;
  allowConsumerToUseInternalAccount?: boolean;
  useInternalAccount?: (amount: number) => void;
  applyBalanceToInvoice?: () => void;
  creditAccountBalance?: number | null;
  applyBalanceLoading?: boolean;
  forceSave?: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
};

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardSection = (props: { error: any }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.cardSectionContainer}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {!!props.error && (
        <div style={{ margin: 8 }}>
          <StripeErrorCode
            errorCode={props.error.error_code}
            declineCode={props.error.decline_code}
          />
        </div>
      )}
    </React.Fragment>
  );
};

const StripePaymentCard = forwardRef(
  (
    {
      memberId,
      companyId,
      onSuccess,
      onError,
      setPaymentProcessing,
      onCancel,
      clientSecret,
      termsAndConditionsAccepted,
      AcceptTermsAndConditionsComponent,
      forceDisabled,
      detachPaymentMethodLoading,
      detachPaymentMethod,
      loading,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      sepaDefaultName,
      sepaDefaultEmail,
      basketId,
      basketTotalPriceCts,
      allowConsumerToUseInternalAccount,
      useInternalAccount,
      applyBalanceToInvoice,
      creditAccountBalance,
      applyBalanceLoading,
      forceSave,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      setIsOnlinePaymentDisabled,
    }: Props,
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation(['invoice', 'payment']);

    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [saveForLater, setSaveForLater] = React.useState(false);
    const [paymentMethodList, setPaymentMethodList] = React.useState([]);
    const [paymentMethodSelected, setPaymentMethodSelected] =
      React.useState(null);
    const [hasDetached, setHasDetached] = React.useState(null);
    const [addPaymentMethod, setAddPaymentMethod] = React.useState(true);

    const isNewCheckoutFlow = React.useContext(CheckoutContext);

    const setPaymentPageProcessing = React.useCallback(
      (process) => {
        if (setPaymentProcessing) {
          setPaymentProcessing(process);
        }
        setProcessing(process);
      },
      [setPaymentProcessing, setProcessing],
    );

    React.useEffect(() => {
      fetchPaymentMethodListAPI({ member: memberId }).then((r) =>
        setPaymentMethodList(r.data.filter((pm) => pm.type === 'card')),
      );
    }, [memberId, clientSecret, hasDetached]);

    React.useEffect(() => {
      setAddPaymentMethod(!paymentMethodList.length);
      if (paymentMethodList.length) {
        setPaymentMethodSelected(paymentMethodList[0].id);
      }
    }, [paymentMethodList]);

    React.useEffect(() => {
      if (addPaymentMethod) {
        setPaymentMethodSelected(null);
      }
    }, [addPaymentMethod]);

    const isSubmitButtonDisabled =
      loading ||
      forceDisabled ||
      !stripe ||
      !elements ||
      !clientSecret ||
      !termsAndConditionsAccepted;

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        setPaymentPageProcessing(true);

        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }

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

        try {
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethodSelected || {
              card: elements.getElement(CardElement),
            },
            ...(saveForLater || forceSave
              ? { setup_future_usage: 'off_session' }
              : {}),
          });

          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            setError(result.error);
            setPaymentPageProcessing(false);
            if (onError) onError();
          } else {
            // The payment has been processed!
            if (basketId) {
              try {
                await blockPendingBasketAPI(basketId);
              } catch (err) {
                console.error(err);
              }
            }
            setError(null);

            if (createPendingBookingsIfNecessary)
              createPendingBookingsIfNecessary({
                payment_group_method_identifier:
                  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
              });

            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              // There's a risk of the customer closing the window before callback
              // execution. Set up a webhook or plugin to listen for the
              // payment_intent.succeeded event that handles any business critical
              // post-payment actions.
              if (onSuccess) {
                onSuccess(() => setPaymentPageProcessing(false));
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        elements,
        forceSave,
        onError,
        onSuccess,
        paymentMethodSelected,
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

    const defineSelectedPaymentMethod = (id: string) => {
      if (id !== paymentMethodSelected) {
        setPaymentMethodSelected(id);
      }
    };

    return (
      <form onSubmit={handleSubmit} className={classes.container}>
        <Typography variant="h6">
          {t('payment:forms.savePaymentMethod.section')}
        </Typography>
        {addPaymentMethod && (
          <div>
            <CardSection error={error} />
            <div className={classes.saveAndDisplay}>
              <div className={classes.row}>
                <Checkbox
                  checked={saveForLater || forceSave}
                  disabled={forceSave}
                  onChange={(ev) => setSaveForLater(ev.target.checked)}
                />
                <Typography variant={isNewCheckoutFlow ? 'body1' : 'caption'}>
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
                <div className={classes.securityInformationContainer}>
                  <PopOver
                    title={t('paymentPanel.actions.paymentSecurityInformation')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    className={classes.securityInformationText}
                  >
                    <Info className={classes.infoIcon} />
                  </PopOver>
                </div>
              </div>
              {!!paymentMethodList.length && (
                <ButtonBase
                  onClick={() => setAddPaymentMethod(false)}
                  className={classes.displayButton}
                >
                  <Typography variant="body1" align="right" color="primary">
                    {t(
                      'payment:forms.paymentMethod.actions.displayPaymentMethod',
                    )}
                  </Typography>
                </ButtonBase>
              )}
            </div>
          </div>
        )}
        {!addPaymentMethod && !!error && (
          <div style={{ margin: 8 }}>
            <StripeErrorCode
              errorCode={error.error_code}
              declineCode={error.decline_code}
            />
          </div>
        )}
        {!addPaymentMethod && !!paymentMethodList.length && (
          <div>
            <PaymentMethodList
              savedPaymentMethodList={paymentMethodList}
              selectedSavedPaymentMethodId={paymentMethodSelected}
              paymentMethodType="card"
              onSelect={(id: string) => defineSelectedPaymentMethod(id)}
              setHasDetached={setHasDetached}
              memberId={memberId}
              detachPaymentMethodLoading={detachPaymentMethodLoading}
              detachPaymentMethod={detachPaymentMethod}
              snackbarErrorMsg={snackbarErrorMsg}
              snackbarSuccessMsg={snackbarSuccessMsg}
              companyId={companyId}
              sepaDefaultName={sepaDefaultName}
              sepaDefaultEmail={sepaDefaultEmail}
            />
            <ButtonBase
              disabled={false}
              onClick={() => setAddPaymentMethod(true)}
              className={classes.addButton}
            >
              <AddIcon className={classes.leftIcon} color="primary" />
              <Typography variant="body1" align="left" color="primary">
                {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
              </Typography>
            </ButtonBase>
          </div>
        )}
        {allowConsumerToUseInternalAccount && !!creditAccountBalance && (
          <UseInternalAccountForm
            creditAccountBalance={creditAccountBalance}
            onBasketSubmit={useInternalAccount}
            onInvoiceSubmit={applyBalanceToInvoice}
            loading={loading || processing || applyBalanceLoading}
          />
        )}
        {!isNewCheckoutFlow && (
          <>
            <div className={classes.conditionRow}>
              {AcceptTermsAndConditionsComponent}
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
                    disabled={isSubmitButtonDisabled}
                  >
                    {t('paymentPanel.actions.confirmPayment')}
                  </Button>
                  {onCancel ? (
                    <Button onClick={onCancel} disabled={processing}>
                      {t('paymentPanel.actions.cancel')}
                    </Button>
                  ) : (
                    <div />
                  )}
                </React.Fragment>
              )}
            </div>
          </>
        )}
      </form>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {},
  cardSectionContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#F2F2F2',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: 8,
  },
  row: {
    marginTop: theme.spacing(-1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  saveAndDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  displayButton: {
    paddingBottom: theme.spacing(2),
    marginLeft: '50px',
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

export default StripePaymentCard;
