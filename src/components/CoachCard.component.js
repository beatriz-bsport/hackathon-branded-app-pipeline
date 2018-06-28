import React, { Component } from 'react';

import {
  Grid,
  Paper,
  Divider,
  Typography,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { CoachThumbnail, ActivityMinimalSummary } from '../components';

const OVERFLOW = 110;

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 4,
    marginTop: OVERFLOW,
  },
});
export class CoachCard extends Component {
  getActivityList = () => {
    return (
      <Grid container direction="column" spacing={16}>
        {this.props.coach.activities.map((a) => (
          <Grid item>
            <ActivityMinimalSummary activity={a} />
            <Divider />
          </Grid>
        ))}
      </Grid>
    );
  };

  render() {
    const { coach, classes, t } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <div style={{ marginTop: -OVERFLOW }}>
              <CoachThumbnail coach={coach} variant="large" />
            </div>
          </Grid>
          <Grid item>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <Typography variant="title2">
                  {t('common.activities')}
                </Typography>
              </Grid>
              <Grid item>{this.getActivityList()}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(CoachCard));
