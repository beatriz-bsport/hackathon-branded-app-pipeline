// @ts-nocheck
import React from 'react';
import classnames from 'classnames';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HourglassIcon from '@material-ui/icons/HourglassFull';
import { blue, grey, red, green } from '@material-ui/core/colors';

type Props = {
  isAvailableBalanceChip?: boolean;
  isAvailableBalancePositive?: boolean;
  balanceAvailableText?: string;
  isPendingBalanceNonNull?: boolean;
  balancePendingText?: string;
};

export const StripeBalanceChip: React.FC<Props> = ({
  isAvailableBalanceChip,
  isAvailableBalancePositive,
  balanceAvailableText,
  isPendingBalanceNonNull,
  balancePendingText,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.chipContainer}>
      <div
        className={classnames(classes.chipStatus, {
          [classes.pendingChip]:
            !isAvailableBalanceChip && isPendingBalanceNonNull,
          [classes.emptyChip]:
            !isAvailableBalanceChip && !isPendingBalanceNonNull,
          [classes.successChip]:
            isAvailableBalanceChip && isAvailableBalancePositive,
          [classes.errorChip]:
            isAvailableBalanceChip && !isAvailableBalancePositive,
        })}
      >
        {!isAvailableBalanceChip && isPendingBalanceNonNull && (
          <HourglassIcon className={classes.pending} fontSize="medium" />
        )}
        {isAvailableBalanceChip && isAvailableBalancePositive && (
          <AccountBalanceWalletIcon
            className={classes.success}
            fontSize="medium"
          />
        )}
        {isAvailableBalanceChip && !isAvailableBalancePositive && (
          <AccountBalanceWalletIcon
            className={classes.error}
            fontSize="medium"
          />
        )}
        {isAvailableBalanceChip || isPendingBalanceNonNull ? (
          <Typography variant="default">
            {isAvailableBalanceChip ? balanceAvailableText : balancePendingText}
          </Typography>
        ) : (
          <Typography variant="default">{balancePendingText}</Typography>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(0.5),
  },
  pending: {
    color: theme.palette.info.dark,
    marginRight: theme.spacing(0.5),
  },
  chipContainer: {
    display: 'table',
  },
  chipStatus: {
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.light,
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
  },
  successChip: {
    backgroundColor: green[50],
    color: green[900],
  },
  pendingChip: {
    backgroundColor: blue[50],
    color: theme.palette.info.dark,
  },
  errorChip: {
    backgroundColor: red[50],
    color: theme.palette.error.main,
  },
  floatChip: {
    float: 'left',
    marginRight: theme.spacing(0.5),
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  emptyChip: {
    backgroundColor: grey[300],
    fontWeight: 400,
  },
}));

export default StripeBalanceChip;
