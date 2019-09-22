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
  let creditFormatted = '';
  try {
    creditFormatted = props.credit.toFixed(1);
  } catch (err) {
    creditFormatted = ' -';
  }
  return (
    <Badge color={badgeColor} badgeContent={`${creditFormatted} €`}>
      {props.children}
    </Badge>
  );
};

export default CreditMemberBadge;
