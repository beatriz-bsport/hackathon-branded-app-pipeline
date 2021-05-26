// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { withState, compose } from 'recompose';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import PAYMENT_METHODS, {
  CB as PAYMENT_METHOD_CB,
  SEPA as PAYMENT_METHOD_SEPA,
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  DISPUTE as PAYMENT_METHOD_DISPUTE,
  SUBSCRIPTION_CB as PAYMENT_METHOD_SUBSCRIPTION_CB,
  BANCONTACT,
  EPS,
  GIROPAY,
  SOFORT,
  IDEAL,
} from '@bsport/common/lib/master-data/payment-methods';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getStripePkKey } from '../../theme/selectors';

import PriceInput from '../../../components/input/PriceInput.component';
import StripeForm from '../../../components/form/StripeForm.component';
import PaymentMethodList from '../../payment/components/PaymentMethodList.component';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  price: string,
  paymentMethodIdentifier: number,
  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
  onAddPaymentItem: (paramsDict: any) => void,
  savedPaymentMethodList: ?Array<PaymentMethodList>,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  memberId: ?number,
};

const PaymentItemForm = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  switch (props.paymentMethodIdentifier) {
    case PAYMENT_METHOD_CB.id: {
      const relevantSavedPaymentMethodList = props.savedPaymentMethodList || [];
      return (
        <div className={classes.stripeFormContainer}>
          <Elements stripe={stripePromise}>
            <StripeForm
              price={props.price}
              onComplete={
                ({ id }) =>
                  props.onAddPaymentItem({
                    stripe_charge_id: id,
                  }) /* this.receiveStripeToken */
              }
            />
          </Elements>
          <PaymentMethodList
            paymentMethod={relevantSavedPaymentMethodList}
            isExpandable
            showEmpty
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            savedPaymentMethodList={relevantSavedPaymentMethodList}
            paymentMethodType="card"
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            onSelect={(payment_method_id) => {
              props.onAddPaymentItem({
                stripe_charge_id: payment_method_id,
              });
            }}
            detachPaymentMethodLoading={props.detachPaymentMethodLoading}
            detachPaymentMethod={props.detachPaymentMethod}
            snackbarErrorMsg={props.snackbarErrorMsg}
            snackbarSuccessMsg={props.snackbarSuccessMsg}
            memberId={props.memberId}
          />
        </div>
      );
    }
    case PAYMENT_METHOD_SEPA.id: {
      const relevantSavedPaymentMethodList = props.savedPaymentMethodList || [];
      return (
        <div className={classes.stripeFormContainer}>
          <PaymentMethodList
            paymentMethod={relevantSavedPaymentMethodList}
            showEmpty
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            savedPaymentMethodList={relevantSavedPaymentMethodList}
            paymentMethodType="sepa_debit"
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            onSelect={(payment_method_id) => {
              props.onAddPaymentItem({
                stripe_charge_id: payment_method_id,
              });
            }}
            detachPaymentMethodLoading={props.detachPaymentMethodLoading}
            detachPaymentMethod={props.detachPaymentMethod}
            snackbarErrorMsg={props.snackbarErrorMsg}
            snackbarSuccessMsg={props.snackbarSuccessMsg}
            memberId={props.memberId}
          />
        </div>
      );
    }
    default: {
      return (
        <div>
          <TextField
            label={t('paymentNote.label')}
            helperText={t('paymentNote.helperText')}
            value={props.payment_note}
            onChange={(ev) => props.setPaymentNote(ev.target.value)}
            margin="dense"
            fullWidth
          />
          <Button
            className={classes.addButton}
            color="primary"
            variant="outlined"
            onClick={() => props.onAddPaymentItem()}
            disabled={!props.price}
          >
            <AddCircleIcon className={classes.leftIcon} />{' '}
            {t('actions.addThisPaymentItem')}
          </Button>
        </div>
      );
    }
  }
};

export const PaymentEditor = (props: {
  price: string,
  paymentMethod: number,
  payment_note: string,
  setPaymentMethod: (string) => void,
  setPrice: (string) => void,
  setPaymentNote: (string) => void,
  onSubmit: (PaymentMethod) => void,
  refreshSavedPaymentMethodList: () => void,
  savedPaymentMethodList: ?Array<PaymentMethodList>,
  requestSetupIntentSecret: () => void,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  memberId: ?number,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const { paymentMethod, price } = props;
  return (
    <div className={classes.innerForm}>
      <FormControl>
        <InputLabel
          shrink
          htmlFor="payment-method-helper"
          className={classes.paymentMethodLabel}
        >
          {t('paymentMethod.label')}
        </InputLabel>
        <Select
          fullWidth
          value={paymentMethod}
          className={classes.paymentMethodInput}
          onChange={(event) => props.setPaymentMethod(event.target.value)}
          input={
            <Input
              className={classes.input}
              name="payment-method"
              id="payment-method-helper"
            />
          }
        >
          {PAYMENT_METHODS.filter(
            (pm) =>
              pm.id !== PAYMENT_METHOD_SUBSCRIPTION_CB.id &&
              pm.id !== PAYMENT_METHOD_CREDIT_ACCOUNT.id &&
              pm.id !== PAYMENT_METHOD_DISPUTE.id &&
              pm.id !== BANCONTACT.id &&
              pm.id !== EPS.id &&
              pm.id !== GIROPAY.id &&
              pm.id !== IDEAL.id &&
              pm.id !== SOFORT.id,
          ).map((pm) => (
            <MenuItem key={pm.id} value={pm.id}>
              {t(`paymentMethod.${pm.id}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.priceInputContainer}>
        <FormControl>
          <FormControlLabel
            control={
              <PriceInput
                value={price}
                onChange={(ev) => {
                  props.setPrice(ev.target.value);
                }}
                variant="outlined"
                margin="dense"
                required
                fullWidth
              />
            }
          />
        </FormControl>
      </div>
      <PaymentItemForm
        price={price}
        paymentMethodIdentifier={paymentMethod}
        savedPaymentMethodList={props.savedPaymentMethodList}
        requestSetupIntentSecret={props.requestSetupIntentSecret}
        refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
        onAddPaymentItem={(extraData) => {
          props.onSubmit({
            payment_method: props.paymentMethod,
            price: parseFloat(props.price).toFixed(2),
            payment_received: true,
            payment_note: props.payment_note,
            ...(extraData || {}),
          });
        }}
        payment_note={props.payment_note}
        setPaymentNote={props.setPaymentNote}
        detachPaymentMethodLoading={props.detachPaymentMethodLoading}
        detachPaymentMethod={props.detachPaymentMethod}
        snackbarErrorMsg={props.snackbarErrorMsg}
        snackbarSuccessMsg={props.snackbarSuccessMsg}
        memberId={props.memberId}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  innerForm: {
    padding: theme.spacing(3),
  },
  priceInputContainer: {
    marginLeft: theme.spacing(2),
  },
  accountBalanceInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    border: '1px solid #ced4da',
    backgroundColor: theme.palette.background.paper,
  },
  stripeFormContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paymentMethodInput: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    minWidth: 260,
  },
  input: {
    marginTop: theme.spacing(1),
  },
  paymentMethodLabel: {
    paddingBottom: theme.spacing(2),
  },
}));

export default compose(
  withState('price', 'setPrice', ({ amountDue }) => amountDue || 0),
  withState('payment_note', 'setPaymentNote', ''),
  withState('paymentMethod', 'setPaymentMethod', PAYMENT_METHOD_CB.id),
)(PaymentEditor);
