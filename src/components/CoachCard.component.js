import React, { Component } from 'react';

import {
  Grid,
  Paper,
  Divider,
  Typography,
  List,
  ListItem,
  withStyles,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Avatar, ActivityMinimalSummary } from '../components';

const OVERFLOW = 100;

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit,
    marginTop: OVERFLOW,
  },
});
export class CoachCard extends Component {
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
                <IconButton>
                  <CallIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <div style={{ marginTop: -OVERFLOW }}>
                  {coach ? <Avatar user={coach} variant="large" /> : null}
                </div>
              </Grid>
              <Grid item>
                <IconButton>
                  <EmailIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <Typography variant="title">
                  {t('common.activities')}
                </Typography>
              </Grid>
              <Grid item>{this.getActivityList()}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button size="small" color="primary">
              {t('common.showDetails')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(CoachCard));
