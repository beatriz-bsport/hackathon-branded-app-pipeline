import React, { Component } from 'react';

import { connect } from 'react-redux';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

import 'fullcalendar';

import { CircularProgress, Grid, Paper } from '@material-ui/core';

import { offer as offerActions } from '../actions';

moment.locale('fr');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const NOW = new Date();
const BUSINESS_HOURS = {
  start: new Date(moment('2018/05/01 8:00')),
  end: new Date(moment('2018/05/01 22:00')),
};

export class Calendar extends Component {
  componentDidMount() {
    this.props.fetchAllOffers();
  }

  render() {
    return (
      <Grid container>
        <Paper
          style={{
            padding: 50,
            minHeight: 300,
            maxHeight: '100%',
            flexGrow: 1,
          }}
        >
          {this.props.loading ? <CircularProgress /> : null}
          <BigCalendar
            defaultDate={NOW}
            defaultView="week"
            views={['week', 'month', 'day']}
            min={BUSINESS_HOURS.start}
            max={BUSINESS_HOURS.end}
            events={this.props.offers.asMutable()}
          />
        </Paper>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.all,
    loading: state.offer.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
