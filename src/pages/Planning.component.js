import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Paper, Grid, Typography } from '@material-ui/core';
import { OfferCard, TimeTable, Calendar } from '../components';
import { activity as activityActions } from '../actions';

import { translate } from 'react-i18next';
import { Moment } from '../i18n';

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

  render() {
    const { t, offers } = this.props;
    const { date, selectedOffer } = this.state;
    const events = {};
    for (const o of offers) {
      const midnight = Moment(o.date_start).startOf('day');
      if (events.hasOwnProperty(midnight)) {
        events[midnight].push(o);
      } else {
        events[midnight] = [o];
      }
    }
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Calendar events={events} onDateClick={this.onDateClick} />
            </Grid>
            <Grid item xs={12}>
              <TimeTable date={date} onOfferSelected={this.onOfferSelected} />
            </Grid>
          </Grid>
        </Grid>
        {selectedOffer ? (
          <Grid item xs={12} md={6}>
            <OfferCard offer={selectedOffer} />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
  };
}
export default translate()(connect(mapStateToProps)(Planning));
