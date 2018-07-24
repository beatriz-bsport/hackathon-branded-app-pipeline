import React from 'react';

import {
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  IconButton,
  withStyles,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';

import { translate } from 'react-i18next';

import { Level, Sport } from '../components';

const styles = (theme) => ({
  listItem: {
    width: '100%',
  },
});

export function ActivityMinimalSummary(props) {
  const { activity, t, classes } = props;
  const {
    name,
    id,
    parent_category,
    level,
    etablissement,
    next_slot,
  } = activity;

  return (
    <ListItem key={id} dense button className={classes.listItem} divider>
      <IconButton disableRipple>
        <Sport parentCategory={parent_category} noname />
      </IconButton>
      <ListItemText primary={name} secondary={next_slot} />
    </ListItem>
  );
}

export default translate()(withStyles(styles)(ActivityMinimalSummary));
