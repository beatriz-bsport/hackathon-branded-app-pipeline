// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import type { ShopItem } from '../types';

type Props = {
  shopitem: ShopItem,
  onClick: ?() => void,
  additionalActions: ?any,
};

export default (props: Props) => (
  <ListItem divider button={!!props.onClick} onClick={props.onClick}>
    <ListItemAvatar>
      <Avatar src={props.shopitem.cover} />
    </ListItemAvatar>

    <ListItemText
      primary={`${props.shopitem.name} - ${props.shopitem.price}€`}
      secondary={props.shopitem.subtitle || props.shopitem.name}
    />
    {props.additionalActions}
  </ListItem>
);
