// @flow
import React, { Component } from 'react';

import {
  Grid,
  Paper,
  Typography,
  List,
  withStyles,
  IconButton,
  Tooltip,
  Button,
} from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Avatar from './Avatar.component';
import ActivityMinimalSummary from './activity/ActivityMinimalSummary.component';
import type { CoachDetailed } from '../api/types';

const OVERFLOW = 100;

type Props = {
  t: (x: string) => string,
  classes: Object,
  coach: CoachDetailed,
};

export class CoachCard extends Component<Props> {
  getActivityList = () => {
    const { t } = this.props;
    const { coach } = this.props;

    if (!coach || !coach.activities.length) {
      return <Typography variant="body1">{t('coach.noActivity')}</Typography>;
    }
    return (
      <List>
        {coach.activities.map((a) => (
          <Link
            to={`/activity/${a.meta_activity_id}`}
            style={{ textDecoration: 'none' }}
            key={a.id}
          >
            <ActivityMinimalSummary activity={a} />
          </Link>
        ))}
      </List>
    );
  };

  render() {
    const { coach, classes, t } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
              <Grid item>
                <Tooltip
                  title={coach.phone || t('common.NA')}
                  classes={{ tooltip: classes.lightTooltip }}
                >
                  <IconButton>
                    <CallIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <div style={{ marginTop: -OVERFLOW }}>
                  {coach ? <Avatar user={coach} variant="large" /> : null}
                </div>
              </Grid>
              <Grid item>
                <Tooltip
                  title={coach.email || t('common.NA')}
                  classes={{ tooltip: classes.lightTooltip }}
                >
                  <IconButton>
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="title">
                      {t('common.activities')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Link
                      to={`/coach/${coach.associated_coach_id}/performance`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button color='primary'>{t('coach.showPerformance')}</Button>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>{this.getActivityList()}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit,
    marginTop: OVERFLOW,
  },
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
});
export default withStyles(styles)(translate()(CoachCard));
