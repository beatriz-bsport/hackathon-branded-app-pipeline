import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
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
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
} from '@bsport/common/lib/master-data/payment-group';
import { INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE } from '@bsport/common/lib/master-data/error-codes/payment';
import { OptionCallback } from '../../../state/types';
import {
  InvoiceAllowedReverseMethods,
  Invoice,
  InvoiceReverseMethod,
} from '#libs/invoice/types';

import { fetchInvoiceAllowedReverseTypes as fetchInvoiceAllowedReverseTypesAPI } from '#libs/invoice/api';

import type { Payment } from '#libs/payment/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open?: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSubmit: (
    reverse_type: InvoiceReverseMethod,
    payment_method_to_reverse: number,
    options?: OptionCallback,
  ) => void;
  payments: Array<Payment>;
  invoice: Invoice;
  isAutoDebitActivated?: boolean;
  isInChurn: boolean;
  refundBlockingLimit?: number;
  stripeBalanceSum?: number;
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
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [processing, setProcessing] = React.useState(false);

  const [reverseMethod, handleChangeReverseMethod] =
    React.useState<InvoiceReverseMethod>(REVERSE_ON_NEW_PAYMENT_METHOD);

  const [paymentMethodSelected, selectPaymentMethod] = React.useState(
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  );

  const [
    isConfirmWhenAutoDebitModalOpened,
    setIsConfirmWhenAutoDebitModalOpened,
  ] = React.useState<boolean>(false);

  const [isBlockedModalOpened, setIsBlockedModalOpened] =
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

  const reverseOnDebtAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_DEBT]?.allowed,
    [allowedReverseMethods],
  );

  const currencyDisplay = React.useMemo(() => getCurrencyDisplay(), []);

  const refundAmount = (invoice.amount_paid_cts / 100).toFixed(2);

  const isReachingRefundLimit = isInChurn
    ? stripeBalanceSum - invoice.amount_paid_cts / 100 < 0
    : stripeBalanceSum - invoice.amount_paid_cts / 100 < -refundBlockingLimit;

  const submitReverseInvoice = React.useCallback(() => {
    setProcessing(true);
    onSubmit(reverseMethod, paymentMethodSelected, {
      onSuccess: () => setProcessing(false),
      onError: () => setProcessing(false),
    });
  }, [onSubmit, paymentMethodSelected, reverseMethod]);

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
    } else {
      submitReverseInvoice();
    }
  }, [
    allowedReverseMethodsLoading,
    isAutoDebitActivated,
    isReachingRefundLimit,
    onClose,
    payments.length,
    reverseMethod,
    submitReverseInvoice,
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
          disabled={allowedReverseMethodsLoading}
          onClick={onClickConfirm}
        >
          {t('revert.dialog.actions.confirm')}
        </Button>
      )}
    </DialogActions>
  );

  if (allowedReverseMethodsLoading)
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

  if (payments.length === 0)
    return (
      <Dialog open={!!open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('revert.content.explainEmptyPayment')}
          </DialogContentText>
        </DialogContent>
        {actionButtons}
      </Dialog>
    );

  return (
    <>
      <GenericResponsiveDialog open={!!open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          {!reverseOnPaymentMethodAllowed &&
            allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.error_code ===
              INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE && (
              <Alert className={classes.warning} severity="warning">
                {t('revert.warning.interac')}
              </Alert>
            )}
          <div
            className={classNames(classes.radioContainer, {
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
          {reverseOnDebtAllowed && (
            <div className={classes.radioContainer}>
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
          )}
          <div className={classes.radioContainer}>
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
              refundAmount,
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
    marginBottom: theme.spacing(3),
  },
  helperText: {
    whiteSpace: 'pre-line',
  },
}));

export default InvoiceReverterDialog;
