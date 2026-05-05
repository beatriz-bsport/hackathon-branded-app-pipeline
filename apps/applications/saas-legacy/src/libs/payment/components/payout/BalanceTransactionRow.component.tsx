import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import { formatAsDatetime } from '../../../../utils/datetime';
import { useSafeFlag } from '../../../../utils/feature-flag/flagWrapper';
import { FeatureFlags } from '../../../../utils/feature-flag/flags';
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
    labelKey: 'displayType.payment.label',
    descriptionKey: 'displayType.payment.description',
  },
  refund: {
    labelKey: 'displayType.refund.label',
    descriptionKey: 'displayType.refund.description',
  },
  dispute: {
    labelKey: 'displayType.dispute.label',
    descriptionKey: 'displayType.dispute.description',
  },
  failed_direct_debit_original: {
    labelKey: 'displayType.failed_direct_debit_original.label',
    descriptionKey: 'displayType.failed_direct_debit_original.description',
  },
  failed_direct_debit_reversal: {
    labelKey: 'displayType.failed_direct_debit_reversal.label',
    descriptionKey: 'displayType.failed_direct_debit_reversal.description',
  },
  balance_transfer: {
    labelKey: 'displayType.balance_transfer.label',
    descriptionKey: 'displayType.balance_transfer.description',
  },
  balance_transfer_refund: {
    labelKey: 'displayType.balance_transfer_refund.label',
    descriptionKey: 'displayType.balance_transfer_refund.description',
  },
  adjustment: {
    labelKey: 'displayType.adjustment.label',
    descriptionKey: 'displayType.adjustment.description',
  },
  application_fee: {
    labelKey: 'displayType.application_fee.label',
    descriptionKey: 'displayType.application_fee.description',
  },
  application_fee_refund: {
    labelKey: 'displayType.application_fee_refund.label',
    descriptionKey: 'displayType.application_fee_refund.description',
  },
  payout_failure: {
    labelKey: 'displayType.payout_failure.label',
    descriptionKey: 'displayType.payout_failure.description',
  },
  payout_cancel: {
    labelKey: 'displayType.payout_cancel.label',
    descriptionKey: 'displayType.payout_cancel.description',
  },
  other: {
    labelKey: 'displayType.other.label',
    descriptionKey: 'displayType.other.description',
  },
};

// ---------------------------------------------------------------------------
// InvoiceCell
// ---------------------------------------------------------------------------

const InvoiceCell: React.FC<{
  balanceTransaction: BalanceTransaction;
  isMobile: boolean;
}> = ({ balanceTransaction, isMobile }) => {
  const classes = useInvoiceCellStyles();
  const { t } = useTranslation(['b2b_payout']);
  const { reconciled_bsport_payments: payments } = balanceTransaction;

  if (payments.length === 0) {
    return (
      <div className={classes.stack}>
        {balanceTransaction.reversal_balance_transaction_payout && (
          <Typography color="textSecondary" variant="caption">
            {t('balanceTransaction.reversalInPayout', {
              readable_identifier:
                balanceTransaction.reversal_balance_transaction_payout
                  .readable_identifier,
            })}
          </Typography>
        )}
        {balanceTransaction.reversal_of_balance_transaction_id != null && (
          <Typography color="textSecondary" variant="caption">
            {t('balanceTransaction.reversalOf', {
              id: balanceTransaction.reversal_of_balance_transaction_id,
              payoutInfo:
                balanceTransaction.reversal_of_balance_transaction_payout
                  ? t('balanceTransaction.reversalOfPayoutInfo', {
                      readable_identifier:
                        balanceTransaction
                          .reversal_of_balance_transaction_payout
                          .readable_identifier,
                    })
                  : '',
            })}
          </Typography>
        )}
        {balanceTransaction.reconciled_bsport_payout && (
          <Typography color="textSecondary" variant="caption">
            {t('balanceTransaction.fromPayout', {
              readable_identifier:
                balanceTransaction.reconciled_bsport_payout.readable_identifier,
            })}
          </Typography>
        )}
      </div>
    );
  }

  const renderInvoiceLine = (
    payment: BalanceTransaction['reconciled_bsport_payments'][number],
  ) => {
    return (
      <>
        <div
          className={
            isMobile ? classes.mobileInvoiceActions : classes.invoiceActions
          }
        >
          {isMobile ? (
            <>
              <Button
                color="primary"
                component="a"
                href={`/invoice/${payment.invoice.uuid}`}
                rel="noopener noreferrer"
                size="small"
                startIcon={<OpenInNewIcon fontSize="small" />}
                target="_blank"
                variant="text"
              >
                {t('balanceTransaction.details')}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  window.open(
                    payment.invoice.stripe_invoice_pdf,
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
                size="small"
                startIcon={<GetAppIcon fontSize="small" />}
                variant="text"
              >
                {t('balanceTransaction.pdf')}
              </Button>
            </>
          ) : (
            <>
              <Tooltip title={t('balanceTransaction.details') ?? ''}>
                <IconButton
                  aria-label={t('balanceTransaction.details')}
                  color="primary"
                  component="a"
                  href={`/invoice/${payment.invoice.uuid}`}
                  rel="noopener noreferrer"
                  size="small"
                  target="_blank"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('balanceTransaction.downloadPdfHelp') ?? ''}>
                <IconButton
                  aria-label={t('balanceTransaction.downloadPdfHelp')}
                  color="primary"
                  onClick={() => {
                    window.open(
                      payment.invoice.stripe_invoice_pdf,
                      '_blank',
                      'noopener,noreferrer',
                    );
                  }}
                  size="small"
                >
                  <GetAppIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </>
    );
  };

  if (payments.length === 1) {
    const payment = payments[0];
    return (
      <div className={classes.paymentLine}>{renderInvoiceLine(payment)}</div>
    );
  }

  return (
    <div className={classes.stack}>
      {payments.map((payment, index) => (
        <React.Fragment key={payment.id}>
          {index > 0 && <Divider />}
          <div className={classes.paymentLine}>
            {payment.payment_received ? (
              <CheckIcon className={classes.received} fontSize="small" />
            ) : (
              <CloseIcon className={classes.notReceived} fontSize="small" />
            )}
            <Typography variant="caption">{payment.price}</Typography>
            {renderInvoiceLine(payment)}
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
  invoiceActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.25),
  },
  mobileInvoiceActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
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
  timezoneName?: string;
};

const BalanceTransactionRow: React.FC<Props> = ({
  balanceTransaction: bt,
  isMobile,
  timezoneName,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['b2b_payout']);
  const hasFeeBreakdown = useSafeFlag(FeatureFlags.PAYOUT_FEE_BREAKDOWN);

  const grossDisplay = getCurrencyDisplayWithPrice(
    (bt.amount_cts / 100).toFixed(2),
  );
  const isDirectDebitReversal =
    bt.display_type === 'failed_direct_debit_reversal';
  const feeCts = isDirectDebitReversal ? -bt.fee_cts : bt.fee_cts;
  const feeDisplay = getCurrencyDisplayWithPrice((feeCts / 100).toFixed(2));
  const totalDisplay = getCurrencyDisplayWithPrice(
    (bt.net_cts / 100).toFixed(2),
  );

  const transactionCreatedAt = bt.payment_provider_created_at
    ? formatAsDatetime(bt.payment_provider_created_at, timezoneName)
    : '-';

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
        <Typography color="textSecondary" variant="caption">
          {transactionCreatedAt}
        </Typography>
        {/* Gross / Fee / Total */}
        <div className={classes.mobileAmounts}>
          {hasFeeBreakdown ? (
            <>
              <div className={classes.mobileAmountItem}>
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.gross')}
                </Typography>
                <Typography variant="body2">{grossDisplay}</Typography>
              </div>
              <div className={classes.mobileAmountItem}>
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.fee')}
                </Typography>
                <Typography variant="body2">{feeDisplay}</Typography>
              </div>
              <div className={classes.mobileAmountItem}>
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.total')}
                </Typography>
                <Typography variant="body2">{totalDisplay}</Typography>
              </div>
            </>
          ) : (
            <div className={classes.mobileAmountItem}>
              <Typography color="textSecondary" variant="caption">
                {t('balanceTransactionTable.amount')}
              </Typography>
              <Typography variant="body2">{totalDisplay}</Typography>
            </div>
          )}
        </div>
        {/* Invoice(s) */}
        <InvoiceCell isMobile balanceTransaction={bt} />
      </Paper>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <Typography variant="caption">{transactionCreatedAt}</Typography>
      </TableCell>
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
      {hasFeeBreakdown ? (
        <>
          <TableCell>
            <Typography variant="body2">{grossDisplay}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{feeDisplay}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{totalDisplay}</Typography>
          </TableCell>
        </>
      ) : (
        <TableCell>
          <Typography variant="body2">{totalDisplay}</Typography>
        </TableCell>
      )}
      <TableCell>
        <InvoiceCell balanceTransaction={bt} isMobile={false} />
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
  mobileAmounts: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  mobileAmountItem: {
    display: 'flex',
    flexDirection: 'column',
  },
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
