// @flow
import React, { useEffect, useState } from 'react';

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
} from '../../api';
import PaymentMethodList from '../payment-method-list';

const PaymentStripeBacsDebit = (props: {
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
  paymentGroupId: number;
  memberId: number;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  saveForLaterBacsDebit: boolean;
  setSaveForLaterBacsDebit: React.Dispatch<React.SetStateAction<Boolean>>;
}) => {
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
    fetchPaymentMethodListAPI({ member: props.memberId }).then((r) =>
      setPaymentMethodList(
        r.data.filter((paymentMethod) => paymentMethod.type === 'bacs_debit'),
      ),
    );
  }, [props.memberId, props.clientSecret, hasDetached]);

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

  const defineSelectedPaymentMethod = (id: string) => {
    if (id !== paymentMethodSelected) {
      setPaymentMethodSelected(id);
    }
  };

  const handleSaveForLater = async (checked: boolean) => {
    setProcessing(true);
    try {
      await updateIntentToSavePaymentMethodAPI({
        save_for_later: checked,
        payment_group_id: props.paymentGroupId,
      });
      props.setSaveForLaterBacsDebit(checked);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setProcessing(true);
    setErrorMessage(null);

    if (props.basketId) {
      const { data } = await verifyPriceBasketAPI(props.basketId);

      const basketItemsChecked = await props.checkItemsBasket(props.basketId);
      if (!basketItemsChecked) {
        setProcessing(false);
        return;
      }

      if (
        (!!props.basketTotalPriceCts || props.basketTotalPriceCts === 0) &&
        props.basketTotalPriceCts !== data
      ) {
        setProcessing(false);
        // eslint-disable-next-line
        window.alert(t('paymentPanel.actions.basketInconsistent'));
        window.location.reload();
        return;
      }
    }

    // In the case where the user wants to enter a new payment method, we use stripe 'confirmPayment',
    // else we have to confirm the payment intent in the backend by calling 'confirmPaymentByPaymentMethodId'
    if (!paymentMethodSelected) {
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
        clientSecret: props.clientSecret,
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
        if (props.onError) props.onError();
        setProcessing(false);
      } else {
        setErrorMessage(null);
        props.onSuccess(() => setProcessing(false));
      }
    } else {
      await confirmPaymentByPaymentMethodIdAPI(
        props.paymentGroupId,
        paymentMethodSelected,
      );
      setErrorMessage(null);
      props.onSuccess(() => setProcessing(false));
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {addPaymentMethod && (
        <div>
          <PaymentElement />
          <div className={classes.saveAndDisplay}>
            <div className={classes.row}>
              <Checkbox
                checked={props.saveForLaterBacsDebit}
                onChange={(ev) => handleSaveForLater(ev.target.checked)}
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
            onSelect={(id: string) => defineSelectedPaymentMethod(id)}
            setHasDetached={setHasDetached}
            memberId={props.memberId}
            detachPaymentMethodLoading={props.detachPaymentMethodLoading}
            detachPaymentMethod={props.detachPaymentMethod}
            snackbarErrorMsg={props.snackbarErrorMsg}
            snackbarSuccessMsg={props.snackbarSuccessMsg}
            companyId={props.companyId}
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
