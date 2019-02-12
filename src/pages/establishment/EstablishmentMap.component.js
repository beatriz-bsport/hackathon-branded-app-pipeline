// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import i18next from 'i18next';
import {
  establishment as establishmentActions,
  offer as offerActions,
} from '../../actions';
import { EstablishmentCard, TimeTable, Calendar, Map } from '../../components';
import { Moment } from '../../i18n';
import type { Establishment, Activity, Offer } from '../../api/types';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  timetableLoading: boolean,
  establishmentsLoading: boolean,
  establishments: Array<Establishment>,
  activities: Array<Activity>,
  offers: Array<Offer>,

  startUpdateEstablishment: (*) => void,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,

  classes: Object,
  t: TFunction,
};

type State = {
  selectedDay: Object,
};

export class EstablishmentList extends Component<Props, State> {
  state = {
    selectedDay: {},
  };

  onDateClick = (establishmentId: number) => (date: Object) => {
    const { selectedDay } = this.state;
    selectedDay[establishmentId] = date.startOf('day');
    this.setState({ selectedDay });
    const momentDay = Moment(date);
    this.props.fetchOffersByDay({
      year: momentDay.year(),
      month: momentDay.month() + 1,
      day: momentDay.date(),
    });
  };

  renderEstablishment = (establishment: Establishment) => (
    <Grid container direction="row" spacing={16}>
      <Grid item xs={12} md={6}>
        <EstablishmentCard
          establishment={establishment}
          allActivities={this.props.activities}
          // prettier-ignore
          onClickUpdate={() => this.props.startUpdateEstablishment(establishment)}
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
    const offersInEstablishment = establishment.events;
    const events_ = {};
    // eslint-disable-next-line
    for (const o of offersInEstablishment) {
      const midnight = Moment(o.date_start).startOf('day');
      // eslint-disable-next-line
      if (events_.hasOwnProperty(midnight)) {
        events_[midnight].push(o);
      } else {
        events_[midnight] = [o];
      }
    }
    return (
      <Paper className={classes.paperContainer}>
        <div className={classes.calendarContainer}>
          <Calendar
            events={events_}
            onDateClick={this.onDateClick(establishment.id)}
            date={selectedDay[establishment.id] || Moment()}
          />
        </div>
        <TimeTable
          loading={timetableLoading}
          activities={activities}
          offers={offers.filter((o) => o.etablissement.id === establishment.id)}
          establishmentId={establishment.id}
          date={selectedDay[establishment.id]}
          onOfferSelected={() => {}}
        />
      </Paper>
    );
  };

  render() {
    const { classes, establishmentsLoading, establishments } = this.props;
    if (establishmentsLoading) {
      return <CircularProgress />;
    }
    return (
      <div className={classes.root}>
        <Paper className={classes.map}>
          <Map markers={establishments} markerClicked={() => {}} />
        </Paper>
        <Grid container direction="column" spacing={32}>
          {establishments.map((e) => (
            <Grid key={e.id} item>
              {this.renderEstablishment(e)}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    establishentsLoading: state.establishment.loading,
    establishments: state.establishment.all,
    offers: state.offer.offers,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
  };
}

const styles = (theme) => ({
  root: {},
  emptyEstablishment: {
    padding: theme.spacing.unit * 3,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
    paddingRight: 0,
  },
  map: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  calendarContainer: {
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  translate(),
  connect(
    mapStateToProps,
    {
      startUpdateEstablishment: establishmentActions.startUpdate,
      fetchOffersByDay: offerActions.fetchOffersByDay,
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/establishments/add',
      text: i18next.t('establishment.addButton'),
    },
  }),
)(withDrawer('establishmentList')(EstablishmentList));
