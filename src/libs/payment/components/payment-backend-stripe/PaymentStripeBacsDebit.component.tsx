// @ts-nocheck
// @flow
import React, { useCallback, useEffect, useState } from 'react';

import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { ButtonBase, Checkbox } from '@material-ui/core';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
  updateIntentToSavePaymentMethod as updateIntentToSavePaymentMethodAPI,
  confirmPaymentByPaymentMethodId as confirmPaymentByPaymentMethodIdAPI,
  updateIntentToSavePaymentMethodWebview as updateIntentToSavePaymentMethodWebviewAPI,
  confirmPaymentByPaymentMethodIdWebview as confirmPaymentByPaymentMethodIdWebviewAPI,
} from '../../api';
import PaymentMethodList from '../payment-method-list';

interface PaymentStripeBacsDebitProps {
  companyId: number;
  onCancel: () => void;
  onSuccess: (callback?: () => void) => void;
  onError: () => void;
  termsAndConditionsAccepted: boolean;
  AcceptTermsAndConditionsComponent: React.Component;
  forceDisabled?: boolean;
  loading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string;
  fromApp: boolean;
  paymentGroupId: number;
  memberId: number;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  saveForLaterBacsDebit: boolean;
  setSaveForLaterBacsDebit: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PaymentStripeBacsDebit = ({
  companyId,
  onCancel,
  onSuccess,
  onError,
  termsAndConditionsAccepted,
  AcceptTermsAndConditionsComponent,
  forceDisabled,
  loading,
  basketId,
  basketTotalPriceCts,
  checkItemsBasket,
  clientSecret,
  fromApp,
  paymentGroupId,
  memberId,
  detachPaymentMethodLoading,
  detachPaymentMethod,
  snackbarErrorMsg,
  snackbarSuccessMsg,
  saveForLaterBacsDebit,
  setSaveForLaterBacsDebit,
}: PaymentStripeBacsDebitProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null);
  const [hasDetached, setHasDetached] = React.useState(null);

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = useState(true);

  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  useEffect(() => {
    fetchPaymentMethodListAPI({ member: memberId }).then((r) =>
      setPaymentMethodList(
        r.data.filter((paymentMethod) => paymentMethod.type === 'bacs_debit'),
      ),
    );
  }, [memberId, clientSecret, hasDetached]);

  useEffect(() => {
    setAddPaymentMethod(!paymentMethodList.length);
    if (paymentMethodList.length) {
      setPaymentMethodSelected(paymentMethodList[0].id);
    }
  }, [paymentMethodList]);

  useEffect(() => {
    if (addPaymentMethod) {
      setPaymentMethodSelected(null);
    }
  }, [addPaymentMethod]);

  const updateIntentToSavePaymentMethodAdaptedAPI = fromApp
    ? updateIntentToSavePaymentMethodWebviewAPI
    : updateIntentToSavePaymentMethodAPI;

  const defineSelectedPaymentMethod = useCallback(
    (id: string) => {
      if (id !== paymentMethodSelected) {
        setPaymentMethodSelected(id);
      }
    },
    [paymentMethodSelected, setPaymentMethodSelected],
  );

  const handleSaveForLater = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setProcessing(true);
      event.persist();
      const checked = event.target.checked;
      try {
        if (!fromApp || basketId) {
          await updateIntentToSavePaymentMethodAdaptedAPI({
            save_for_later: checked,
            payment_group_id: paymentGroupId,
            ...(fromApp ? { basket_id: basketId } : {}),
          });
          setSaveForLaterBacsDebit(checked);
        }
      } catch (err) {
        console.error(err);
      }
      setProcessing(false);
    },
    [
      basketId,
      fromApp,
      paymentGroupId,
      setSaveForLaterBacsDebit,
      updateIntentToSavePaymentMethodAdaptedAPI,
    ],
  );

  const verifyBasket = useCallback(async () => {
    const { data } = await verifyPriceBasketAPI(basketId);

    const basketItemsChecked = await checkItemsBasket(basketId);
    if (!basketItemsChecked) {
      setProcessing(false);
      return;
    }

    if (
      (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
      basketTotalPriceCts !== data
    ) {
      setProcessing(false);
      // eslint-disable-next-line
  window.alert(t('paymentPanel.actions.basketInconsistent'));
      window.location.reload();
    }
  }, [basketId, basketTotalPriceCts, checkItemsBasket, t]);

  const submitStripePayment = useCallback(async () => {
    if (!stripe) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Since BACS Direct Debit is not a bank-redirect method, this param is useless but it remains mandatory (04 - 2023)
        // Link to the Stripe doc: https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
        return_url: `${window.location.href}`,
      },
      redirect: 'if_required',
    });
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      setErrorMessage(result.error.message);
      if (onError) onError();
      setProcessing(false);
    } else {
      setErrorMessage(null);
      onSuccess(() => setProcessing(false));
    }
  }, [clientSecret, elements, onError, onSuccess, stripe]);

  const submitPaymentWithPaymentMethodSelected = useCallback(async () => {
    if (fromApp) {
      await confirmPaymentByPaymentMethodIdWebviewAPI(
        paymentGroupId,
        paymentMethodSelected,
        basketId,
      );
    } else {
      await confirmPaymentByPaymentMethodIdAPI(
        paymentGroupId,
        paymentMethodSelected,
      );
    }
    setErrorMessage(null);
    onSuccess(() => setProcessing(false));
  }, [basketId, fromApp, onSuccess, paymentGroupId, paymentMethodSelected]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
      setProcessing(true);
      setErrorMessage(null);

      if (basketId) verifyBasket();

      // In the case where the user wants to enter a new payment method, we use stripe 'confirmPayment',
      // else we have to confirm the payment intent in the backend by calling 'confirmPaymentByPaymentMethodId'
      if (!paymentMethodSelected) {
        submitStripePayment();
      } else {
        submitPaymentWithPaymentMethodSelected();
      }
    },
    [
      basketId,
      paymentMethodSelected,
      submitPaymentWithPaymentMethodSelected,
      submitStripePayment,
      verifyBasket,
    ],
  );

  return (
    <form onSubmit={handleSubmit}>
      {addPaymentMethod && (
        <div>
          <PaymentElement />
          <div className={classes.saveAndDisplay}>
            <div className={classes.row}>
              <Checkbox
                checked={saveForLaterBacsDebit}
                onChange={handleSaveForLater}
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
      {!addPaymentMethod && !!paymentMethodList.length && (
        <div>
          <PaymentMethodList
            savedPaymentMethodList={paymentMethodList}
            selectedSavedPaymentMethodId={paymentMethodSelected}
            paymentMethodType="bacs_debit"
            onSelect={defineSelectedPaymentMethod}
            setHasDetached={setHasDetached}
            memberId={memberId}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            detachPaymentMethod={detachPaymentMethod}
            snackbarErrorMsg={snackbarErrorMsg}
            snackbarSuccessMsg={snackbarSuccessMsg}
            companyId={companyId}
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
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <div className={classes.conditionRow}>
        {AcceptTermsAndConditionsComponent}
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
              loading || forceDisabled || !stripe || !termsAndConditionsAccepted
            }
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

export default PaymentStripeBacsDebit;
