// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { SubscriptionContract } from '../types';

type Props = {
  t: TFunction,
  contract: SubscriptionContract,
  onDelete: () => void,
  onEdit: () => void,
  onClick?: () => void,
  selected?: boolean,
};

export const SubscriptionContractListItem = (props: Props) => {
  return (
    <ListItem
      onClick={props.onClick}
      button={!!props.onClick}
      selected={props.selected}
    >
      <ListItemText
        primary={`${props.contract.name} - ${props.contract.recurrent_price}€`}
        secondary={`${props.contract.payment_pack &&
          props.contract.payment_pack.name} - ${props.t('contract.duration', {
          month: props.contract.nb_interval,
        })}`}
      />
      {props.onEdit ? (
        <IconButton
          color="primary"
          onClick={(ev) => {
            ev.stopPropagation();
            props.onEdit();
          }}
        >
          <EditIcon />
        </IconButton>
      ) : null}
      {props.onDelete ? (
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            props.onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      ) : null}
    </ListItem>
  );
};

export default withNamespaces(['subscription'])(SubscriptionContractListItem);
