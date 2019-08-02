// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import { TimeTable, Calendar } from '../../../components';
import EstablishmentCard from './EstablishmentCard.component';
import { Moment } from '../../../i18n';
import type { Establishment, Activity, Offer } from '../../../api/types';

type Props = {
  establishment: Establishment,
  timetableLoading: boolean,
  offers: Array<Offer>,

  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToEditForm: (establishment: Establishment) => void,
  goToOffer: (offerId: number) => void,

  classes: Object,
};

type State = {
  selectedDay: Object,
};

export class EstablishmentCardItem extends Component<Props, State> {
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

  renderCalendar = (establishment: Establishment) => {
    const { offers, timetableLoading, classes } = this.props;
    const { selectedDay } = this.state;
    const offersInEstablishment = establishment.events;
    const events_ = {};
    for (const o of offersInEstablishment) {
      const midnight = Moment(o.date_start).startOf('day');
      if (Object.hasOwnProperty.call(events_, midnight)) {
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
          offers={offers.filter((o) => o.etablissement.id === establishment.id)}
          establishmentId={establishment.id}
          date={selectedDay[establishment.id]}
          onOfferSelected={(o) => this.props.goToOffer(o.id)}
        />
      </Paper>
    );
  };

  render() {
    const { establishment } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} md={6}>
          <EstablishmentCard
            establishment={establishment}
            onClickUpdate={() => this.props.goToEditForm(establishment)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {this.renderCalendar(establishment)}
        </Grid>
      </Grid>
    );
  }
}
const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 2,
    paddingRight: 0,
  },
  calendarContainer: {
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
)(EstablishmentCardItem);
