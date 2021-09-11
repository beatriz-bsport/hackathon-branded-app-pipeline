// @flow
//
import moment from 'moment-timezone';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_CASH } from '@bsport/common/lib/master-data/payment-group';
import DateInput from '../../../../components/input/DateInput.component';
import PriceInput from '../../../../components/input/PriceInput.component';

import { submitInternalPayment as submitInternalPaymentAPI } from '../../api';

type Props = {
  paymentMethodSelected: number,
  selectPaymentMethod: (number) => void,
  paymentMethodChoices: Array<number>,
  amountToPay: number,
  clientSecret: string,
  onCancel: () => void,
  onSuccess: (callback: ?() => void) => void,
};

export const PaymentStripe = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [payment_note, setPaymentNote] = React.useState('');
  const [processing, setProcessing] = React.useState(false);

  const [amountToPay, setAmountToPay] = React.useState(
    parseInt(props.amountToPay, 10) / 100,
  );
  const [date, setDate] = React.useState(moment().format());

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setProcessing(true);
        submitInternalPaymentAPI({
          secret: props.clientSecret,
          payment_method_identifier: props.paymentMethodSelected,
          payment_note,
          date,
          price_cts: Math.round(parseFloat(amountToPay) * 100),
        })
          .then(() => {
            props.onSuccess(() => setProcessing(false));
          })
          .catch((err) => console.error(err));
      }}
      className={classes.container}
    >
      <div className={classes.priceContainer}>
        <PriceInput
          value={amountToPay}
          label={t('paymentPanel.amount.label')}
          variant="outlined"
          disabled={processing || !props.clientSecret}
          onChange={(ev) => setAmountToPay(ev.target.value)}
        />
        {!!props.amountToPay &&
          parseInt(props.amountToPay, 10) / 100 <=
            parseInt(amountToPay, 10) - 1 && (
            <div className={classes.priceTextHelper}>
              <Typography color="error" variant="caption">
                {t('paymentPanel.billingMoreThanNeeded')}
              </Typography>
            </div>
          )}
      </div>
      <FormControl className={classes.field}>
        <InputLabel id="payment-method-select-label">
          {t('paymentMethod.select.label')}
        </InputLabel>
        <Select
          id="payment-method-select"
          value={`${props.paymentMethodSelected}`}
          disabled={processing || !props.clientSecret}
          style={{ minWidth: 200 }}
          onChange={(ev) =>
            props.selectPaymentMethod(parseInt(ev.target.value, 10))
          }
        >
          {props.paymentMethodChoices.map((pm) => (
            <MenuItem fullWidth value={pm}>
              {t(`paymentMethod.label.${pm}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.field}>
        <DateInput
          value={date}
          required
          disabled={processing}
          onChange={(dateMoment) => {
            setDate(dateMoment.format());
          }}
          label={t('paymentPanel.date.label')}
        />
      </div>
      <div className={classes.innerContainer}>
        <TextField
          value={payment_note}
          variant="outlined"
          fullWidth
          onChange={(ev) => setPaymentNote(ev.target.value)}
          label={t('paymentPanel.paymentNote.label')}
          helperText={t('paymentPanel.paymentNote.helperText')}
          disabled={processing || !props.clientSecret}
        />
        <div className={classes.actionRow}>
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={processing || !props.clientSecret}
            >
              {t('paymentPanel.actions.confirmPayment')}
            </Button>
          )}
          <Button onClick={props.onCancel} disabled={processing}>
            {t('paymentPanel.actions.cancel')}
          </Button>
        </div>
      </div>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  priceContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  priceTextHelper: {
    maxWidth: 320,
    marginTop: theme.spacing(1),
  },
}));

export default compose(
  withState(
    'paymentMethodSelected',
    'selectPaymentMethod',
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  ),
)(PaymentStripe);
