// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

type Props = {
  paymentMethod: {
    type: string,
    id: string,
    readable_identifier: string,
    brand: string,
    payment_backend_identifier: number,
  },

  selected?: boolean,
  onClick?: (?string) => void,
  onDelete?: (?string) => void,
};

export const PaymentMethodListItem = (props: Props) => {
  return (
    <ListItem
      button={!!props.onClick}
      selected={props.selected}
      onClick={() => {
        if (!props.onClick) return;
        if (props.selected) {
          props.onClick();
        } else {
          props.onClick(props.paymentMethod.id);
        }
      }}
    >
      <ListItemIcon>
        {props.paymentMethod.type === 'card' ? (
          <CreditCardIcon />
        ) : (
          <AccountBalanceIcon />
        )}
      </ListItemIcon>
      <ListItemText
        primary={`**** **** **** ${props.paymentMethod.readable_identifier}`}
        secondary={
          props.paymentMethod.type === 'card' ? props.paymentMethod.brand : null
        }
      />
      {props.onDelete && (
        <ListItemSecondaryAction>
          <IconButton onClick={() => props.onDelete(props.paymentMethod.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default PaymentMethodListItem;
