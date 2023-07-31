import React from 'react';
import Badge, { type BadgeClassKey } from '@material-ui/core/Badge';
import ReceiptIcon from '@material-ui/icons/Receipt';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';
import { Theme } from '@material-ui/core';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  credit: number;
  unpaidAmount?: string;
  bottomCredit?: boolean;
  children?: React.ReactChild;
  classes?: { [classKey in BadgeClassKey]+?: string };
};

enum Color {
  COLOR_PRIMARY = 'primary',
  COLOR_SECONDARY = 'secondary',
  COLOR_ERROR = 'error',
  COLOR_DEFAULT = 'default',
}

export const CreditMemberBadge: React.FC<Props> = ({
  credit,
  unpaidAmount,
  bottomCredit,
  classes,
  children,
}) => {
  const classesStyle = useStyles();
  const unpaidAmount_number = parseFloat(unpaidAmount);

  let badgeColor: Color = Color.COLOR_SECONDARY;
  let unpaidIconOn: boolean = false;

  if (unpaidAmount_number > 0) {
    badgeColor = Color.COLOR_ERROR;
    unpaidIconOn = true;
  } else {
    if (credit > 0) {
      badgeColor = Color.COLOR_PRIMARY;
    }
    if (credit < 0) {
      badgeColor = Color.COLOR_ERROR;
    }
  }
  const creditFormatted = (credit - unpaidAmount_number)?.toFixed?.(2) ?? ' -';

  return (
    <Badge
      color={badgeColor}
      badgeContent={
        unpaidIconOn ? (
          <span className={classesStyle.balanceStatus}>
            <span className={classesStyle.receiptIcon}>
              <ReceiptIcon fontSize="inherit" />
            </span>
            {` ${getCurrencyDisplayWithPrice(creditFormatted)}`}
          </span>
        ) : (
          `${getCurrencyDisplayWithPrice(creditFormatted)}`
        )
      }
      classes={{
        ...classes,
        badge: classnames(classes?.badge, {
          [classesStyle.bottomCredit]: bottomCredit,
        }),
      }}
      anchorOrigin={
        bottomCredit
          ? {
              vertical: 'bottom',
              horizontal: 'right',
            }
          : {
              vertical: 'top',
              horizontal: 'right',
            }
      }
    >
      {children}
    </Badge>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  receiptIcon: {
    fontSize: theme.spacing(1.75),
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  bottomCredit: {
    right: '50%',
  },
  balanceStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    whiteSpace: 'pre',
  },
}));

export default CreditMemberBadge;
