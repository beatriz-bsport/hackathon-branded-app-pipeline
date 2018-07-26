import React from 'react';

import {
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  IconButton,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';

import { translate } from 'react-i18next';

import { Level, Sport, Avatar } from '../../components';

const styles = (theme) => ({
  listItem: {
    width: '100%',
  },
});

export function ActivityMinimalSummary(props) {
  const { activity, date, showCoach, t, classes } = props;
  const {
    name,
    id,
    parent_category,
    level,
    etablissement,
    next_slot,
    coach,
  } = activity;

  const dateToShow = date || next_slot;

  return (
    <ListItem key={id} dense button className={classes.listItem} divider>
      {showCoach ? (
        <Tooltip title={coach.name}>
          <IconButton disableRipple className={classes.noMargin}>
            <Avatar user={coach} variant="small" noname />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disableRipple>
          <Sport parentCategory={parent_category} noname />
        </IconButton>
      )}
      <ListItemText primary={name} secondary={dateToShow} />
      <ListItemText
        primary={etablissement.title}
        secondary={<Level noStyle levelId={level} variant="caption" />}
      />
    </ListItem>
  );
}

export default translate()(withStyles(styles)(ActivityMinimalSummary));
