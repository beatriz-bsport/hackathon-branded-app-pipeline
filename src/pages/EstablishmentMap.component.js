// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';

import { Link } from 'react-router-dom';

import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  withStyles,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { EstablishmentCard, TimeTable, Calendar, Map } from '../components';
import { Moment } from '../i18n';
import type { Establishment, Activity, Offer } from '../api/types';

type Props = {
  timetableLoading: boolean,
  establishmentsLoading: boolean,
  establishments: Array<Establishment>,
  activities: Array<Activity>,
  offers: Array<Offer>,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  selectedDay: Object,
};

export class EstablishmentList extends Component<Props, State> {
  state = {
    selectedDay: Moment().startOf('day'),
  };

  onDateClick = (establishmentId: number) => (date: Object) => {
    const { selectedDay } = this.state;
    selectedDay[establishmentId] = date.startOf('day');
    this.setState({ selectedDay });
  };

  renderEstablishment = (establishment: Establishment) => (
    <Grid container direction="row" spacing={16}>
      <Grid item xs={12} md={6}>
        <EstablishmentCard
          establishment={establishment}
          allActivities={this.props.activities}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        {this.renderCalendar(establishment)}
      </Grid>
    </Grid>
  );

  renderNoEstablishment = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.emptyEstablishment}>
        <Typography variant="caption">
          {t('establishment.pleaseSelectOne')}
        </Typography>
      </div>
    );
  };

  renderCalendar = (establishment: Establishment) => {
    const { offers, activities, timetableLoading, classes } = this.props;
    const { selectedDay } = this.state;
    const offersInEstablishment = offers.filter(
      (o) =>
        parseInt(o.etablissement.id, 10) === parseInt(establishment.id, 10),
    );
    const events = {};
    for (const o of offersInEstablishment) {
      const midnight = Moment(o.date_start).startOf('day');
      if (events.hasOwnProperty(midnight)) {
        events[midnight].push(o);
      } else {
        events[midnight] = [o];
      }
    }
    return (
      <div>
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes.calendarContainer}>
                <Calendar
                  events={events}
                  onDateClick={this.onDateClick(establishment.id)}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <TimeTable
                loading={timetableLoading}
                activities={activities}
                offers={offers}
                establishmentId={establishment.id}
                date={selectedDay[establishment.id]}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };

  render() {
    const { establishmentsLoading, establishments } = this.props;
    if (establishmentsLoading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Link to="/establishments/add" style={{ textDecoration: 'none' }}>
            <Button
              variant="extendedFab"
              aria-label="Add"
              className={classes.button}
              color="primary"
            >
              <AddIcon className={classes.extendedIcon} />
              {t('establishment.add.button')}
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Map markers={establishments} markerClicked={() => {}} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column" spacing={32}>
            {establishments.map((e) => (
              <Grid item>{this.renderEstablishment(e)}</Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    establishentsLoading: state.establishment.loading,
    establishments: state.establishment.all,
    offers: state.offer.calendar,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
  };
}

const styles = (theme) => ({
  emptyEstablishment: {
    padding: theme.spacing.unit * 3,
  },
  title: {
    margin: theme.spacing.unit * 2,
  },
  paperContainer: {
    padding: theme.spacing.unit * 3,
    paddingRight: 0,
  },
  calendarContainer: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(EstablishmentList)),
);
