import React, { Component } from 'react';
import {
  Grid,
  Typography,
  ListItemText,
  ListItemIcon,
  List,
  ListItem,
  Tooltip,
  IconButton,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import { Avatar } from '../components';

const styles = (theme) => ({
  noMargin: {
    margin: 0,
    padding: 0,
  },
});

export function ActivityBasicInfo(props) {
  const { t, classes } = props;
  const { name, etablissements, coaches } = props.activity;
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        <Typography variant="title">{name}</Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row"
          spacing={8}
          justify="flex-end"
          alignItems="center"
        >
          {coaches.map((coach) => (
            <Grid item>
              <Tooltip title={coach.name}>
                <IconButton disableRipple className={classes.noMargin}>
                  <Avatar user={coach} variant="small" noname />
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default translate()(withStyles(styles)(ActivityBasicInfo));
