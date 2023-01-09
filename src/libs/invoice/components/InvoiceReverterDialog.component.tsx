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

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (
    reverse_type: InvoiceReverseMethod,
    payment_method_to_reverse: number,
    options?: OptionCallback,
  ) => void;
  payments: Array<Payment>;
  invoice: Invoice;
};

export const InvoiceReverterDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [processing, setProcessing] = React.useState(false);

  const [reverseMethod, handleChangeReverseMethod] =
    React.useState<InvoiceReverseMethod>(REVERSE_ON_NEW_PAYMENT_METHOD);

  const [paymentMethodSelected, selectPaymentMethod] = React.useState(
    PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  );

  const [allowedReverseMethods, setAllowedReverseMethods] =
    React.useState<InvoiceAllowedReverseMethods>({});
  const [allowedReverseMethodsLoading, setAllowedReverseMethodsLoading] =
    React.useState(false);

  React.useEffect(() => {
    const fetchAllowedReverseTypes = async () => {
      setAllowedReverseMethodsLoading(true);
      fetchInvoiceAllowedReverseTypesAPI(props.invoice.uuid)
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

    if (props.open) fetchAllowedReverseTypes();
  }, [props.invoice.uuid, props.open]);

  const reverseOnPaymentMethodAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.allowed,
    [allowedReverseMethods],
  );

  const reverseOnDebtAllowed = React.useMemo(
    () => allowedReverseMethods[REVERSE_ON_DEBT]?.allowed,
    [allowedReverseMethods],
  );

  const actionButtons = (
    <DialogActions>
      <Button
        disabled={processing}
        onClick={props.onClose}
        className={classes.textSecondary}
      >
        {t('revert.dialog.actions.cancel')}
      </Button>
      {processing ? (
        <CircularProgress />
      ) : (
        <Button
          color="primary"
          disabled={allowedReverseMethodsLoading}
          onClick={() => {
            setProcessing(true);
            props.onSubmit(reverseMethod, paymentMethodSelected, {
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        >
          {t('revert.dialog.actions.confirm')}
        </Button>
      )}
    </DialogActions>
  );

  if (allowedReverseMethodsLoading)
    return (
      <Dialog open={!!props.open}>
        <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
        <DialogContent>
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </DialogContent>
        {actionButtons}
      </Dialog>
    );

  if (props.payments.length === 0)
    return (
      <Dialog open={!!props.open}>
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
    <Dialog open={!!props.open}>
      <DialogTitle>{t('revert.dialog.title')}</DialogTitle>
      <DialogContent>
        {!reverseOnPaymentMethodAllowed &&
          allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.error_code ===
            INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE && (
            <Alert severity="warning" className={classes.warning}>
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
              value={`${paymentMethodSelected}`}
              style={{ minWidth: 200, marginTop: 16 }}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                selectPaymentMethod(parseInt(ev.target.value, 10))
              }
            >
              {PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT].map(
                (pm) => (
                  <MenuItem value={pm} key={pm}>
                    {t(`paymentMethod.label.${pm}`)}
                  </MenuItem>
                ),
              )}
            </Select>
          </Collapse>
        </div>

        {actionButtons}
      </DialogContent>
    </Dialog>
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
}));

export default InvoiceReverterDialog;
