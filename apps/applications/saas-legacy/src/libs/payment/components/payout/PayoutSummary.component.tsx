import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import type { Payout } from '../../types';

type Props = {
  payout: Payout;
};

const COUNT_KEYS: Array<{
  labelKey: string;
  key: keyof Payout;
}> = [
  { labelKey: 'payout.summary.payments', key: 'payment_count' },
  { labelKey: 'payout.summary.refunds', key: 'refund_count' },
  { labelKey: 'payout.summary.disputes', key: 'dispute_count' },
  {
    labelKey: 'payout.summary.directDebitOriginal',
    key: 'failed_direct_debit_original_count',
  },
  {
    labelKey: 'payout.summary.directDebitReversal',
    key: 'failed_direct_debit_reversal_count',
  },
  { labelKey: 'payout.summary.transfers', key: 'balance_transfer_count' },
  {
    labelKey: 'payout.summary.transferRefunds',
    key: 'balance_transfer_refund_count',
  },
  { labelKey: 'payout.summary.adjustments', key: 'adjustment_count' },
  { labelKey: 'payout.summary.appFees', key: 'application_fee_count' },
  {
    labelKey: 'payout.summary.appFeeRefunds',
    key: 'application_fee_refund_count',
  },
  { labelKey: 'payout.summary.payoutFailures', key: 'payout_failure_count' },
  { labelKey: 'payout.summary.payoutCancels', key: 'payout_cancel_count' },
];

const PayoutSummary: React.FC<Props> = ({ payout }) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);

  const counts = COUNT_KEYS.filter((c) => (payout[c.key] as number) > 0);
  const reconciliationStatus = payout.reconciliation_status ?? 'pending';
  const reconciliationStatusLabel = t(
    `payout.reconciliationStatusPayoutStatus.${reconciliationStatus}`,
    { defaultValue: reconciliationStatus },
  );

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="subtitle2">
        {t('payout.summary.title')}
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell className={classes.labelCell}>
              <Typography variant="caption">
                {t('payout.summary.reconciliation')}
              </Typography>
            </TableCell>
            <TableCell className={classes.countCell}>
              <Typography variant="caption">
                {reconciliationStatusLabel}
              </Typography>
            </TableCell>
          </TableRow>
          {counts.map((c) => (
            <TableRow key={c.labelKey}>
              <TableCell className={classes.labelCell}>
                <Typography variant="caption">{t(c.labelKey)}</Typography>
              </TableCell>
              <TableCell className={classes.countCell}>
                <Typography variant="caption">{payout[c.key]}</Typography>
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
  },
}));

export default PayoutSummary;
