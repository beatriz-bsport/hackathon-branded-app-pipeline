import React, { JSX } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';

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
// @ts-expect-error
import PriceInput from '../../../../components/input/PriceInput.component';

import { submitInternalPayment as submitInternalPaymentAPI } from '../../api';

type OwnProps = {
  paymentMethodChoices: Array<number>;
  amountToPay: string;
  clientSecret: string;
  onCancel: () => void;
  onSuccess: (callback?: () => void) => void;
  hideAmountToPay?: boolean;
  dateFieldEndAdornment?: JSX.Element;
  customClasses?: { [className: string]: string };
};

type Props = OwnProps & {
  paymentMethodSelected: number;
  selectPaymentMethod: (paymentMethod: number) => void;
};

export const PaymentStripe: React.FC<Props> = ({
  paymentMethodSelected,
  selectPaymentMethod,
  paymentMethodChoices,
  amountToPay,
  clientSecret,
  onCancel,
  onSuccess,
  hideAmountToPay,
  dateFieldEndAdornment,
  customClasses,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [payment_note, setPaymentNote] = React.useState('');

  const [processing, setProcessing] = React.useState(false);

  const [modifiedAmountToPay, setModifiedAmountToPay] = React.useState(
    parseInt(amountToPay, 10) / 100,
  );

  const [date, setDate] = React.useState(moment().format());

  const onPaymentMethodSelect = React.useCallback(
    (ev) => selectPaymentMethod(parseInt(ev.target.value, 10)),
    [selectPaymentMethod],
  );

  const onPriceChange = React.useCallback(
    (ev) => setModifiedAmountToPay(ev.target.value),
    [],
  );

  const onFormSubmit = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      setProcessing(true);
      submitInternalPaymentAPI({
        secret: clientSecret,
        payment_method_identifier: paymentMethodSelected,
        payment_note,
        date,
        // @ts-expect-error just to be safe since modifiedAmountToPay can be a string
        price_cts: Math.round(parseFloat(modifiedAmountToPay) * 100),
      })
        .then(() => {
          onSuccess(() => setProcessing(false));
        })
        .catch((err) => console.error(err));
    },
    [
      clientSecret,
      date,
      modifiedAmountToPay,
      onSuccess,
      paymentMethodSelected,
      payment_note,
    ],
  );

  return (
    <form
      onSubmit={onFormSubmit}
      className={classNames(classes.container, customClasses?.contaier)}
    >
      {!hideAmountToPay && (
        <div
          className={classNames(
            classes.priceContainer,
            customClasses?.priceContainer,
          )}
        >
          <PriceInput
            value={modifiedAmountToPay}
            label={t('paymentPanel.amount.label')}
            variant="outlined"
            disabled={processing || !clientSecret}
            onChange={onPriceChange}
          />
          {!!amountToPay &&
            parseInt(amountToPay) / 100 <= modifiedAmountToPay - 1 && (
              <div
                className={classNames(
                  classes.priceTextHelper,
                  customClasses?.priceTextHelper,
                )}
              >
                <Typography color="error" variant="caption">
                  {t('paymentPanel.billingMoreThanNeeded')}
                </Typography>
              </div>
            )}
        </div>
      )}
      <FormControl className={classNames(classes.field, customClasses?.field)}>
        <InputLabel id="payment-method-select-label">
          {t('paymentMethod.select.label')}
        </InputLabel>
        <Select
          id="payment-method-select"
          value={`${paymentMethodSelected}`}
          disabled={processing || !clientSecret}
          style={{ minWidth: 200 }}
          onChange={onPaymentMethodSelect}
        >
          {(paymentMethodChoices ?? []).map((pm) => (
            <MenuItem value={pm} key={pm}>
              {t(`paymentMethod.label.${pm}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classNames(classes.field, customClasses?.field)}>
        <DateInput
          value={date}
          required
          disabled={processing}
          onChange={(dateMoment) => {
            setDate(dateMoment.format());
          }}
          label={t('paymentPanel.date.label')}
          endAdornment={dateFieldEndAdornment}
        />
      </div>
      <div
        className={classNames(
          classes.innerContainer,
          customClasses?.innerContainer,
        )}
      >
        <TextField
          value={payment_note}
          variant="outlined"
          fullWidth
          onChange={(ev) => setPaymentNote(ev.target.value)}
          label={t('paymentPanel.paymentNote.label')}
          helperText={t('paymentPanel.paymentNote.helperText')}
          disabled={processing || !clientSecret}
        />
        <div
          className={classNames(classes.actionRow, customClasses?.actionRow)}
        >
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={processing || !clientSecret}
            >
              {t('paymentPanel.actions.confirmPayment')}
            </Button>
          )}
          <Button onClick={onCancel} disabled={processing}>
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

export default compose<Props, OwnProps>(
  withState(
    'paymentMethodSelected',
    'selectPaymentMethod',
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  ),
  React.memo,
)(PaymentStripe);
