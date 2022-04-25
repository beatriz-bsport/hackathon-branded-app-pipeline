import moment from 'moment-timezone';
import type { Moment as MomentType } from 'moment';

import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';

import { CircularProgress, makeStyles, Theme } from '@material-ui/core';
import DateInput from '../../../components/input/DateInput.component';
import Checkbox from '../../../components/input/Checkbox.component';
import PaymentMethodList from '../../payment/components/payment-method-list/PaymentMethodList.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import type { PlannedPaymentEvent } from '../types';
import type { PaymentMethod } from '#libs/payment/types';

const PaymentMethodSwitcher = (props: {
  classes: any;
  t: TFunction;
  onChange: (value: string) => void;
  paymentMethodType: string;
  enabledPaymentMethods: Array<number>;
  disabled: boolean;
  registerNow: boolean;
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.paymentMethodType}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    {(props.enabledPaymentMethods || []).includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    ) ? (
      <FormControlLabel
        value="sepa_debit"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.sepa')}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
    {(props.enabledPaymentMethods || []).includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    ) ? (
      <FormControlLabel
        value="card"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.card')}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
    {!props.registerNow &&
    (props.enabledPaymentMethods || []).includes(
      PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
    ) ? (
      <FormControlLabel
        value="debt"
        control={<Radio color="primary" />}
        label={props.t('subscription:paymentMethod.bsportCredit')}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
    {props.registerNow ? (
      <FormControlLabel
        value="internal"
        control={<Radio color="primary" />}
        label={props.t(`invoice:paymentEngine.label.${PAYMENT_ENGINE_BSPORT}`)}
        labelPlacement="bottom"
        disabled={props.disabled}
      />
    ) : null}
  </RadioGroup>
);

const useStyles = makeStyles((theme: Theme) => ({
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  priceContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  priceInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  explainCredit: {
    padding: theme.spacing(2),
  },
  field: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  innerContainer: {
    marginTop: theme.spacing(2),
  },
  registerNowDate: {
    marginBottom: theme.spacing(1),
  },
  dialogPaper: {
    minWidth: '30vw',
  },
}));

type OwnProps = {
  open: boolean;
  selectedPPE: PlannedPaymentEvent;
  enabledPaymentMethods: Array<number>;
  requestSetupIntentSecret: () => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  refreshSavedPaymentMethodList: () => void;
  sepaDefaultName: string;
  sepaDefaultEmail: string;
  snackbarSuccessMsg: (msg: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  companyId: number;
  plannedPaymentEventLoading: boolean;
  onClose: () => void;
  dispApplyForAll: boolean;
  memberId: number;
  registerNow: boolean;
  processing: boolean;
  onSubmitChangePaymentMethodAndRegister: (
    ppeId: number,
    paymentMethod: number,
    selectedPmId: string,
    applyToAllFuturePayments: boolean,
    registerNow: boolean,
    extraData: any,
  ) => void;
};

type Props = OwnProps;

export const PlannedPaymentEventMethodSwitcherDialog = (props: Props) => {
  const [paymentMethod, setPaymentMethod] = useState(() => {
    // if PPE method is debt, and we want to register payment, set default payment method to CB
    if (
      props.registerNow &&
      props.selectedPPE.payment_method_identifier ===
        PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY
    )
      return PAYMENT_GROUP_METHOD_IDENTIFIER_CB;
    return props.selectedPPE.payment_method_identifier;
  });
  const [paymentMethodType, setPaymentMethodType] = useState(() => {
    // if PPE method is debt, and we want to register payment, set default payment method to CB
    if (
      props.registerNow &&
      props.selectedPPE.payment_method_identifier ===
        PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY
    )
      return 'card';
    switch (props.selectedPPE.payment_method_identifier) {
      case PAYMENT_GROUP_METHOD_IDENTIFIER_CB:
        return 'card';
      case PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA:
        return 'sepa_debit';
      case PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY:
        return 'debt';
      default:
        return 'internal';
    }
  });
  const [selectedSavedPaymentMethodId, setSelectedSavedPaymentMethodId] =
    useState(() => {
      if (
        props.registerNow &&
        props.selectedPPE._payment_backend_payment_method_id
      ) {
        const initialPaymentMethod = props.savedPaymentMethodList.find(
          (pm) =>
            pm.id === props.selectedPPE._payment_backend_payment_method_id,
        );
        if (initialPaymentMethod) return initialPaymentMethod.id;
      }
      return null;
    });
  const [applyToAllFuturePayments, setApplyToAllFuturePayments] =
    useState(false);

  const [internalDate, setInternalDate] = useState(moment().format());
  const [internalPaymentNote, setInternalPaymentNote] = React.useState('');

  const classes = useStyles();

  const { t } = useTranslation(['translation', 'invoice']);

  const onMethodTypeChange = (value: string) => {
    setPaymentMethodType(value);
    setSelectedSavedPaymentMethodId(null);
    switch (value) {
      case 'sepa_debit':
        setPaymentMethod(PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA);
        break;
      case 'card':
        setPaymentMethod(PAYMENT_GROUP_METHOD_IDENTIFIER_CB);
        break;
      case 'debt':
        setPaymentMethod(PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY);
        break;
      default:
        setPaymentMethod(null);
    }
  };

  const onSubmit = () => {
    let extraData;
    if (paymentMethodType === 'internal') {
      extraData = {
        date: internalDate,
        note: internalPaymentNote,
      };
    }
    props.onSubmitChangePaymentMethodAndRegister(
      props.selectedPPE.id,
      paymentMethod,
      selectedSavedPaymentMethodId,
      applyToAllFuturePayments,
      props.registerNow,
      extraData,
    );
  };

  return (
    <Dialog open={props.open} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle>
        {props.registerNow
          ? t('invoice:plannedPaymentEvent.actions.registerNow')
          : t('invoice:paymentMethod.title')}
      </DialogTitle>
      <DialogContent>
        {props.selectedPPE && (
          <>
            {props.registerNow && (
              <Typography className={classes.registerNowDate}>
                {t('invoice:plannedPaymentEvent.registerNowInitialData', {
                  date: moment(props.selectedPPE.future_date).format('L'),
                })}
              </Typography>
            )}
            {parseInt(props.selectedPPE.amount_cts) > 0 && (
              <div className={classes.priceContainer}>
                <div className={classes.priceInner}>
                  <Typography variant="h4">
                    {`${getCurrencyDisplayWithPrice(
                      parseFloat(
                        (
                          parseFloat(props.selectedPPE.amount_cts) / 100
                        ).toString(),
                      ).toFixed(2),
                    )}`}
                  </Typography>
                </div>
              </div>
            )}
            <PaymentMethodSwitcher
              classes={classes}
              t={t}
              paymentMethodType={paymentMethodType}
              onChange={onMethodTypeChange}
              enabledPaymentMethods={props.enabledPaymentMethods}
              disabled={props.plannedPaymentEventLoading}
              registerNow={props.registerNow}
            />
            <Divider />
            <div className={classes.explainCredit}>
              {paymentMethodType === 'debt' && (
                <div>
                  <Typography>
                    {t('invoice:paymentMethod.isInternalExplainFuturePayments')}
                  </Typography>
                </div>
              )}
              {['card', 'sepa_debit'].includes(paymentMethodType) && (
                <PaymentMethodList
                  showEmpty
                  memberId={props.memberId}
                  savedPaymentMethodList={props.savedPaymentMethodList}
                  selectedSavedPaymentMethodId={selectedSavedPaymentMethodId}
                  requestSetupIntentSecret={props.requestSetupIntentSecret}
                  refreshSavedPaymentMethodList={
                    props.refreshSavedPaymentMethodList
                  }
                  paymentMethodType={paymentMethodType}
                  onSelect={(method) => setSelectedSavedPaymentMethodId(method)}
                  disabled={props.plannedPaymentEventLoading}
                  detachPaymentMethodLoading={props.detachPaymentMethodLoading}
                  companyId={props.companyId}
                  detachPaymentMethod={props.detachPaymentMethod}
                  snackbarErrorMsg={props.snackbarErrorMsg}
                  snackbarSuccessMsg={props.snackbarSuccessMsg}
                  sepaDefaultName={props.sepaDefaultName}
                  sepaDefaultEmail={props.sepaDefaultEmail}
                />
              )}
              {paymentMethodType === 'internal' && (
                <>
                  {' '}
                  <FormControl className={classes.field}>
                    <InputLabel id="invoice:payment-method-select-label">
                      {t('invoice:paymentMethod.select.label')}
                    </InputLabel>
                    <Select
                      id="payment-method-select"
                      value={paymentMethod}
                      disabled={props.plannedPaymentEventLoading}
                      style={{ minWidth: 200 }}
                      onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentMethod(parseInt(ev.target.value))
                      }
                    >
                      {PAYMENT_GROUP_METHOD_BY_ENGINE[
                        PAYMENT_ENGINE_BSPORT
                      ].map((pm) => (
                        <MenuItem value={pm}>
                          {t(`invoice:paymentMethod.label.${pm}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className={classes.field}>
                    <DateInput
                      value={internalDate}
                      required
                      disabled={props.plannedPaymentEventLoading}
                      onChange={(dateMoment: MomentType) => {
                        setInternalDate(dateMoment.format());
                      }}
                      label={t('invoice:paymentPanel.date.label')}
                    />
                  </div>
                  <div className={classes.innerContainer}>
                    <TextField
                      value={internalPaymentNote}
                      variant="outlined"
                      fullWidth
                      onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                        setInternalPaymentNote(ev.target.value)
                      }
                      label={t('invoice:paymentPanel.paymentNote.label')}
                      helperText={t(
                        'invoice:paymentPanel.paymentNote.helperText',
                      )}
                      disabled={props.plannedPaymentEventLoading}
                    />
                  </div>
                </>
              )}
            </div>
            {!props.registerNow && props.dispApplyForAll && (
              <Checkbox
                checked={applyToAllFuturePayments}
                label={t(
                  'invoice:invoiceFuturePaymentsDialog.applyForAllFuturePayments',
                )}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setApplyToAllFuturePayments(ev.target.checked)
                }
              />
            )}
            <DialogActions>
              <Button color="secondary" onClick={props.onClose}>
                {t('translation:common.previous')}
              </Button>
              {props.processing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  disabled={
                    props.plannedPaymentEventLoading ||
                    paymentMethod === null ||
                    (['sepa_debit', 'card'].includes(paymentMethodType) &&
                      !selectedSavedPaymentMethodId)
                  }
                  onClick={onSubmit}
                >
                  {t('translation:common.confirm')}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlannedPaymentEventMethodSwitcherDialog;
