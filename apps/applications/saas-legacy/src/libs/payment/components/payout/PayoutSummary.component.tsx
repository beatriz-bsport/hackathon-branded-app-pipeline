import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import type { BalanceTransactionStats, Payout } from '../../types';

type Props = {
  payout: Payout;
  summaryStats?: BalanceTransactionStats | null;
};

const SUMMARY_TYPES: Array<{
  labelKey: string;
  countKey: keyof Payout;
  displayTypeKey: string;
}> = [
  {
    labelKey: 'summary.payments',
    countKey: 'payment_count',
    displayTypeKey: 'payment',
  },
  {
    labelKey: 'summary.refunds',
    countKey: 'refund_count',
    displayTypeKey: 'refund',
  },
  {
    labelKey: 'summary.disputes',
    countKey: 'dispute_count',
    displayTypeKey: 'dispute',
  },
  {
    labelKey: 'summary.directDebitOriginal',
    countKey: 'failed_direct_debit_original_count',
    displayTypeKey: 'failed_direct_debit_original',
  },
  {
    labelKey: 'summary.directDebitReversal',
    countKey: 'failed_direct_debit_reversal_count',
    displayTypeKey: 'failed_direct_debit_reversal',
  },
  {
    labelKey: 'summary.transfers',
    countKey: 'balance_transfer_count',
    displayTypeKey: 'balance_transfer',
  },
  {
    labelKey: 'summary.transferRefunds',
    countKey: 'balance_transfer_refund_count',
    displayTypeKey: 'balance_transfer_refund',
  },
  {
    labelKey: 'summary.adjustments',
    countKey: 'adjustment_count',
    displayTypeKey: 'adjustment',
  },
  {
    labelKey: 'summary.appFees',
    countKey: 'application_fee_count',
    displayTypeKey: 'application_fee',
  },
  {
    labelKey: 'summary.appFeeRefunds',
    countKey: 'application_fee_refund_count',
    displayTypeKey: 'application_fee_refund',
  },
  {
    labelKey: 'summary.payoutFailures',
    countKey: 'payout_failure_count',
    displayTypeKey: 'payout_failure',
  },
  {
    labelKey: 'summary.payoutCancels',
    countKey: 'payout_cancel_count',
    displayTypeKey: 'payout_cancel',
  },
];

const formatSummaryValue = (count: number, amountCts: number) => {
  const amountDisplay = getCurrencyDisplayWithPrice(
    (amountCts / 100).toFixed(2),
  );
  return count > 0 ? `${count} (${amountDisplay})` : amountDisplay;
};

const PayoutSummary: React.FC<Props> = ({ payout, summaryStats = null }) => {
  const classes = useStyles();
  const { t } = useTranslation(['b2b_payout']);

  const rows = SUMMARY_TYPES.map((config) => {
    if (!summaryStats) {
      const count = payout[config.countKey] as number;
      if (count <= 0) return null;
      return {
        label: t(config.labelKey),
        value: String(count),
      };
    }

    const stat = summaryStats.by_display_type[config.displayTypeKey];
    if (!stat) return null;

    const hasValue = stat.count > 0;
    if (!hasValue) return null;

    return {
      label: t(config.labelKey),
      value: formatSummaryValue(stat.count, stat.amount_cts),
    };
  }).filter((row): row is { label: string; value: string } => row !== null);

  if (summaryStats && summaryStats.no_display_type) {
    const uncategorized = summaryStats.no_display_type;

    if (uncategorized.count > 0) {
      rows.push({
        label: t('displayType.other.label'),
        value: formatSummaryValue(
          uncategorized.count,
          uncategorized.amount_cts,
        ),
      });
    }
  }

  const reconciliationStatus = payout.reconciliation_status ?? 'pending';
  const reconciliationStatusLabel = t(
    `reconciliationStatusPayoutStatus.${reconciliationStatus}`,
    { defaultValue: reconciliationStatus },
  );

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="subtitle2">
        {t('summary.title')}
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell className={classes.labelCell}>
              <Typography variant="caption">
                {t('summary.reconciliation')}
              </Typography>
            </TableCell>
            <TableCell className={classes.countCell}>
              <Typography variant="caption">
                {reconciliationStatusLabel}
              </Typography>
            </TableCell>
          </TableRow>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className={classes.labelCell}>
                <Typography variant="caption">{row.label}</Typography>
              </TableCell>
              <TableCell className={classes.countCell}>
                <Typography variant="caption">{row.value}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      1,
    )}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: 'fit-content',
  },
  title: {
    fontWeight: 600,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  status_completed: {
    background: theme.palette.success?.main ?? 'green',
    color: '#fff',
  },
  status_pending: {
    background: theme.palette.warning?.main ?? 'orange',
    color: '#fff',
  },
  status_failed: {
    background: theme.palette.error.main,
    color: '#fff',
  },
  table: {
    width: 'auto',
    '& td': {
      border: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
  labelCell: {
    width: '70%',
  },
  countCell: {
    fontVariantNumeric: 'tabular-nums',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
}));

export default PayoutSummary;
