// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { MenuItem } from '@material-ui/core';

import type { PaymentCombo } from '../types';
import withConfirm from '../../../hocs/with-confirm.hoc';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

type Props = {
  divider?: boolean,
  isFocused?: boolean,
  paymentCombo: PaymentCombo,
  onEdit?: () => void,
  onDelete?: () => void,
  onClick?: () => void,
  t: TFunction,
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton
    onClick={(ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      props.onClick();
    }}
  >
    <DeleteIcon />
  </IconButton>
);

const DeleteButtonMenuItem = withTranslation(['paymentCombo'])(
  (props: { onClick: () => void }) => (
    <MenuItem
      onClick={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        props.onClick();
      }}
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <Typography>{props.t('delete.submit')}</Typography>
    </MenuItem>
  ),
);

const DeleteButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'paymentCombo:delete.title',
  cancel: 'paymentCombo:delete.cancel',
  confirm: 'paymentCombo:delete.submit',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentCombo:delete.content')}</p>
  ),
});

const DeleteButtonWithConfirmMenuItem = withConfirm(
  DeleteButtonMenuItem,
  'onClick',
  {
    title: 'paymentCombo:delete.title',
    cancel: 'paymentCombo:delete.cancel',
    confirm: 'paymentCombo:delete.submit',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('paymentCombo:delete.content')}</p>
    ),
  },
);

export const PaymentComboListItem = (props: Props) => {
  return (
    <ListItem
      divider={!!props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemText
        primary={props.paymentCombo.name}
        secondary={`${getCurrencyDisplayWithPrice(
          props.paymentCombo.price,
        )} - ${props.t('detail.containsNProducts', {
          n:
            props.paymentCombo.payment_packs.reduce(
              (s, p) => p.quantity + s,
              0,
            ) +
            props.paymentCombo.private_passes.reduce(
              (s, p) => p.quantity + s,
              0,
            ) +
            props.paymentCombo.shop_items.reduce((s, p) => p.quantity + s, 0),
        })}`}
      />
      <ListItemResponsiveAction
        actions={[
          props.onEdit && {
            icon: EditIcon,
            label: props.t('edit'),
            color: 'primary',
            onClick: () => {
              props.onEdit();
            },
          },
          props.onDelete && {
            iconButtonComponent: DeleteButtonWithConfirm,
            menuItemComponent: DeleteButtonWithConfirmMenuItem,
            onClick: () => {
              props.onDelete();
            },
          },
        ]}
      />
    </ListItem>
  );
};

const styles = (theme) => ({
  actionButtonWithRightMargin: {
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentCombo']),
)(PaymentComboListItem);
