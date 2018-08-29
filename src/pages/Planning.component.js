import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withStyles, Paper, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import { OfferCard, TimeTable, Calendar } from '../components';

import { Moment } from '../i18n';

const styles = (theme) => ({
  calendarContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
});

export class Planning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOffer: null,
      date: Moment()
        .set('hours', 0)
        .set('minutes', 0)
        .set('milliseconds', 0),
    };
  }

  onDateClick = (date) => {
    this.setState({ date });
    this.setState({ selectedOffer: null });
  };

  onOfferSelected = (offer) => {
    this.setState({ selectedOffer: offer });
  };

  renderNoOfferSelected = () => {
    const { t, classes } = this.props;
    return (
      <Typography variant="caption" className={classes.emptyOffer}>
        {t('calendar.pleaseSelectOffer')}
      </Typography>
    );
  };

  render() {
    const { offers, classes } = this.props;
    const { date, selectedOffer } = this.state;
    const events = {};
    offers.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events[midnight]) {
        events[midnight] = [];
      }
      events[midnight].push(o);
    });
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.calendarContainer}>
                  <Calendar events={events} onDateClick={this.onDateClick} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <TimeTable date={date} onOfferSelected={this.onOfferSelected} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <OfferCard offer={selectedOffer} />
          </Grid>
        ) : (
          this.renderNoOfferSelected()
        )}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
  };
}
export default translate()(
  withRouter(connect(mapStateToProps)(withStyles(styles)(Planning))),
);
