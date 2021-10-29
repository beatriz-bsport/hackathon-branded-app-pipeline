import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { PaymentMethod } from '../types';

type Props = {
  paymentMethod: PaymentMethod;
  t: TFunction;
  selected?: boolean;
  onClick?: (id?: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  snackbarSuccessMsg2: (msg: string) => void;
  withGeneralConditions?: boolean;
  disabled?: boolean;
  detachPaymentMethod?: (id: string) => void;
  setHasDetached?: (id: string) => void;
  disableDuringDetach?: boolean;
  detachPaymentMethodLoading?: boolean;
};

const useStyles = makeStyles((theme) => ({
  selectedBorder: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 5,
    background: 'white',
    active: {
      backgroundColor: 'white',
    },
  },
  listItem: {
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: 5,
    flexGrow: 1,
  },
  listItemIcon: {
    marginLeft: theme.spacing(3),
  },
}));

export const PaymentMethodListItem: FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  const withGeneralConditions = props.withGeneralConditions
    ? props.withGeneralConditions
    : true;
  const handleChangePaymentMethod = () => {
    if (!props.onClick || !withGeneralConditions) return;
    if (props.selected) {
      props.onClick();
    } else {
      props.onClick(props.paymentMethod.id);
    }
  };

  return (
    <ListItem
      button={!!props.onClick}
      selected={props.selected}
      className={`${classes.listItem} ${
        props.selected ? classes.selectedBorder : null
      }`}
      onClick={handleChangePaymentMethod}
      disabled={props.disabled}
    >
      {!!props.onClick && (
        <Radio
          checked={props.selected ? props.selected : false}
          onChange={handleChangePaymentMethod}
          name="radio-buttons"
        />
      )}
      <ListItemIcon className={classes.listItemIcon}>
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
            onClick={() => props.onEdit(props.paymentMethod.id)}
          >
            {t('paymentMethod.edit')}
          </Button>
        </ListItemSecondaryAction>
      )}
      {props.detachPaymentMethod && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              props.detachPaymentMethod(props.paymentMethod.id, {
                onSuccess: () => {
                  props.setHasDetached &&
                    props.setHasDetached(props.paymentMethod.id);
                },
              });
            }}
            disabled={
              props.disableDuringDetach ||
              props.detachPaymentMethodLoading ||
              props.disabled
            }
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default withTranslation(['invoice'])(PaymentMethodListItem);
