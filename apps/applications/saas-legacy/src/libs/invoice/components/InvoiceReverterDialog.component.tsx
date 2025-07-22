import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import {
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
} from '@bsport/common/lib/master-data/payment-group.js';
import {
  InvoiceAllowedReverseMethods,
  Invoice,
  InvoiceReverseMethod,
} from '#src/libs/invoice/types';

import { fetchInvoiceAllowedReverseTypes as fetchInvoiceAllowedReverseTypesAPI } from '#src/libs/invoice/api';

import { SEPA as PAYMENT_METHOD_SEPA } from '@bsport/common/lib/master-data/payment-methods.js';

import type { Payment } from '#src/libs/payment/types';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { OptionCallback } from '#src/state/types';
import InvoiceReverterMeansAlerting from '#src/libs/invoice/components/InvoiceReverterMeansAlerting.component';
import InvoiceRevertReasonField from './InvoiceRevertReasonField.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSubmit: (
    reverse_type: InvoiceReverseMethod,
    payment_method_to_reverse: number,
    revert_reason: string,
    options?: OptionCallback,
  ) => void;
  payments: Array<Payment>;
  invoice: Invoice;
  isAutoDebitActivated?: boolean;
  isInChurn: boolean;
  refundBlockingLimit?: number;
  stripeBalanceSum?: number;
  isRevertReasonRequired: boolean;
  isInvoiceConfigurationLoading?: boolean;
};

export const InvoiceReverterDialog = ({
  open,
  onClose,
  onOpen,
  onSubmit,
  payments,
  invoice,
  isAutoDebitActivated,
  isInChurn,
  refundBlockingLimit,
  stripeBalanceSum,
  isRevertReasonRequired,
  isInvoiceConfigurationLoading,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [processing, setProcessing] = React.useState(false);

  const [reverseMethod, handleChangeReverseMethod] =
    React.useState<InvoiceReverseMethod>(REVERSE_ON_NEW_PAYMENT_METHOD);

  const [revertReason, handleRevertReason] = React.useState('');

  const [paymentMethodSelected, selectPaymentMethod] = React.useState(
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  );

  const [
    isConfirmWhenAutoDebitModalOpened,
    setIsConfirmWhenAutoDebitModalOpened,
  ] = React.useState<boolean>(false);

  const [isBlockedModalOpened, setIsBlockedModalOpened] =
    React.useState<boolean>(false);

  const [isSEPARefundModalOpened, setIsSEPARefundModalOpened] =
    React.useState<boolean>(false);

  const [allowedReverseMethods, setAllowedReverseMethods] =
    React.useState<InvoiceAllowedReverseMethods>({});
  const [allowedReverseMethodsLoading, setAllowedReverseMethodsLoading] =
    React.useState(false);

  React.useEffect(() => {
    const fetchAllowedReverseTypes = async () => {
      setAllowedReverseMethodsLoading(true);
      fetchInvoiceAllowedReverseTypesAPI(invoice.uuid)
        .then((response) => {
          setAllowedReverseMethods(response.data);
          // Init reverseMethod with the first allowed method
          [
            REVERSE_ON_PAYMENT_METHOD,
            REVERSE_ON_DEBT,
            REVERSE_ON_NEW_PAYMENT_METHOD,
          ].every((method: InvoiceReverseMethod) => {
            if (response.data[method]?.allowed) {
              handleChangeReverseMethod(method);
              // returning false stops the loop
              return false;
            }
            return true;
          });
          setAllowedReverseMethodsLoading(false);
        })
        .catch((err) => console.error(err));
    };

    if (open) fetchAllowedReverseTypes();
  }, [invoice.uuid, open]);

  const reverseOnPaymentMethodAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.allowed,
    [allowedReverseMethods],
  );

  const pricePaidAndProcessing = React.useMemo(
    () =>
      payments.reduce((sum, payment) => {
        if (payment.payment_received != false)
          return sum + parseInt(payment.price, 10);
        return sum;
      }, 0),
    [payments],
  );

  React.useEffect(() => {
    // If the invoice has a price_payed of 0, we won't show the dialog to choose
    // the payment method to revert the invoice on. Though, we might have non null payments on invoice
    // We need to refund on same payment method for PayPal refunds proceeded from PayPal platform.
    if (pricePaidAndProcessing === 0 && reverseOnPaymentMethodAllowed) {
      handleChangeReverseMethod(REVERSE_ON_PAYMENT_METHOD);
    }
  }, [reverseOnPaymentMethodAllowed, pricePaidAndProcessing]);

  const reverseOnDebtAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_DEBT]?.allowed,
    [allowedReverseMethods],
  );

  const reverseOnNewPaymentMethodAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_NEW_PAYMENT_METHOD]?.allowed,
    [allowedReverseMethods],
  );

  const currencyDisplay = React.useMemo(() => getCurrencyDisplay(), []);

  const stripeAmountPaid = React.useMemo(
    () =>
      payments.reduce((sum, payment) => {
        if (
          payment.payment_engine === PAYMENT_ENGINE_STRIPE &&
          payment.payment_received != false
        )
          return sum + parseInt(payment.price, 10);
        return sum;
      }, 0),
    [payments],
  );

  const hasAtLeastOneSEPAPayment = React.useMemo(
    () =>
      payments.some(
        (payment) => payment.payment_method === PAYMENT_METHOD_SEPA.id,
      ),
    [payments],
  );

  const isReachingRefundLimit = isInChurn
    ? stripeBalanceSum - stripeAmountPaid < 0
    : stripeBalanceSum - stripeAmountPaid < -refundBlockingLimit;

  const submitReverseInvoice = React.useCallback(() => {
    setProcessing(true);
    onSubmit(reverseMethod, paymentMethodSelected, revertReason, {
      onSuccess: () => setProcessing(false),
      onError: () => setProcessing(false),
    });
  }, [onSubmit, paymentMethodSelected, reverseMethod, revertReason]);

  const handleCloseAutoDebitModal = React.useCallback(() => {
    onOpen();
    setIsConfirmWhenAutoDebitModalOpened(false);
  }, [onOpen]);

  const handleSubmitAutoDebitModal = React.useCallback(() => {
    setIsConfirmWhenAutoDebitModalOpened(false);
    submitReverseInvoice();
  }, [submitReverseInvoice]);

  const handleCloseBlockedModal = React.useCallback(() => {
    onOpen();
    setIsBlockedModalOpened(false);
  }, [onOpen]);

  const handleCloseSEPARefundModal = React.useCallback(() => {
    setIsSEPARefundModalOpened(false);
  }, []);

  const handleConfirmSEPARefund = React.useCallback(() => {
    submitReverseInvoice();
    setIsSEPARefundModalOpened(false);
  }, [submitReverseInvoice]);

  const shouldEnterRevertReason = React.useMemo(
    () => isRevertReasonRequired && revertReason.length === 0,
    [isRevertReasonRequired, revertReason],
  );

  const onClickConfirm = React.useCallback(() => {
    if (
      !allowedReverseMethodsLoading &&
      payments.length !== 0 &&
      reverseMethod === REVERSE_ON_PAYMENT_METHOD &&
      isReachingRefundLimit
    ) {
      onClose();
      if (isAutoDebitActivated) {
        setIsConfirmWhenAutoDebitModalOpened(true);
      } else {
        // In this case the client is going to reach the refund limit if the invoice is refunded, so the refund is blocked.
        setIsBlockedModalOpened(true);
      }
      return;
    }
    // Display a disclaimer about the time needed for a SEPA refund, to prevent double SEPA refund issue
    // Should not be displayed if the price_payed is 0, as it means the refund has already been made (through a dispute for instance)
    // In that case, we just cancel the invoice as we would do for an invoice with no payments
    if (
      reverseMethod === REVERSE_ON_PAYMENT_METHOD &&
      hasAtLeastOneSEPAPayment &&
      pricePaidAndProcessing > 0
    ) {
      onClose();
      setIsSEPARefundModalOpened(true);
      return;
    }

    submitReverseInvoice();
  }, [
    allowedReverseMethodsLoading,
    payments.length,
    reverseMethod,
    isReachingRefundLimit,
    hasAtLeastOneSEPAPayment,
    pricePaidAndProcessing,
    submitReverseInvoice,
    onClose,
    isAutoDebitActivated,
  ]);

  const actionButtons = (
    <DialogActions>
      <Button
        className={classes.textSecondary}
        disabled={processing}
        onClick={onClose}
      >
        {t('revert.dialog.actions.cancel')}
      </Button>
      {processing ? (
        <CircularProgress />
      ) : (
        <Button
          color="primary"
          disabled={allowedReverseMethodsLoading || shouldEnterRevertReason}
          onClick={onClickConfirm}
        >
          {t('revert.dialog.actions.confirm')}
        </Button>
      )}
    </DialogActions>
  );

  if (allowedReverseMethodsLoading || isInvoiceConfigurationLoading)
    return (
      <Dialog open={!!open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </DialogContent>
        {actionButtons}
      </Dialog>
    );

  // The invoice can have non null Payments but a price_payed of 0 if for instance
  // a full refund has been made on PayPal platform. In this case, we can't refund the invoice again.
  if (pricePaidAndProcessing === 0) {
    return (
      <Dialog open={!!open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('revert.content.explainEmptyPayment')}
          </DialogContentText>
          <InvoiceRevertReasonField
            handleRevertReason={handleRevertReason}
            required={shouldEnterRevertReason}
            revertReason={revertReason}
          />
        </DialogContent>
        {actionButtons}
      </Dialog>
    );
  }

  return (
    <>
      <GenericResponsiveDialog open={!!open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          <InvoiceReverterMeansAlerting
            allowedReverseMethods={allowedReverseMethods}
            reverseOnDebtAllowed={reverseOnDebtAllowed}
            reverseOnNewPaymentMethodAllowed={reverseOnNewPaymentMethodAllowed}
            reverseOnPaymentMethodAllowed={reverseOnPaymentMethodAllowed}
          />
          <div
            className={clsx(classes.radioContainer, {
              [classes.disabledContainer]: !reverseOnPaymentMethodAllowed,
            })}
          >
            <div className={classes.row}>
              <Radio
                checked={reverseMethod === REVERSE_ON_PAYMENT_METHOD}
                disabled={!reverseOnPaymentMethodAllowed || processing}
                onChange={() => {
                  handleChangeReverseMethod(REVERSE_ON_PAYMENT_METHOD);
                }}
                value={REVERSE_ON_PAYMENT_METHOD}
              />
              <Typography>
                {t(`revert.content.label.${REVERSE_ON_PAYMENT_METHOD}`)}
              </Typography>
            </div>
            <Typography variant="caption">
              {t(`revert.content.explain.${REVERSE_ON_PAYMENT_METHOD}`)}
            </Typography>
          </div>
          <div
            className={clsx(classes.radioContainer, {
              [classes.disabledContainer]: !reverseOnDebtAllowed,
            })}
          >
            <div className={classes.row}>
              <Radio
                checked={reverseMethod === REVERSE_ON_DEBT}
                disabled={processing}
                onChange={() => handleChangeReverseMethod(REVERSE_ON_DEBT)}
                value={REVERSE_ON_DEBT}
              />
              <Typography>
                {t(`revert.content.label.${REVERSE_ON_DEBT}`)}
              </Typography>
            </div>
            <Typography variant="caption">
              {t(`revert.content.explain.${REVERSE_ON_DEBT}`)}
            </Typography>
          </div>
          <div
            className={clsx(classes.radioContainer, {
              [classes.disabledContainer]: !reverseOnNewPaymentMethodAllowed,
            })}
          >
            <div className={classes.row}>
              <Radio
                checked={reverseMethod === REVERSE_ON_NEW_PAYMENT_METHOD}
                disabled={processing}
                onChange={() =>
                  handleChangeReverseMethod(REVERSE_ON_NEW_PAYMENT_METHOD)
                }
                value={REVERSE_ON_NEW_PAYMENT_METHOD}
              />
              <Typography>
                {t(`revert.content.label.${REVERSE_ON_NEW_PAYMENT_METHOD}`)}
              </Typography>
            </div>
            <Typography variant="caption">
              {t(`revert.content.explain.${REVERSE_ON_NEW_PAYMENT_METHOD}`)}
            </Typography>
            <Collapse in={reverseMethod === REVERSE_ON_NEW_PAYMENT_METHOD}>
              <Select
                id="payment-method-select"
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  selectPaymentMethod(parseInt(ev.target.value, 10))
                }
                style={{ minWidth: 200, marginTop: 16 }}
                value={`${paymentMethodSelected}`}
              >
                {PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT].map(
                  (pm) => (
                    <MenuItem key={pm} value={pm}>
                      {t(`paymentMethod.label.${pm}`)}
                    </MenuItem>
                  ),
                )}
              </Select>
            </Collapse>
          </div>
          <InvoiceRevertReasonField
            handleRevertReason={handleRevertReason}
            required={shouldEnterRevertReason}
            revertReason={revertReason}
          />
          {actionButtons}
        </DialogContent>
      </GenericResponsiveDialog>

      <GenericResponsiveDialog
        // @ts-expect-error
        className={classes.container}
        maxWidth="sm"
        onClose={handleCloseAutoDebitModal}
        open={isConfirmWhenAutoDebitModalOpened}
      >
        <DialogTitle id="form-dialog-title">
          {t('revert.autoDebitDialog.title')}
        </DialogTitle>
        <DialogContent className={classes.helperText}>
          <Alert className={classes.alert} severity="warning">
            {t('revert.blockedDialog.alert', {
              // In the case where the company is in churn, the refund limit is 0 (under it, they will be debited)
              refundBlockingLimit: 0,
              currencyDisplay,
            })}
          </Alert>
          <Typography>
            {t('revert.autoDebitDialog.helper', {
              refundAmount: stripeAmountPaid.toFixed(2),
              currencyDisplay,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseAutoDebitModal}>
            {t('revert.dialog.actions.cancel')}
          </Button>
          <Button color="primary" onClick={handleSubmitAutoDebitModal}>
            {t('revert.dialog.actions.confirm')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>

      <GenericResponsiveDialog
        // @ts-expect-error
        className={classes.container}
        maxWidth="sm"
        onClose={handleCloseBlockedModal}
        open={isBlockedModalOpened}
      >
        <DialogTitle id="form-dialog-title">
          {t('revert.blockedDialog.title')}
        </DialogTitle>
        <DialogContent className={classes.helperText}>
          <Alert className={classes.alert} severity="warning">
            {t('revert.blockedDialog.alert', {
              // In the case where the company is in churn, the refund limit is 0
              refundBlockingLimit: isInChurn ? 0 : refundBlockingLimit,
              currencyDisplay,
            })}
          </Alert>
          <Typography>{t('revert.blockedDialog.helper')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseBlockedModal}>
            {t('revert.dialog.actions.cancel')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
      <GenericResponsiveDialog
        maxWidth="sm"
        onClose={handleCloseSEPARefundModal}
        open={isSEPARefundModalOpened}
      >
        <DialogTitle id="form-dialog-title">
          {t('revert.SEPARefundDialog.title')}
        </DialogTitle>
        <DialogContent className={classes.helperText}>
          <Alert className={classes.alert} severity="warning">
            {t('revert.SEPARefundDialog.alert')}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.textSecondary}
            onClick={handleCloseSEPARefundModal}
          >
            {t('revert.SEPARefundDialog.actions.cancel')}
          </Button>
          <Button color="primary" onClick={handleConfirmSEPARefund}>
            {t('revert.SEPARefundDialog.actions.confirm')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  radioContainer: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  },
  disabledContainer: {
    opacity: 0.5,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(10),
  },
  warning: {
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  alert: {
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  helperText: {
    whiteSpace: 'pre-line',
  },
}));

export default InvoiceReverterDialog;
