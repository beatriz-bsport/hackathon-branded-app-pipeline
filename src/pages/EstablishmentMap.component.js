import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { EstablishmentCard, TimeTable, Calendar, Map } from '../components';
import { Moment } from '../i18n';

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

type Props = {
  establishments: Array,
};

export class EstablishmentList extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selectedEstablishment: null,
      selectedDay: Moment().startOf('day'),
    };
  }

  onDateClick = (date) => {
    this.setState({ selectedDay: date.startOf('day') });
  };

  establishmentSelected = (establishmentId) => {
    const { establishments } = this.props;

    const selectedEstablishment =
      establishments.filter((e) => e.id === establishmentId)[0] || null;
    this.setState({
      selectedEstablishment,
    });
  };

  renderEstablishment = () => {
    const { selectedEstablishment } = this.state;
    if (selectedEstablishment) {
      return <EstablishmentCard establishment={selectedEstablishment} />;
    }
    return null;
  };

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

  renderCalendar = () => {
    const { offers, t, classes } = this.props;
    const { selectedEstablishment, selectedDay } = this.state;
    const offersInEstablishment = offers.filter(
      (o) =>
        parseInt(o.etablissement.id, 10) ===
        parseInt(selectedEstablishment.id, 10),
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
        <Typography variant="title" className={classes.title}>
          {t('establishment.offers')}
        </Typography>
        <Paper className={classes.paperContainer}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <div className={classes.calendarContainer}>
                <Calendar events={events} onDateClick={this.onDateClick} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <TimeTable
                establishmentId={selectedEstablishment.id}
                date={selectedDay}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };
  render() {
    const { classes, t, loading, establishments } = this.props;
    const { selectedEstablishment } = this.state;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Map
              markers={establishments}
              markerClicked={this.establishmentSelected}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedEstablishment
            ? this.renderEstablishment()
            : this.renderNoEstablishment()}
        </Grid>
        <Grid item xs={12}>
          {selectedEstablishment ? this.renderCalendar() : null}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.establishment.loading,
    establishments: state.establishment.all,
    offers: state.offer.calendar,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(EstablishmentList)),
);
