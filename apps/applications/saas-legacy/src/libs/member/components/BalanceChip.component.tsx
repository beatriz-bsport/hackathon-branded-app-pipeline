import React from 'react';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {
  BALANCE_AND_UNPAID_AMOUNT,
  ONLY_BALANCE,
  ONLY_UNPAID_AMOUNT,
} from '#src/libs/member/constants';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  credit: number;
  unpaidAmount: string;
  chipChoice?: number;
};

enum Color {
  COLOR_PRIMARY = 'primary',
  COLOR_SECONDARY = 'secondary',
  COLOR_DEFAULT = 'default',
  COLOR_ERROR = 'error',
}

export const BalanceChip: React.FC<Props> = (props: Props) => {
  const { credit, unpaidAmount, chipChoice } = props;
  const classes = useStyle();

  let chipColor: Color = Color.COLOR_SECONDARY;
  let unpaidIconOn: boolean = false;
  const unpaidAmount_number = parseFloat(unpaidAmount);
  let creditFormatted = (credit - unpaidAmount_number)?.toFixed?.(2) ?? ' -';

  switch (chipChoice) {
    case BALANCE_AND_UNPAID_AMOUNT: {
      if (unpaidAmount_number > 0) {
        chipColor = Color.COLOR_ERROR;
        unpaidIconOn = true;
      } else {
        if (credit > 0) {
          chipColor = Color.COLOR_PRIMARY;
        }
        if (credit < 0) {
          chipColor = Color.COLOR_ERROR;
        }
      }
      creditFormatted = (credit - unpaidAmount_number)?.toFixed?.(2) ?? ' -';
      break;
    }
    case ONLY_BALANCE: {
      if (credit > 0) {
        chipColor = Color.COLOR_PRIMARY;
      }
      if (credit < 0) {
        chipColor = Color.COLOR_ERROR;
      }
      creditFormatted = credit?.toFixed?.(2) ?? ' -';
      break;
    }

    case ONLY_UNPAID_AMOUNT: {
      chipColor = Color.COLOR_ERROR;
      unpaidIconOn = true;
      creditFormatted = unpaidAmount_number?.toFixed?.(2) ?? ' -';
      break;
    }
    default: {
      if (unpaidAmount_number > 0) {
        chipColor = Color.COLOR_ERROR;
        unpaidIconOn = true;
      } else {
        if (credit > 0) {
          chipColor = Color.COLOR_PRIMARY;
        }
        if (credit < 0) {
          chipColor = Color.COLOR_ERROR;
        }
      }
      creditFormatted = (credit - unpaidAmount_number)?.toFixed?.(2) ?? ' -';
      break;
    }
  }

  return (
    <Chip
      className={classnames(classes.chip, {
        [classes.errorBackground]: chipColor === Color.COLOR_ERROR,
      })}
      // @ts-expect-error
      color={chipColor}
      label={
        unpaidIconOn ? (
          <span className={classes.balanceStatus}>
            <span className={classes.receiptIcon}>
              <ReceiptIcon fontSize="inherit" />
            </span>
            {` ${getCurrencyDisplayWithPrice(creditFormatted)}`}
          </span>
        ) : (
          `${getCurrencyDisplayWithPrice(creditFormatted)}`
        )
      }
      size="small"
    />
  );
};

const useStyle = makeStyles((theme: Theme) => ({
  icon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  chip: {
    maxWidth: '100%',
    color: 'white',
  },
  receiptIcon: {
    fontSize: theme.spacing(1.75),
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  errorBackground: {
    backgroundColor: theme.palette.error.main,
  },

  balanceStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    whiteSpace: 'pre',
  },
}));

export default BalanceChip;
