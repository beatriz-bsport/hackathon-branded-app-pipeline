// @flow
import React, { useEffect } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import type { SubscriptionContract } from '../types';

type Props = {
  t: TFunction,
  company?: { id: number, name: string },
  contract: SubscriptionContract,
  onDelete: () => void,
  onEdit: () => void,
  onClick?: () => void,
  onRegister?: () => void,
  onBook?: () => void,
  onRestore?: () => void,
  selected?: boolean,
  dense?: boolean,
  divider?: boolean,
};

export const SubscriptionContractListItem = (props: Props) => {
  useEffect(() => {
    if (props.selected) {
      const element = document.getElementById(
        `contract#${props.contract.id.toString()}`,
      );
      if (element) element.scrollIntoView();
    }
  }, []);

  return (
    <ListItem
      onClick={props.onClick}
      button={!!props.onClick}
      selected={props.selected}
      divider={props.divider}
      dense={props.dense}
      id={`contract#${props.contract.id}`}
    >
      <ListItemText
        primary={`${props.contract.name} - ${props.contract.recurrent_price}€ ${
          parseFloat(props.contract.flat_fee)
            ? ` (+${props.contract.flat_fee}€)`
            : ''
        }`}
        secondary={`${
          (props.contract.payment_pack && props.contract.payment_pack.name) ||
          (props.contract.private_pass && props.contract.private_pass.name) ||
          (props.contract.payment_combo && props.contract.payment_combo.name) ||
          ''
        }${
          props.contract.auto_renewal
            ? ''
            : `- ${props.t('contract.duration', {
                month: props.contract.nb_interval,
              })}`
        }`}
      />
      <ListItemResponsiveAction
        actions={[
          props.onRegister && {
            icon: AddPersonIcon,
            label: props.t('subscription.register'),
            color: 'primary',
            onClick: () => {
              props.onRegister();
            },
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
