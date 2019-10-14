// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import type { PrivateService } from '../types';

type Props = {
  privateService: PrivateService,
  onClick: () => void,
  selected: boolean,
  hideSecondary: boolean,
  onDelete: () => void,
};
export const PrivateServiceListItem = (props: Props) => {
  const { privateService, onClick } = props;
  return (
    <ListItem
      button={!!onClick}
      divider
      selected={props.selected}
      onClick={onClick ? () => onClick(privateService.id) : null}
    >
      <ListItemText
        primary={privateService.name}
        secondary={
          props.hideSecondary
            ? null
            : privateService.coaches.map((c) => (c && c.name) || '').join(', ')
        }
      />
      <ListItemSecondaryAction>
        {props.onClick ? (
          <IconButton color="primary">
            <ArrowForwardIcon />
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

export default PrivateServiceListItem;
