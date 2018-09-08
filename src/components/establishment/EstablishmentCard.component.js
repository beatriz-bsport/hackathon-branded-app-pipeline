// @flow

import React, { Component } from 'react';

import {
  withStyles,
  Paper,
  Typography,
  Grid,
  Divider,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import type { Activity, Establishment } from '../../api/types';

const DEFAULT_SPORT = 7;

type Props = {
  establishment: Establishment,
  classes: Object,
  allActivities: Array<Activity>,
  t: (x: string) => string,
};

const styles = (theme) => ({
  noMoreOffersMessage: {
    margin: theme.spacing.unit * 2,
  },
  horizontalBlock: {
    margin: theme.spacing.unit * 2,
  },
  subHorizontalBlock: {
    marginTop: theme.spacing.unit,
  },
  imgStyle: {
    backgroundColor: 'rgba(50,50,50,.5)',
    minHeight: '200px',
    width: '100%',
    objectFit: 'cover',
  },
});

export class EstablishmentCard extends Component<Props> {
  getCover = () => {
    const { classes, establishment } = this.props;
    const { cover } = establishment;
    const sport = SPORTS.filter((s) => DEFAULT_SPORT === s.id)[0];

    if (!cover) {
      // TODO clean this shit
      return (
        <div style={{ position: 'relative' }}>
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.imgStyle}
          >
            <Grid item>
              <img style={{ margin: 'auto' }} src={sport.icon} alt="sport" />
            </Grid>
          </Grid>
        </div>
      );
    }
    return (
      <div style={{ position: 'relative' }}>
        <img
          className={classes.imgStyle}
          src={cover}
          alt="establishment-cover"
        />
      </div>
    );
  };

  render() {
    const { classes, t, establishment, allActivities } = this.props;
    const { title, specific_info, activities, location } = establishment;
    // activities in establishment props are simplified, getting the full object
    const establishmentActivitiesId = activities.map((a) => a.id);
    const establishmentActivities = allActivities.filter((a) =>
      establishmentActivitiesId.includes(a.id),
    );
    return (
      <Paper className={classes.container}>
        <Grid container direction="column">
          <Grid item>{this.getCover()}</Grid>
          <Grid item className={classes.horizontalBlock}>
            <Typography variant="title">{title}</Typography>
            <Typography
              variant="caption"
              className={classes.subHorizontalBlock}
            >
              {location.address}
            </Typography>
          </Grid>
          {specific_info ? (
            <Grid item className={classes.horizontalBlock}>
              <Typography variant="body">{specific_info}</Typography>
            </Grid>
          ) : null}
          <Divider />
          <Grid item>
            {establishmentActivities.length ? (
              establishmentActivities.map((a) => (
                <Link
                  to={`/activity/${a.meta_activity_id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <ActivityMinimalSummary
                    activity={a}
                    key={a.id}
                    showCoach
                    showCoachName
                  />
                </Link>
              ))
            ) : (
              <Typography
                variant="caption"
                color="error"
                className={classes.noMoreOffersMessage}
              >
                {t('establishment.noMoreOffers')}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(translate()(EstablishmentCard));
