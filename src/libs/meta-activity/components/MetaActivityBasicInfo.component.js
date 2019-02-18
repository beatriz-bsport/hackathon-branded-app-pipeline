// @flow
import React from 'react';
import {
  Grid,
  Typography,
  Tooltip,
  IconButton,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import Avatar from '../../../components/Avatar.component';
import type { MetaActivity } from '../../../api/types';

type Props = {
  classes: Object,
  metaActivity: MetaActivity,
};
export function MetaActivityBasicInfo(props: Props) {
  const { classes } = props;
  const { name, coaches } = props.metaActivity;
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h6">{name}</Typography>
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

const styles = () => ({
  noMargin: {
    margin: 0,
    padding: 0,
  },
});

export default translate()(withStyles(styles)(MetaActivityBasicInfo));
