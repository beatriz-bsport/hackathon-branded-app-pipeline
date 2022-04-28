import React from 'react';

import Badge, { type BadgeClassKey } from '@material-ui/core/Badge';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  credit: number;
  bottomCredit?: boolean;
  children: React.ReactChild;
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
  bottomCredit,
  classes,
  children,
}) => {
  const classesStyle = useStyles();

  let badgeColor: Color = Color.COLOR_SECONDARY;
  if (credit > 0) {
    badgeColor = Color.COLOR_PRIMARY;
  }
  if (credit < 0) {
    badgeColor = Color.COLOR_ERROR;
  }
  const creditFormatted = credit.toFixed?.(1) ?? ' -';

  return (
    <Badge
      color={badgeColor}
      badgeContent={`${getCurrencyDisplayWithPrice(creditFormatted)}`}
      classes={{
        ...classes,
        badge: classnames(classes?.badge, {
          [classesStyle.bottomCredit]: bottomCredit,
        }),
      }}
      anchorOrigin={
        bottomCredit && {
          vertical: 'bottom',
          horizontal: 'right',
        }
      }
    >
      {children}
    </Badge>
  );
};

const useStyles = makeStyles(() => ({
  bottomCredit: {
    right: '50%',
  },
}));

export default CreditMemberBadge;
