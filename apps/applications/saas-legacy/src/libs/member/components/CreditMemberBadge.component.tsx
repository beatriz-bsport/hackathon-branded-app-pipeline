import React from 'react';
import Badge, { type BadgeClassKey } from '@material-ui/core/Badge';
import ReceiptIcon from '@material-ui/icons/Receipt';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

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
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.readBalance">
      {(hasPermission: boolean) => {
        return hasPermission ? (
          <Badge
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
              badge: clsx(classes?.badge, {
                [classesStyle.bottomCredit]: bottomCredit,
              }),
            }}
            color={badgeColor}
          >
            {children}
          </Badge>
        ) : (
          <>{children}</>
        );
      }}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default React.memo(CreditMemberBadge);
