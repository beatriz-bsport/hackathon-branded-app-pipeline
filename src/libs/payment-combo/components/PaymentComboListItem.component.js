// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import type { PaymentCombo } from '../types';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  divider?: boolean,
  isFocused?: boolean,
  paymentCombo: PaymentCombo,
  onEdit?: () => void,
  onDelete?: () => void,
  onClick?: () => void,
  classes: Object,
  t: TFunction,
};

const withStopPropagation = (func: (any) => any) => (
  ev: SyntheticEvent<HTMLElement>,
) => {
  ev.stopPropagation();
  ev.preventDefault();
  func(ev);
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton onClick={props.onClick}>
    <DeleteIcon />
  </IconButton>
);

const DeleteButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'paymentCombo:delete.title',
  cancel: 'paymentCombo:delete.cancel',
  confirm: 'paymentCombo:delete.submit',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentCombo:delete.content')}</p>
  ),
});

export const PaymentComboListItem = (props: Props) => (
  <ListItem
    divider={!!props.divider}
    button={!!props.onClick}
    onClick={props.onClick}
    style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
  >
    <ListItemText
      primary={props.paymentCombo.name}
      secondary={`${props.paymentCombo.price} € - ${props.t(
        'detail.containsNProducts',
        {
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
        },
      )}`}
    />
    {props.onEdit ? (
      <IconButton
        color="primary"
        onClick={withStopPropagation(props.onEdit)}
        className={
          props.onDelete ? props.classes.actionButtonWithRightMargin : null
        }
      >
        <EditIcon />
      </IconButton>
    ) : null}
    {props.onDelete ? (
      <ListItemSecondaryAction>
        <DeleteButtonWithConfirm
          onClick={withStopPropagation(props.onDelete)}
        />
      </ListItemSecondaryAction>
    ) : null}
  </ListItem>
);

const styles = (theme) => ({
  actionButtonWithRightMargin: {
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentCombo']),
)(PaymentComboListItem);
