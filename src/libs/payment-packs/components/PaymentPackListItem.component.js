// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import type { PaymentPack } from '../types';

type Props = {
  pack: PaymentPack,
  divider: ?boolean,
  onClick: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
  t: TFunction,
};

export default withNamespaces([])((props: Props) => {
  if (!props.pack) {
    return (
      <ListItem divider={props.divider}>
        <CircularProgress />
      </ListItem>
    );
  }
  return (
    <ListItem
      button={!!props.onClick}
      onClick={props.onClick}
      divider={props.divider}
    >
      <ListItemText
        primary={
          <span>
            <Typography inline component="span">
              {props.pack.name}
            </Typography>
            <Typography
              inline
              variant="caption"
              component="span"
              color="primary"
            >
              {` (${props.pack.nb_consumer_payment_packs})`}
            </Typography>
          </span>
        }
        secondary={`${
          props.pack.credits
            ? props.t('paymentPack.specifications.nbCredits', {
                credits: props.pack.credits,
              })
            : props.t('paymentPack.specifications.unlimitedCredits')
        } - ${props.t('paymentPack.specifications.price', {
          price: props.pack.price,
        })}`}
      />
      {props.onEdit && props.onDelete ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onEdit();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onDelete();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ) : null}
      {props.onDelete && !props.onEdit ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
      {!props.onDelete && props.onEdit ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
});
