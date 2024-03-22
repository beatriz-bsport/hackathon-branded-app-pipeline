// @flow
import React, { useEffect } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { withTranslation, TFunction } from 'react-i18next';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Typography from '@material-ui/core/Typography';
import Tooltip from '#components/Tooltip.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { Contract } from '../types';

type Props = {
  t: TFunction,
  company?: { id: number, name: string },
  contract: Contract,
  onDelete: () => void,
  onEdit: () => void,
  onClick?: () => void,
  onRegister?: () => void,
  onBook?: () => void,
  onRestore?: () => void,
  selected?: boolean,
  dense?: boolean,
  divider?: boolean,
  isExcludingTax?: boolean,
};

export const SubscriptionContractListItem = (props: Props) => {
  useEffect(() => {
    if (props.selected) {
      const element = document.getElementById(
        `contract#${props.contract.id.toString()}`,
      );
      if (element) element.scrollIntoView();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <ListItem
      button={!!props.onClick}
      dense={props.dense}
      divider={props.divider}
      id={`contract#${props.contract.id}`}
      onClick={props.onClick}
      selected={props.selected}
    >
      <ListItemText
        primary={`${props.contract.name} - ${getCurrencyDisplayWithPrice(
          props.contract.recurrent_price,
          props.isExcludingTax,
          props.contract.tax,
        )} ${
          parseFloat(props.contract.flat_fee)
            ? ` (+${getCurrencyDisplayWithPrice(props.contract.flat_fee)})`
            : ''
        }`}
        secondary={`${
          (props.contract.payment_pack && props.contract.payment_pack.name) ||
          (props.contract.private_pass && props.contract.private_pass.name) ||
          (props.contract.payment_combo && props.contract.payment_combo.name) ||
          ''
        }${` - ${props.t('contract.duration', {
          month: props.contract.nb_interval,
        })}`}${
          props.contract.auto_renewal
            ? ` [${props.t('contract.autoRenewal')}]`
            : ''
        }`}
      />
      {props.onDelete && !props.contract.is_usable_by_staff && (
        <Tooltip title={props.t('invisibleForStaffToolTip')}>
          <IconButton>
            <RemoveShoppingCartIcon />
          </IconButton>
        </Tooltip>
      )}
      {props.contract.hasActiveNotification && (
        <Tooltip
          aria-label="info"
          title={
            <Typography variant="subtitle2">
              {props.t('notificationToolTip')}
            </Typography>
          }
        >
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      )}
      <ListItemResponsiveAction
        actions={[
          props.onRegister && {
            icon: AddPersonIcon,
            label: props.t('subscription.register'),
            color: 'primary',
            onClick: () => {
              props.onRegister();
            },
            disabled: !props.contract.is_usable_by_staff,
          },
          props.onEdit && {
            icon: EditIcon,
            label: props.t('subscription.edit'),
            onClick: () => {
              props.onEdit();
            },
          },
          props.onDelete && {
            icon: DeleteIcon,
            label: props.t('subscription.delete'),
            onClick: () => {
              props.onDelete();
            },
          },
          props.onBook && {
            icon: AddShoppingCartIcon,
            label: props.t(''),
            onClick: () => {
              props.onBook();
            },
          },
          props.onRestore && {
            icon: RestoreFromTrashIcon,
            label: props.t('subscription.restore'),
            onClick: () => {
              props.onRestore();
            },
          },
        ]}
      />
    </ListItem>
  );
};

export default withTranslation(['subscription'])(SubscriptionContractListItem);
