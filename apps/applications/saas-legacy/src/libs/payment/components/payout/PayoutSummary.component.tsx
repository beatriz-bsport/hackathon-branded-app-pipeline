import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import { useSafeFlag } from '../../../../utils/feature-flag/flagWrapper';
import { FeatureFlags } from '../../../../utils/feature-flag/flags';
import type { BalanceTransactionStats, Payout } from '../../types';

type Props = {
  payout: Payout;
  summaryStats?: BalanceTransactionStats | null;
};

const SUMMARY_TYPES: Array<{
  labelKey: string;
  countKey: keyof Payout;
  displayTypeKey: string;
  negateFee?: boolean;
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
    negateFee: true,
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

const formatAmount = (amountCts: number) =>
  getCurrencyDisplayWithPrice((amountCts / 100).toFixed(2));

const formatSummaryValue = (count: number) => {
  return count > 0 ? String(count) : '';
};

const PayoutSummary: React.FC<Props> = ({ payout, summaryStats = null }) => {
  const classes = useStyles();
  const { t } = useTranslation(['b2b_payout']);
  const hasFeeBreakdown = useSafeFlag(FeatureFlags.PAYOUT_FEE_BREAKDOWN);

  type SummaryRow = {
    label: string;
    value: string;
    gross: string | null;
    fee: string | null;
    fee_cts: number | null;
    total: string | null;
  };

  const rows: SummaryRow[] = SUMMARY_TYPES.map((config): SummaryRow | null => {
    if (!summaryStats) {
      const count = payout[config.countKey] as number;
      if (count <= 0) return null;
      return {
        label: t(config.labelKey),
        value: String(count),
        gross: null,
        fee: null,
        fee_cts: null,
        total: null,
      };
    }

    // Skip the fee adjustment row — it is absorbed into the reversal row below.
    if (config.displayTypeKey === 'failed_direct_debit_fee_adjustment')
      return null;

    let stat = summaryStats.by_display_type[config.displayTypeKey];

    if (!stat) return null;
    if (stat.count <= 0) return null;

    return {
      label: t(config.labelKey),
      value: formatSummaryValue(stat.count),
      gross: formatAmount(stat.amount_cts),
      fee: formatAmount(config.negateFee ? -stat.fee_cts : stat.fee_cts),
      fee_cts: stat.fee_cts,
      total: formatAmount(stat.net_cts),
    };
  }).filter((row): row is NonNullable<(typeof rows)[number]> => row !== null);

  if (summaryStats && summaryStats.no_display_type) {
    const uncategorized = summaryStats.no_display_type;

    if (uncategorized.count > 0) {
      rows.push({
        label: t('displayType.other.label'),
        value: formatSummaryValue(uncategorized.count),
        gross: formatAmount(uncategorized.amount_cts),
        fee: formatAmount(uncategorized.fee_cts),
        fee_cts: uncategorized.fee_cts,
        total: formatAmount(uncategorized.net_cts),
      });
    }
  }

  const reconciliationStatus = payout.reconciliation_status ?? 'pending';
  const reconciliationStatusLabel = t(
    `reconciliationStatusPayoutStatus.${reconciliationStatus}`,
    { defaultValue: reconciliationStatus },
  );

  const STATUS_BADGE_CLASS: Record<string, keyof typeof classes> = {
    completed: 'status_completed',
    pending: 'status_pending',
    processing: 'status_pending',
    partially_failed: 'status_pending',
    skipped_manual: 'status_pending',
    failed: 'status_failed',
  };

  const showBreakdown = hasFeeBreakdown && summaryStats != null;

  return (
    <div className={classes.root}>
      <div className={classes.titleRow}>
        <Typography className={classes.title} variant="subtitle2">
          {t('summary.title')}
        </Typography>
        <Typography
          className={`${classes.statusBadge} ${
            classes[
              STATUS_BADGE_CLASS[reconciliationStatus] ?? 'status_pending'
            ]
          }`}
          variant="caption"
        >
          {`${t('summary.reconciliation')}: ${reconciliationStatusLabel}`}
        </Typography>
      </div>
      <Table className={classes.table} size="small">
        <TableBody>
          {showBreakdown && (
            <TableRow>
              <TableCell className={classes.labelCell} />
              <TableCell
                className={`${classes.amountCell} ${classes.desktopOnly}`}
              >
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.gross')}
                </Typography>
              </TableCell>
              <TableCell
                className={`${classes.amountCell} ${classes.desktopOnly}`}
              >
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.fee')}
                </Typography>
              </TableCell>
              <TableCell
                className={`${classes.amountCell} ${classes.desktopOnly}`}
              >
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.total')}
                </Typography>
              </TableCell>
              <TableCell className={classes.countCell}>
                <Typography color="textSecondary" variant="caption">
                  {t('summary.count')}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!showBreakdown && summaryStats != null && (
            <TableRow>
              <TableCell className={classes.labelCell} />
              <TableCell className={classes.amountCell}>
                <Typography color="textSecondary" variant="caption">
                  {t('balanceTransactionTable.total')}
                </Typography>
              </TableCell>
              <TableCell className={classes.countCell} />
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className={classes.labelCell}>
                <Typography variant="caption">{row.label}</Typography>
              </TableCell>
              {showBreakdown && row.gross != null ? (
                <>
                  <TableCell
                    className={`${classes.amountCell} ${classes.desktopOnly}`}
                  >
                    <Typography variant="caption">{row.gross}</Typography>
                  </TableCell>
                  <TableCell
                    className={`${classes.amountCell} ${classes.desktopOnly}`}
                  >
                    <Typography variant="caption">{row.fee}</Typography>
                  </TableCell>
                  <TableCell
                    className={`${classes.amountCell} ${classes.desktopOnly}`}
                  >
                    <Typography variant="caption">{row.total}</Typography>
                  </TableCell>
                </>
              ) : showBreakdown ? (
                <TableCell
                  className={`${classes.amountCell} ${classes.desktopOnly}`}
                  colSpan={3}
                />
              ) : !showBreakdown && row.total != null ? (
                <TableCell className={classes.amountCell}>
                  <Typography variant="caption">{row.total}</Typography>
                </TableCell>
              ) : !showBreakdown ? (
                <TableCell className={classes.amountCell} />
              ) : null}
              <TableCell className={classes.countCell}>
                <Typography variant="caption">{row.value}</Typography>
                {showBreakdown && row.gross != null && (
                  <Typography
                    className={classes.mobileGrossFee}
                    variant="caption"
                  >
                    {row.fee_cts !== 0
                      ? `${row.gross} (fee: ${row.fee})`
                      : row.gross}
                  </Typography>
                )}
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
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  statusBadge: {
    padding: '1px 8px',
    borderRadius: 4,
    fontWeight: 600,
  },
  labelCell: {
    width: '40%',
  },
  amountCell: {
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  countCell: {
    fontVariantNumeric: 'tabular-nums',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  desktopOnly: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileGrossFee: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
}));

export default PayoutSummary;
