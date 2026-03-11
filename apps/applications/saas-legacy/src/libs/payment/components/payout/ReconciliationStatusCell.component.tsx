import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import type { BalanceTransaction } from '../../types';
import TapTooltip from './TapTooltip.component';

type Props = {
  errorType: string;
  isMobile: boolean;
  status: BalanceTransaction['reconciliation_status'];
};

const ReconciliationStatusCell: React.FC<Props> = ({
  status,
  errorType,
  isMobile,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);

  if (status === 'success') {
    return (
      <div className={classes.row}>
        <CheckCircleOutlineIcon className={classes.success} fontSize="small" />
        <Typography variant="caption">
          {t('payout.reconciliationStatus.success')}
        </Typography>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className={classes.row}>
        <HourglassEmptyIcon className={classes.pending} fontSize="small" />
        <Typography variant="caption">
          {t('payout.reconciliationStatus.pending')}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.row}>
      <TapTooltip
        isMobile={isMobile}
        placement="top"
        title={errorType || (t('payout.reconciliationStatus.error') ?? '')}
      >
        <ErrorOutlineIcon className={classes.error} fontSize="small" />
      </TapTooltip>
      <Typography variant="caption">
        {t('payout.reconciliationStatus.error')}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  row: { display: 'flex', alignItems: 'center', gap: theme.spacing(0.5) },
  success: { color: theme.palette.success?.main ?? 'green' },
  pending: { color: theme.palette.warning?.main ?? 'orange' },
  error: { color: theme.palette.error.main, cursor: 'default' },
}));

export default ReconciliationStatusCell;
