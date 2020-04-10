// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

import type { Establishment } from '../../../api/types';

type Props = {
  establishment: Establishment,
  onClickEdit: ?() => void,
  onClick: ?() => void,
  divider: ?boolean,
  clearIcon: boolean,

  classes: Object,
};

const styles = (theme) => ({
  avatar: {
    width: theme.spacing.unit * 7,
    height: theme.spacing.unit * 7,
  },
});

export default withStyles(styles)((props: Props) => {
  const { classes, establishment, divider, onClick } = props;
  return (
    <ListItem
      divider={divider}
      button={!!onClick}
      onClick={onClick}
      alignItems="center"
      selected={props.selected}
    >
      <ListItemAvatar>
        <Avatar className={classes.avatar} alt="" src={establishment.cover} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="span" variant="subtitle1">
            {establishment.title}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        {props.onClickEdit ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickEdit();
            }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {props.onClickDelete ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              props.onClickDelete();
            }}
          >
            {props.clearIcon ? <ClearIcon /> : <DeleteIcon />}
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
});
