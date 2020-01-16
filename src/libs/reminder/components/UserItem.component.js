// @flow

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export const UserItem = (props: {
  isFocused: boolean,
  isSelected: boolean,
  onDelete?: () => void,
  user: { last_name: string, first_name: string, id: number, email: string },
}) => {
  const { user, isSelected, isFocused } = props;
  return (
    <ListItem
      dense
      selected={!!isSelected}
      style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
    >
      <ListItemText primary={user ? user.email : ' - '} />
      <ListItemSecondaryAction>
        {props.onDelete ? (
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default UserItem;
