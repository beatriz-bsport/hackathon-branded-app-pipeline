// @flow
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import type { ShopItem } from '../types';

type Props = {
  shopitem: ShopItem,
  onClick?: () => void,
  onDelete?: () => void,
  additionalActions?: any,
  dense?: boolean,
  isFocused?: boolean,
};

export default (props: Props) => {
  if (!props.shopitem) {
    return (
      <ListItem dense={props.dense} divider>
        <CircularProgress />
      </ListItem>
    );
  }
  return (
    <ListItem
      dense={props.dense}
      divider
      button={!!props.onClick}
      onClick={props.onClick}
      style={props.isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemAvatar>
        <Avatar src={props.shopitem.cover} />
      </ListItemAvatar>

      <ListItemText
        primary={`${props.shopitem.name} - ${props.shopitem.price}€`}
        secondary={props.shopitem.subtitle || props.shopitem.name}
      />
      {props.additionalActions}
      {props.onDelete ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};
