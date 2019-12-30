// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';

import type { CoachDetailed as Coach } from '../../../api/types';

import { DEFAULT_AVATAR } from '../utils';

type Props = {
  coach: Coach,
  onDelete?: () => void,
  onClick?: () => void,
  clearIcon: boolean,
  divider?: boolean,
};

export function CoachListItem(props: Props) {
  const { coach, onDelete, onClick } = props;
  return (
    <ListItem
      key={coach.id}
      button={!!onClick}
      onClick={onClick}
      divider={props.divider}
    >
      <ListItemAvatar>
        <Avatar src={coach.photo || DEFAULT_AVATAR} />
      </ListItemAvatar>
      <ListItemText primary={coach.name} />
      <ListItemSecondaryAction>
        {props.onDelete ? (
          <IconButton onClick={onDelete}>
            {props.clearIcon ? <ClearIcon /> : <DeleteIcon />}
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default CoachListItem;
