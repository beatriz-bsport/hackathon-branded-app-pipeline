// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';

import { formatAsDatetime } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { PaymentComboPurchase } from '../types';

type Props = {
  divider?: boolean,
  paymentComboPurchase: PaymentComboPurchase,
  onClick: () => void,
};

export const PaymentComboPurchaseListItem = (props: Props) => {
  const { paymentComboPurchase } = props;

  if (!paymentComboPurchase || !paymentComboPurchase.payment_combo) {
    return (
      <ListItem>
        <CircularProgress />
      </ListItem>
    );
  }
  const { payment_combo } = paymentComboPurchase;

  return (
    <ListItem
      divider={props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={
          `${payment_combo.name} - ${payment_combo.member}`
            ? paymentComboPurchase.member.name
            : '...'
        }
        secondary={`${getCurrencyDisplayWithPrice(
          paymentComboPurchase.price,
        )} - ${formatAsDatetime(paymentComboPurchase.date)}`}
      />
      {props.onClick ? (
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={props.onClick}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default PaymentComboPurchaseListItem;
