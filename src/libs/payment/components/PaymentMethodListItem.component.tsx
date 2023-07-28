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
import { useTranslation } from 'react-i18next';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import type { PaymentMethod } from '../types';
import type { OptionCallback } from '../../../state/types';

type Props = {
  paymentMethod: PaymentMethod;
  selected?: boolean;
  onClick?: (id?: string) => void;
  onEdit?: (id: string) => void;
  withGeneralConditions?: boolean;
  disabled?: boolean;
  detachPaymentMethod?: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  setHasDetached?: (id: string) => void;
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
    listStyleType: 'none',
    li: {
      listStyleType: 'none',
    },
  },
  listItemIcon: {
    marginLeft: theme.spacing(3),
  },
  radio: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
}));

export const PaymentMethodListItem: FC<Props> = ({
  paymentMethod,
  selected,
  onClick,
  onEdit,
  withGeneralConditions,
  disabled,
  detachPaymentMethod,
  setHasDetached,
  detachPaymentMethodLoading,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  const handleChangePaymentMethod = React.useCallback(() => {
    if (!onClick || !(withGeneralConditions || true)) return;
    if (selected) {
      onClick();
    } else {
      onClick(paymentMethod.id);
    }
  }, [onClick, paymentMethod.id, selected, withGeneralConditions]);

  const onPaymentMethodEdit = React.useCallback(
    () => onEdit(paymentMethod.id),
    [onEdit, paymentMethod.id],
  );

  const removePaymentMethod = React.useCallback(() => {
    detachPaymentMethod(paymentMethod.id, {
      onSuccess: () => {
        setHasDetached && setHasDetached(paymentMethod.id);
      },
    });
  }, [detachPaymentMethod, paymentMethod.id, setHasDetached]);

  if (!paymentMethod) {
    return null;
  }
  return (
    <ListItem
      // @ts-expect-error
      button={!!onClick}
      selected={selected}
      className={`${classes.listItem} ${
        selected ? classes.selectedBorder : null
      }`}
      onClick={handleChangePaymentMethod}
      disabled={disabled}
    >
      {!!onClick && (
        <Radio
          checked={selected || false}
          onChange={handleChangePaymentMethod}
          name="radio-buttons"
          classes={{ root: classes.radio, checked: classes.checked }}
        />
      )}
      <ListItemIcon className={classes.listItemIcon}>
        {paymentMethod.type === 'card' ? (
          <CreditCardIcon />
        ) : (
          <AccountBalanceIcon />
        )}
      </ListItemIcon>

      <ListItemText
        primary={`**** **** **** ${paymentMethod.readable_identifier}`}
        secondary={
          paymentMethod.type === 'card'
            ? `${paymentMethod.additional_info || ' '} ${paymentMethod.brand}`
            : null
        }
      />
      {onEdit && (
        <ListItemSecondaryAction>
          <Button
            color="primary"
            variant="outlined"
            onClick={onPaymentMethodEdit}
          >
            {t('paymentMethod.edit')}
          </Button>
        </ListItemSecondaryAction>
      )}
      {detachPaymentMethod && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={removePaymentMethod}
            disabled={detachPaymentMethodLoading || disabled}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default React.memo(PaymentMethodListItem);
