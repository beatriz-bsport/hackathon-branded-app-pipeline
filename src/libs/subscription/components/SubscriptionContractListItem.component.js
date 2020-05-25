// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import type { SubscriptionContract } from '../types';

type Props = {
  t: TFunction,
  contract: SubscriptionContract,
  onDelete: () => void,
  onEdit: () => void,
  onClick?: () => void,
  onRegister?: () => void,
  onBook?: () => void,
  selected?: boolean,
  dense?: boolean,
  divider?: boolean,
};

export const SubscriptionContractListItem = (props: Props) => {
  return (
    <ListItem
      onClick={props.onClick}
      button={!!props.onClick}
      selected={props.selected}
      divider={props.divider}
      dense={props.dense}
    >
      <ListItemText
        primary={`${props.contract.name} - ${props.contract.recurrent_price}€ ${
          parseFloat(props.contract.flat_fee)
            ? ` (+${props.contract.flat_fee}€)`
            : ''
        }`}
        secondary={`${props.contract.payment_pack &&
          props.contract.payment_pack.name}${
          props.contract.auto_renewal
            ? ''
            : `- ${props.t('contract.duration', {
                month: props.contract.nb_interval,
              })}`
        }`}
      />
      {props.onBook ? (
        <Button
          color="primary"
          variant="contained"
          onClick={(ev) => {
            ev.stopPropagation();
            props.onBook();
          }}
        >
          <AddShoppingCartIcon />
        </Button>
      ) : null}
      {props.onRegister ? (
        <IconButton
          color="primary"
          onClick={(ev) => {
            ev.stopPropagation();
            props.onRegister();
          }}
        >
          <AddPersonIcon />
        </IconButton>
      ) : null}
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

export default withTranslation(['subscription'])(SubscriptionContractListItem);
