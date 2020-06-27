// @flow
import React, { useEffect } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import LinkIcon from '@material-ui/icons/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { buildUrlParams } from '../../../http';

import type { SubscriptionContract } from '../types';
import { urlToMarketplace } from '../../marketplace/utils';

type Props = {
  t: TFunction,
  company?: { id: number, name: string },
  contract: SubscriptionContract,
  onDelete: () => void,
  onEdit: () => void,
  onClick?: () => void,
  onRegister?: () => void,
  onBook?: () => void,
  selected?: boolean,
  dense?: boolean,
  divider?: boolean,
  copy: boolean,
  snackbar?: (string) => void,
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
        secondary={`${props.contract.payment_pack &&
          props.contract.payment_pack.name}${
          props.contract.auto_renewal
            ? ''
            : `- ${props.t('contract.duration', {
                month: props.contract.nb_interval,
              })}`
        }`}
      />
      <ListItemSecondaryAction>
        {props.copy && props.company ? (
          <IconButton
            onClick={() => {
              if (props.snackbar) props.snackbar('link.copied');
            }}
          >
            <CopyToClipboard
              text={`${window.location.origin}${urlToMarketplace(
                props.company.name,
                props.company.id,
              )}
              /subscription${buildUrlParams({
                selected: props.contract.id,
              })}`}
            >
              <LinkIcon />
            </CopyToClipboard>
          </IconButton>
        ) : null}
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
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withTranslation(['subscription'])(SubscriptionContractListItem);
