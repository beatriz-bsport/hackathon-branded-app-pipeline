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
import { MarketplacePaymentMethods } from '#src/libs/marketplace/types';
import type { PaymentMethod } from '../types';
import type { OptionCallback } from '../../../state/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type Props = {
  paymentMethod?: PaymentMethod;
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
  nolistStyle: { listStyleType: 'none' },
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
  }, [onClick, paymentMethod?.id, selected, withGeneralConditions]);

  const onPaymentMethodEdit = React.useCallback(
    () => onEdit(paymentMethod.id),
    [onEdit, paymentMethod?.id],
  );

  const removePaymentMethod = React.useCallback(() => {
    detachPaymentMethod(paymentMethod.id, {
      onSuccess: () => {
        setHasDetached && setHasDetached(paymentMethod.id);
      },
    });
  }, [detachPaymentMethod, paymentMethod?.id, setHasDetached]);

  if (!paymentMethod) {
    return null;
  }
  return (
    <ListItem
      // @ts-expect-error
      button={!!onClick}
      classes={{ container: classes.nolistStyle }}
      className={`${classes.listItem} ${
        selected ? classes.selectedBorder : null
      }`}
      disabled={disabled}
      onClick={handleChangePaymentMethod}
      selected={selected}
    >
      {!!onClick && (
        <Radio
          checked={selected || false}
          classes={{ root: classes.radio, checked: classes.checked }}
          name="radio-buttons"
          onChange={handleChangePaymentMethod}
        />
      )}
      <ListItemIcon className={classes.listItemIcon}>
        {paymentMethod.type === MarketplacePaymentMethods.card ? (
          <CreditCardIcon />
        ) : (
          <AccountBalanceIcon />
        )}
      </ListItemIcon>

      <ListItemText
        primary={`**** **** **** ${paymentMethod.readable_identifier}`}
        secondary={
          paymentMethod.type === MarketplacePaymentMethods.card
            ? `${paymentMethod.additional_info || ' '} ${paymentMethod.brand}`
            : null
        }
      />
      {onEdit && (
        <ListItemSecondaryAction>
          <Button
            color="primary"
            onClick={onPaymentMethodEdit}
            variant="outlined"
          >
            {t('paymentMethod.edit')}
          </Button>
        </ListItemSecondaryAction>
      )}
      {detachPaymentMethod && (
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="billing.allowed_actions.deletePaymentMethod"
        >
          <ListItemSecondaryAction>
            <IconButton
              disabled={detachPaymentMethodLoading || disabled}
              onClick={removePaymentMethod}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ObjectLevelPermissionWrapper>
      )}
    </ListItem>
  );
};

export default React.memo(PaymentMethodListItem);
