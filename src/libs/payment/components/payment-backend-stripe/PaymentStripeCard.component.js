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
import StripeErrorCode from './StripeErrorCode.component';
import PaymentMethodList from '../payment-method-list/PaymentMethodList.component';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '../../api';

type Props = {
  memberId: number,
  companyId: number,
  onSuccess: (callback: () => void) => void,
  onError: (callback: () => void) => void,
  setError: (err: ?boolean) => void,
  setProcessing: (processing: boolean) => void,
  processing: boolean,
  onCancel: () => void,
  clientSecret: string,
  error: ?Error,
  termsAndConditionsAccepted: boolean,
  AcceptTermsAndConditionsComponent: React.Component,
  forceDisabled?: boolean,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  loading?: boolean,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  sepaDefaultName?: string,
  sepaDefaultEmail?: string,
  basketId?: string,
  basketTotalPriceCts?: number,
};

const CARD_ELEMENT_OPTIONS = {
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

export const StripePaymentCard = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice', 'payment']);

  const stripe = useStripe();
  const elements = useElements();

  const [saveForLater, setSaveForLater] = React.useState(false);
  const [paymentMethodList, setPaymentMethodList] = React.useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] = React.useState(
    null,
  );
  const [hasDetached, setHasDetached] = React.useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = React.useState(true);

  React.useEffect(() => {
    fetchPaymentMethodListAPI({ member: props.memberId }).then((r) =>
      setPaymentMethodList(r.data.filter((pm) => pm.type === 'card')),
    );
  }, [props.memberId, props.clientSecret, hasDetached]);

  React.useEffect(() => {
    setAddPaymentMethod(!paymentMethodList.length);
    if (paymentMethodList.length) {
      setPaymentMethodSelected(paymentMethodList[0].id);
    }
  }, [paymentMethodList]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe has not yet loaded.
      // Make sure to disable form submission until Stripe has loaded.
      return;
    }
    props.setProcessing(true);

    if (props.basketId) {
      const { data } = await verifyPriceBasketAPI(props.basketId);

      if (
        (!!props.basketTotalPriceCts || props.basketTotalPriceCts === 0) &&
        props.basketTotalPriceCts !== data
      ) {
        props.setProcessing(false);
        window.alert(t('paymentPanel.actions.basketInconsistent'));
        window.location.reload();
        return;
      }
    }

    try {
      const result = await stripe.confirmCardPayment(props.clientSecret, {
        payment_method: paymentMethodSelected || {
          card: elements.getElement(CardElement),
        },
        ...(saveForLater ? { setup_future_usage: 'off_session' } : {}),
      });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        props.setError(result.error);
        props.setProcessing(false);
        if (props.onError) props.onError();
      } else {
        // The payment has been processed!
        props.setError(null);
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          if (props.onSuccess) {
            props.onSuccess(() => props.setProcessing(false));
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={classes.container}>
      <Typography variant="h6">
        {t('payment:forms.savePaymentMethod.section')}
      </Typography>
      {addPaymentMethod && (
        <div>
          <CardSection
            saveForLater={saveForLater}
            setSaveForLater={setSaveForLater}
            error={props.error}
          />
          <div className={classes.saveAndDisplay}>
            <div className={classes.row}>
              <Checkbox
                checked={saveForLater}
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
      {!addPaymentMethod && !!paymentMethodList.length && (
        <div>
          <PaymentMethodList
            savedPaymentMethodList={paymentMethodList}
            selectedSavedPaymentMethodId={paymentMethodSelected}
            isExpandable={false}
            paymentMethodType="card"
            onSelect={setPaymentMethodSelected}
            setHasDetached={setHasDetached}
            memberId={props.memberId}
            detachPaymentMethodLoading={props.detachPaymentMethodLoading}
            detachPaymentMethod={props.detachPaymentMethod}
            snackbarErrorMsg={props.snackbarErrorMsg}
            snackbarSuccessMsg={props.snackbarSuccessMsg}
            companyId={props.companyId}
            sepaDefaultName={props.sepaDefaultName}
            sepaDefaultEmail={props.sepaDefaultEmail}
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

      <div className={classes.conditionRow}>
        {props.AcceptTermsAndConditionsComponent}
      </div>
      <div className={classes.actionRow}>
        {props.processing ? (
          <CircularProgress />
        ) : (
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                props.loading ||
                props.forceDisabled ||
                !stripe ||
                !elements ||
                !props.clientSecret ||
                !props.termsAndConditionsAccepted
              }
            >
              {t('paymentPanel.actions.confirmPayment')}
            </Button>
            {props.onCancel ? (
              <Button onClick={props.onCancel} disabled={props.processing}>
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
  withState('processing', 'setProcessing', false),
  withState('error', 'setError', null),
)(StripePaymentCard);
