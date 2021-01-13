import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import { PaymentMethod } from '../types';

type Props = {
  paymentMethod: PaymentMethod;

  selected?: boolean;
  onClick: (id?: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

const useStyles = makeStyles((theme) => ({
  selectedBorder: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 8,
  },
}));

export const PaymentMethodListItem: FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  return (
    <ListItem
      button={!!props.onClick}
      selected={props.selected}
      className={props.selected ? classes.selectedBorder : null}
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
      {props.onEdit && (
        <ListItemSecondaryAction>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => props.onEdit()}
          >
            {t('paymentMethod.edit')}
          </Button>
        </ListItemSecondaryAction>
      )}
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
