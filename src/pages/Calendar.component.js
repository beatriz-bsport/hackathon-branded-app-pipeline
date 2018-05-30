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
  start: new Date(moment('2018/05/01 8:00')),
  end: new Date(moment('2018/05/01 22:00')),
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
      selectedOffer: { title: '' },
    };
  }

  componentDidMount() {
    this.props.fetchAllOffers();
  }

  selectEvent = (event) => {
    this.setState({ selectedOffer: event });
  };

  render() {
    const { i18n, classes } = this.props;
    const { selectedOffer } = this.state;

    const { language } = i18n;
    const messages =
      language === 'fr-FR' ? FRENCH_PACK.translation.calendar : null;
    return (
      <Grid container spacing={16} direction="row" wrap>
        <Grid item xs={12} lg={6}>
          <Paper
            style={{
              padding: 30,
              flexGrow: 1,
            }}
          >
            {this.props.loading ? <CircularProgress /> : null}
            <BigCalendar
              style={{
                minHeight: 280,
                maxHeight: '100%',
                maxWidth: '100%',
                flexGrow: 1,
              }}
              defaultDate={NOW}
              defaultView="week"
              views={['week', 'month', 'day']}
              min={BUSINESS_HOURS.start}
              max={BUSINESS_HOURS.end}
              events={this.props.offers.asMutable()}
              onSelectEvent={(ev) => this.selectEvent(ev)}
              messages={messages}
              culture={language}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <OfferCard offer={selectedOffer} />
        </Grid>
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
export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(withStyles(styles)(Calendar)),
);
