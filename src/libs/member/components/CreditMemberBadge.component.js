// @flow
import React from 'react';
import Badge from '@material-ui/core/Badge';

type Props = {
  credit: number,
  children: any,
};

export const CreditMemberBadge = (props: Props) => {
  const { credit } = props;
  let badgeColor = 'secondary';
  if (credit > 0) {
    badgeColor = 'primary';
  }
  if (credit < 0) {
    badgeColor = 'error';
  }
  return (
    <Badge color={badgeColor} badgeContent={`${props.credit.toFixed(1)} €`}>
      {props.children}
    </Badge>
  );
};

export default CreditMemberBadge;
