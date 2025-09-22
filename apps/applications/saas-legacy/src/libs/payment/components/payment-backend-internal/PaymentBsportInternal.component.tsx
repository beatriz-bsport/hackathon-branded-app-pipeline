import React, { JSX } from 'react';

import Config from '#src/config';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL,
} from '@bsport/common/lib/master-data/payment-group.js';
import PriceInput from '#src/components/input/PriceInput.component';
import type { InternalPaymentPayload } from '#src/libs/payment/types';
import DateInput from '../../../../components/input/DateInput.component';

import { submitInternalPayment as submitInternalPaymentAPI } from '../../api';

import type { OptionBackgroundCallback } from '#src/state/types';

type Props = {
  paymentMethodChoices: Array<number>;
  amountToPay: string;
  clientSecret: string;
  companyId?: number;
  onCancel: () => void;
  onProcessing?: (processing: boolean) => void;
  onSuccess: (callback?: () => void) => void;
  hideAmountToPay?: boolean;
  showDateInput?: boolean;
  dateFieldEndAdornment?: JSX.Element;
  customClasses?: { [className: string]: string };
  children?: React.ReactNode;
  submitInternalPaymentInBackground?: (
    data: InternalPaymentPayload,
    options?: OptionBackgroundCallback<
      { paymentGroupId: number; invoiceUuid: string },
      { paymentGroupId: number; invoiceUuid: string }
    >,
  ) => void;
  loading?: boolean;
};

const TNM_PARIS_COMPANY_ID = 4272;

// Added in the context of a specific request from The New Me Paris since most of their manual payments are done by manual card
const getCompanyIdsToDisplayManualCardAsDefault = () => {
  switch (Config.REACT_APP_SENTRY_ENVIRONMENT) {
    case 'production':
      return [TNM_PARIS_COMPANY_ID];
    case 'staging':
      return [94];
    case 'dev':
      return [2];
    default:
      return [];
  }
};

export const PaymentBsportInternal: React.FC<Props> = ({
  paymentMethodChoices,
  amountToPay,
  clientSecret,
  companyId,
  onCancel,
  onProcessing,
  onSuccess,
  hideAmountToPay,
  showDateInput,
  dateFieldEndAdornment,
  customClasses,
  children,
  submitInternalPaymentInBackground,
  loading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [payment_note, setPaymentNote] = React.useState('');

  const [processing, setProcessing] = React.useState(false);

  const [modifiedAmountToPay, setModifiedAmountToPay] = React.useState(
    parseInt(amountToPay, 10) / 100,
  );

  React.useEffect(
    () => setModifiedAmountToPay(parseInt(amountToPay, 10) / 100),
    [amountToPay],
  );

  const [date, setDate] = React.useState(DateTime.now());

  const defaultPaymentMethod =
    companyId && getCompanyIdsToDisplayManualCardAsDefault().includes(companyId)
      ? PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL
      : PAYMENT_GROUP_METHOD_IDENTIFIER_CASH;

  const [paymentMethodSelected, setPaymentMethodSelected] =
    React.useState(defaultPaymentMethod);

  const onPaymentMethodSelect = React.useCallback(
    (ev) => setPaymentMethodSelected(parseInt(ev.target.value, 10)),
    [],
  );

  const onPriceChange = React.useCallback(
    (ev) => setModifiedAmountToPay(ev.target.value),
    [],
  );

  const onFormSubmit = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      setProcessing(true);
      onProcessing?.(true);
      if (submitInternalPaymentInBackground) {
        submitInternalPaymentInBackground(
          {
            payment_backend_id: clientSecret,
            payment_method_identifier: paymentMethodSelected,
            // @ts-expect-error just to be safe since modifiedAmountToPay can be a string
            price_cts: Math.round(parseFloat(modifiedAmountToPay) * 100),
            payment_note,
            date: date.toISO(),
          },
          {
            onSuccess: () => {
              setProcessing(false);
              onProcessing?.(false);
            },
            onError: () => {
              setProcessing(false);
              onProcessing?.(false);
            },
          },
        );
      } else {
        submitInternalPaymentAPI({
          secret: clientSecret,
          payment_method_identifier: paymentMethodSelected,
          payment_note,
          date: date.toISO(),
          // @ts-expect-error just to be safe since modifiedAmountToPay can be a string
          price_cts: Math.round(parseFloat(modifiedAmountToPay) * 100 || 0),
        })
          .then(() => {
            onSuccess(() => setProcessing(false));
            onProcessing?.(false);
          })
          .catch((err) => console.error(err));
      }
    },
    [
      clientSecret,
      date,
      modifiedAmountToPay,
      onProcessing,
      onSuccess,
      paymentMethodSelected,
      payment_note,
      submitInternalPaymentInBackground,
    ],
  );

  const onDateChange = React.useCallback((dateMoment: DateTime) => {
    setDate(dateMoment);
  }, []);

  const onPaymentNoteChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setPaymentNote(ev.target.value),
    [],
  );

  return (
    <form
      className={clsx(classes.container, customClasses?.contaier)}
      onSubmit={onFormSubmit}
    >
      {!hideAmountToPay && (
        <div
          className={clsx(
            classes.priceContainer,
            customClasses?.priceContainer,
          )}
        >
          <PriceInput
            disabled={processing || !clientSecret || loading}
            label={t('paymentPanel.amount.label')}
            onChange={onPriceChange}
            value={modifiedAmountToPay}
            variant="outlined"
          />
          {!!amountToPay &&
            parseInt(amountToPay) / 100 <= modifiedAmountToPay - 1 && (
              <div
                className={clsx(
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
      <FormControl className={clsx(classes.field, customClasses?.field)}>
        <InputLabel id="payment-method-select-label">
          {t('paymentMethod.select.label')}
        </InputLabel>
        <Select
          disabled={processing || !clientSecret}
          id="payment-method-select"
          onChange={onPaymentMethodSelect}
          style={{ minWidth: 200 }}
          value={`${paymentMethodSelected}`}
        >
          {(paymentMethodChoices ?? []).map((pm) => (
            <MenuItem key={pm} value={pm}>
              {t(`paymentMethod.label.${pm}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showDateInput && (
        <div className={clsx(classes.field, customClasses?.field)}>
          <DateInput
            required
            disabled={processing}
            endAdornment={dateFieldEndAdornment}
            label={t('paymentPanel.date.label')}
            onChange={onDateChange}
            value={date}
          />
        </div>
      )}
      <div
        className={clsx(classes.innerContainer, customClasses?.innerContainer)}
      >
        <TextField
          fullWidth
          disabled={processing || !clientSecret}
          helperText={t('paymentPanel.paymentNote.helperText')}
          label={t('paymentPanel.paymentNote.label')}
          onChange={onPaymentNoteChange}
          value={payment_note}
          variant="outlined"
        />
        {children ?? null}
        <div className={clsx(classes.actionRow, customClasses?.actionRow)}>
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              color="primary"
              disabled={processing || !clientSecret || loading}
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

export default React.memo(PaymentBsportInternal);
