// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import type { Establishment } from '../../../api/types';

type Props = {
  establishment: Establishment,
  divider: ?boolean,
  classes: Object,
};

const styles = (theme) => ({
  avatar: {
    width: theme.spacing.unit * 7,
    height: theme.spacing.unit * 7,
  },
});

export default withStyles(styles)((props: Props) => {
  const { classes, establishment, divider } = props;
  return (
    <Link to={`/establishment/details/${establishment.id}`}>
      <ListItem divider={divider} button alignItems="center">
        <ListItemAvatar>
          <Avatar className={classes.avatar} alt="" src={establishment.cover} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              {establishment.title}
            </Typography>
          }
          secondary={establishment.location.address}
        />
        <ListItemSecondaryAction>
          <Link to={`/establishment/edit/${establishment.id}`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
});
