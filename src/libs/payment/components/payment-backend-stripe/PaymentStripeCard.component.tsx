// @ts-nocheck
// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group';
import StripeErrorCode from './StripeErrorCode.component';
import PaymentMethodList from '../payment-method-list/PaymentMethodList.component';
import {
  blockPendingBasket as blockPendingBasketAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '../../api';
import UseInternalAccountForm from '#libs/payment/components/UseInternalAccountForm.component';

type Props = {
  memberId: number;
  companyId: number;
  onSuccess: (callback: () => void) => void;
  onError: () => void;
  setPaymentProcessing?: (processing: boolean) => void;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
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

export const StripePaymentCard = ({
  memberId,
  companyId,
  onSuccess,
  onError,
  setPaymentProcessing,
  setProcessing,
  processing,
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
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice', 'payment']);

  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = React.useState(null);
  const [saveForLater, setSaveForLater] = React.useState(false);
  const [paymentMethodList, setPaymentMethodList] = React.useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] =
    React.useState(null);
  const [hasDetached, setHasDetached] = React.useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = React.useState(true);

  const setPaymentPageProcessing = React.useCallback(
    (process) => {
      if (setPaymentProcessing) setPaymentProcessing(process);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
            payment_group_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
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
  };

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
              <Typography variant="caption">
                {t('paymentPanel.actions.saveForLater')}
              </Typography>
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
              disabled={
                loading ||
                forceDisabled ||
                !stripe ||
                !elements ||
                !clientSecret ||
                !termsAndConditionsAccepted
              }
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
    </form>
  );
};

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
}));

export default compose(
  withState('error', 'setError', null),
  withState('processing', 'setProcessing', false),
)(StripePaymentCard);
