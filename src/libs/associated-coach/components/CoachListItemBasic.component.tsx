import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';

import type { CoachDetailed } from '../../../api/types';
import { DEFAULT_AVATAR } from '../utils';

type Props = {
  coach: CoachDetailed;
  onDelete?: () => void;
  onClick?: () => void;
  clearIcon: boolean;
  divider?: boolean;
};
export const CoachListItem: React.FC<Props> = ({
  coach,
  onDelete,
  onClick,
  clearIcon,
  divider,
}) => {
  if (!coach) {
    return <CircularProgress />;
  }
  return (
    <ListItem
      key={coach.id}
      button={!!onClick}
      onClick={onClick}
      divider={divider}
    >
      <ListItemAvatar>
        <Avatar src={coach.photo || DEFAULT_AVATAR} />
      </ListItemAvatar>
      <ListItemText primary={coach.name} />
      <ListItemSecondaryAction>
        {onDelete ? (
          <IconButton onClick={onDelete}>
            {clearIcon ? <ClearIcon /> : <DeleteIcon />}
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default CoachListItem;
