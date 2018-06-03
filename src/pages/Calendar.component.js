import React, { Component } from 'react';

import { connect } from 'react-redux';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr';
import { translate } from 'react-i18next';

import 'fullcalendar';

import {
  withStyles,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';

import { offer as offerActions } from '../actions';
import FRENCH_PACK from '../i18n/french.translation';
import { OfferCard } from '../components';

moment.locale('fr');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const NOW = new Date();
const BUSINESS_HOURS = {
  start: new Date(moment('2018/05/01 9:00')),
  end: new Date(moment('2018/05/01 18:00')),
};

const styles = (theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    color: theme.palette.text.secondary,
  },
});

export class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOffer: null,
    };
  }

  selectEvent = (event) => {
    this.setState({ selectedOffer: event });
  };

  getCalendar = () => {
    const { i18n } = this.props;

    const { language } = i18n;
    const messages =
      language === 'fr-FR' ? FRENCH_PACK.translation.calendar : null;
    const { calendar } = this.props;
    const events = calendar.map((e) => {
      return {
        ...e,
        title: e.name,
        start: new Date(e.date_start),
        end: new Date(e.date_end),
      };
    });

    return (
      <Paper>
        <Grid container>
          <Grid item xs={12}>
            {this.props.loading ? <CircularProgress /> : null}
            <BigCalendar
              style={{
                minHeight: 270,
                width: '100%',
                maxHeight: '100%',
                maxWidth: '100%',
                flexGrow: 1,
              }}
              defaultDate={NOW}
              defaultView="day"
              views={['day', 'week', 'month']}
              min={BUSINESS_HOURS.start}
              max={BUSINESS_HOURS.end}
              events={events}
              components={{
                event: EventSmall,
              }}
              onSelectEvent={(ev) => this.selectEvent(ev)}
              messages={messages}
              culture={language}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  render() {
    const { selectedOffer } = this.state;
    return (
      <Grid container spacing={16} direction="row">
        <Grid item xs={12} lg={6}>
          {this.getCalendar()}
        </Grid>
        {selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <OfferCard offer={selectedOffer} />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

function EventSmall(props) {
  const { nb_validated, effectif, name } = props.event;
  return (
    <div>
      <strong>{name}</strong> {nb_validated}/{effectif}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    calendar: state.offer.calendar,
    loading: state.offer.loading,
  };
}

export default connect(mapStateToProps)(
  translate()(withStyles(styles)(Calendar)),
);
