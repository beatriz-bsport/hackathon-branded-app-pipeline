import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import {
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} from '@bsport/common/lib/master-data/payment-group';
import {
  INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE,
  INVOICE_NO_REFUND_ON_SAME_PAYMENT_METHOD_IF_NO_ONLINE_PAYMENT,
  INVOICE_NO_DEBT_REFUND_ON_PENDING_PAYMENT,
  INVOICE_NO_MANUAL_REFUND_ON_PENDING_PAYMENT,
  INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER,
} from '@bsport/common/lib/master-data/error-codes/payment';
import { InvoiceAllowedReverseMethods } from '#src/libs/invoice/types';

interface InvoiceReverterDialogProps {
  reverseOnPaymentMethodAllowed: boolean;
  reverseOnDebtAllowed: boolean;
  reverseOnNewPaymentMethodAllowed: boolean;
  allowedReverseMethods: InvoiceAllowedReverseMethods;
}

const InvoiceReverterMeansAlerting: React.FC<InvoiceReverterDialogProps> = ({
  reverseOnPaymentMethodAllowed,
  reverseOnDebtAllowed,
  reverseOnNewPaymentMethodAllowed,
  allowedReverseMethods,
}) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();

  const [alertMessage, setAlertMessage] = React.useState('');

  React.useEffect(() => {
    // The three following if blocks are disjoint, we can only have one of them at a time
    switch (true) {
      case !reverseOnPaymentMethodAllowed &&
        allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.error_code ===
          INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE:
        setAlertMessage(
          t(
            `revert.warning.${INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE}`,
          ),
        );
        break;
      case !reverseOnPaymentMethodAllowed &&
        allowedReverseMethods[REVERSE_ON_PAYMENT_METHOD]?.error_code ==
          INVOICE_NO_REFUND_ON_SAME_PAYMENT_METHOD_IF_NO_ONLINE_PAYMENT:
        setAlertMessage(
          t(
            `revert.warning.${INVOICE_NO_REFUND_ON_SAME_PAYMENT_METHOD_IF_NO_ONLINE_PAYMENT}`,
          ),
        );
        break;
      case !reverseOnDebtAllowed &&
        allowedReverseMethods[REVERSE_ON_DEBT]?.error_code ==
          INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER:
        setAlertMessage(
          t(`revert.warning.${INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER}`),
        );
        break;
      case !reverseOnDebtAllowed &&
        !reverseOnNewPaymentMethodAllowed &&
        allowedReverseMethods[REVERSE_ON_NEW_PAYMENT_METHOD]?.error_code ==
          INVOICE_NO_MANUAL_REFUND_ON_PENDING_PAYMENT &&
        allowedReverseMethods[REVERSE_ON_DEBT]?.error_code ==
          INVOICE_NO_DEBT_REFUND_ON_PENDING_PAYMENT:
        setAlertMessage(t(`revert.warning.debtAndNewPaymentMethodNotAllowed`));
        break;
      default:
        break;
    }
  }, [
    reverseOnPaymentMethodAllowed,
    reverseOnDebtAllowed,
    reverseOnNewPaymentMethodAllowed,
    allowedReverseMethods,
    t,
  ]);

  return (
    <>
      {alertMessage && (
        <Alert className={classes.warning} severity="warning">
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  warning: {
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));
export default React.memo(InvoiceReverterMeansAlerting);
