import React from 'react';
import {
  Grid,
  Typography,
  Tooltip,
  IconButton,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import Avatar from '../Avatar.component';

const styles = (theme) => ({
  noMargin: {
    margin: 0,
    padding: 0,
  },
});

export function ActivityBasicInfo(props) {
  const { classes } = props;
  const { name, coaches } = props.activity;
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
            <Grid item key={coach.id}>
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
