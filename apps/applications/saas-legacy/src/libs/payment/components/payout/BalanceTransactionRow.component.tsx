import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import type {
  BalanceTransaction,
  BalanceTransactionDisplayType,
} from '../../types';
import ReconciliationStatusCell from './ReconciliationStatusCell.component';
import TapTooltip from './TapTooltip.component';

type DisplayTypeConfig = {
  labelKey: string;
  descriptionKey: string;
};

const DISPLAY_TYPE_CONFIG: Record<
  BalanceTransactionDisplayType,
  DisplayTypeConfig
> = {
  payment: {
    labelKey: 'payout.displayType.payment.label',
    descriptionKey: 'payout.displayType.payment.description',
  },
  refund: {
    labelKey: 'payout.displayType.refund.label',
    descriptionKey: 'payout.displayType.refund.description',
  },
  dispute: {
    labelKey: 'payout.displayType.dispute.label',
    descriptionKey: 'payout.displayType.dispute.description',
  },
  failed_direct_debit_original: {
    labelKey: 'payout.displayType.failed_direct_debit_original.label',
    descriptionKey:
      'payout.displayType.failed_direct_debit_original.description',
  },
  failed_direct_debit_reversal: {
    labelKey: 'payout.displayType.failed_direct_debit_reversal.label',
    descriptionKey:
      'payout.displayType.failed_direct_debit_reversal.description',
  },
  balance_transfer: {
    labelKey: 'payout.displayType.balance_transfer.label',
    descriptionKey: 'payout.displayType.balance_transfer.description',
  },
  balance_transfer_refund: {
    labelKey: 'payout.displayType.balance_transfer_refund.label',
    descriptionKey: 'payout.displayType.balance_transfer_refund.description',
  },
  adjustment: {
    labelKey: 'payout.displayType.adjustment.label',
    descriptionKey: 'payout.displayType.adjustment.description',
  },
  application_fee: {
    labelKey: 'payout.displayType.application_fee.label',
    descriptionKey: 'payout.displayType.application_fee.description',
  },
  application_fee_refund: {
    labelKey: 'payout.displayType.application_fee_refund.label',
    descriptionKey: 'payout.displayType.application_fee_refund.description',
  },
  payout_failure: {
    labelKey: 'payout.displayType.payout_failure.label',
    descriptionKey: 'payout.displayType.payout_failure.description',
  },
  payout_cancel: {
    labelKey: 'payout.displayType.payout_cancel.label',
    descriptionKey: 'payout.displayType.payout_cancel.description',
  },
  other: {
    labelKey: 'payout.displayType.other.label',
    descriptionKey: 'payout.displayType.other.description',
  },
};

// ---------------------------------------------------------------------------
// InvoiceCell
// ---------------------------------------------------------------------------

const InvoiceCell: React.FC<{ bt: BalanceTransaction }> = ({ bt }) => {
  const classes = useInvoiceCellStyles();
  const { t } = useTranslation(['payment']);
  const { reconciled_bsport_payments: payments } = bt;

  if (payments.length === 0) {
    return (
      <div className={classes.stack}>
        {bt.reversal_balance_transaction_payout && (
          <Typography color="textSecondary" variant="caption">
            {t('payout.balanceTransaction.reversalInPayout', {
              readable_identifier:
                bt.reversal_balance_transaction_payout.readable_identifier,
            })}
          </Typography>
        )}
        {bt.reversal_of_balance_transaction_id != null && (
          <Typography color="textSecondary" variant="caption">
            {t('payout.balanceTransaction.reversalOf', {
              id: bt.reversal_of_balance_transaction_id,
              payoutInfo: bt.reversal_of_balance_transaction_payout
                ? t('payout.balanceTransaction.reversalOfPayoutInfo', {
                    readable_identifier:
                      bt.reversal_of_balance_transaction_payout
                        .readable_identifier,
                  })
                : '',
            })}
          </Typography>
        )}
        {bt.reconciled_bsport_payout && (
          <Typography color="textSecondary" variant="caption">
            {t('payout.balanceTransaction.fromPayout', {
              readable_identifier:
                bt.reconciled_bsport_payout.readable_identifier,
            })}
          </Typography>
        )}
      </div>
    );
  }

  if (payments.length === 1) {
    const p = payments[0];
    return (
      <Button
        color="primary"
        component="a"
        href={`/invoice/${p.invoice.uuid}`}
        rel="noopener noreferrer"
        size="small"
        target="_blank"
        variant="text"
      >
        {p.invoice.public_identifier}
      </Button>
    );
  }

  return (
    <div className={classes.stack}>
      {payments.map((p, idx) => (
        <React.Fragment key={p.id}>
          {idx > 0 && <Divider />}
          <div className={classes.paymentLine}>
            {p.payment_received ? (
              <CheckIcon className={classes.received} fontSize="small" />
            ) : (
              <CloseIcon className={classes.notReceived} fontSize="small" />
            )}
            <Typography variant="caption">{p.price}</Typography>
            <Button
              color="primary"
              component="a"
              href={`/invoice/${p.invoice.uuid}`}
              rel="noopener noreferrer"
              size="small"
              target="_blank"
              variant="text"
            >
              {p.invoice.public_identifier}
            </Button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const useInvoiceCellStyles = makeStyles((theme) => ({
  stack: { display: 'flex', flexDirection: 'column' },
  paymentLine: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  received: { color: theme.palette.success?.main ?? 'green' },
  notReceived: { color: theme.palette.error.main },
}));

// ---------------------------------------------------------------------------
// BalanceTransactionRow
// ---------------------------------------------------------------------------

type Props = {
  balanceTransaction: BalanceTransaction;
  isMobile: boolean;
};

const BalanceTransactionRow: React.FC<Props> = ({
  balanceTransaction: bt,
  isMobile,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);

  const amountDisplay = getCurrencyDisplayWithPrice(
    (bt.amount_cts / 100).toFixed(2),
  );
  const netDisplay = getCurrencyDisplayWithPrice((bt.net_cts / 100).toFixed(2));

  const config =
    DISPLAY_TYPE_CONFIG[bt.display_type] ?? DISPLAY_TYPE_CONFIG.other;
  const { labelKey, descriptionKey } = config;

  const displayTypeCell = (
    <div className={classes.displayTypeCell}>
      <Typography className={classes.displayTypeLabel} variant="caption">
        {t(labelKey)}
      </Typography>
      <TapTooltip
        isMobile={isMobile}
        placement="top"
        title={t(descriptionKey) ?? ''}
      >
        <InfoOutlinedIcon className={classes.infoIcon} fontSize="small" />
      </TapTooltip>
    </div>
  );

  const amountCell = (
    <div className={classes.amountCell}>
      <Typography variant="body2">{amountDisplay}</Typography>
      {bt.fee_cts !== 0 && (
        <Typography color="textSecondary" variant="caption">
          {t('payout.balanceTransaction.net', { amount: netDisplay })}
        </Typography>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Paper className={classes.mobileCard} variant="outlined">
        {/* Type label + reconciliation status on the same line */}
        <div className={classes.mobileCardRow}>
          {displayTypeCell}
          <ReconciliationStatusCell
            isMobile
            errorType={bt.error_type}
            status={bt.reconciliation_status}
          />
        </div>
        {/* Payment method */}
        {bt.source_payment_method && (
          <Typography color="textSecondary" variant="caption">
            {bt.source_payment_method}
          </Typography>
        )}
        {/* Amount */}
        {amountCell}
        {/* Invoice(s) */}
        <InvoiceCell bt={bt} />
      </Paper>
    );
  }

  return (
    <TableRow>
      <TableCell>{displayTypeCell}</TableCell>
      <TableCell>
        <Typography variant="caption">
          {bt.source_payment_method || '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <ReconciliationStatusCell
          errorType={bt.error_type}
          isMobile={false}
          status={bt.reconciliation_status}
        />
      </TableCell>
      <TableCell>{amountCell}</TableCell>
      <TableCell>
        <InvoiceCell bt={bt} />
      </TableCell>
    </TableRow>
  );
};

const useStyles = makeStyles((theme) => ({
  displayTypeCell: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  displayTypeLabel: {
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  infoIcon: {
    color: theme.palette.text.hint,
    cursor: 'default',
  },
  amountCell: { display: 'flex', flexDirection: 'column' },
  mobileCard: {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
  },
  mobileCardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default BalanceTransactionRow;
