// @flow
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import SPORTS from '@bsport/common/lib/master-data/sports';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Moment from 'moment';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

import type { Establishment, Offer } from '../../../api/types';

import { TimeTable, Calendar } from '../../../components';
import Map from '../../../components/map/Map.component';
import EasyAccessStack from '../../category/components/EasyAccessStack.component';
import { DATE_FORMAT } from '../../../datetime';

const DEFAULT_SPORT = 7;

type Props = {
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  events: Array<Event>,
  classes: Object,
  t: TFunction,
  establishment: Establishment,
};

type State = {
  selectedDay: Object,
};

export class EstablishmentDetail extends Component<Props, State> {
  state = {
    selectedDay: {},
  };

  onDateClick = (establishmentId: number) => (date: string) => {
    const momentDay = Moment(date, DATE_FORMAT);
    const { selectedDay } = this.state;
    selectedDay[establishmentId] = momentDay.startOf('day');
    this.setState({ selectedDay });
    this.props.fetchOffersByDay(momentDay);
  };

  getCover = (establishment: Establishment) => {
    const { classes } = this.props;
    const { cover } = establishment;
    const sport = SPORTS.filter((s) => DEFAULT_SPORT === s.id)[0];

    if (!cover) {
      return (
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.imgStyle}
        >
          <Grid item>
            <img src={sport.icon} alt="sport" />
          </Grid>
        </Grid>
      );
    }
    return (
      <img className={classes.imgStyle} src={cover} alt="establishment-cover" />
    );
  };

  goToOffer = (o: Offer) => this.props.goToOffer(o.id);

  renderCalendar = (establishment: Establishment) => {
    const { offers, timetableLoading, events } = this.props;
    const { selectedDay } = this.state;
    const events_ = {};
    for (const o of events || []) {
      const midnight = Moment(o.date_start).startOf('day');
      if (Object.hasOwnProperty.call(events_, midnight)) {
        events_[midnight].push(o);
      } else {
        events_[midnight] = [o];
      }
    }
    return (
      <div>
        <Calendar
          events={events_}
          forceMonthDisplay
          onDateClick={this.onDateClick(establishment.id)}
          date={(selectedDay[establishment.id] || Moment()).format(DATE_FORMAT)}
        />
        <TimeTable
          loading={timetableLoading}
          offers={offers}
          onOfferSelected={this.goToOffer}
        />
      </div>
    );
  };

  render() {
    const { classes, t, establishment } = this.props;
    return (
      <Paper>
        <Grid container direction="row">
          <Grid item xs={12} md={6} className={classes.imgBackground}>
            <Grid container direction="column">
              <Grid item xs={12} md={12}>
                {this.getCover(establishment)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Map markers={[establishment]} markerClicked={() => {}} />
          </Grid>

          <Grid container direction="row">
            <Grid item sm={12} md={6} className={classes.generalInfoBlock}>
              <Typography variant="h4" gutterBottom>
                {establishment.title}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                {t('capacity.explain', {
                  count: establishment.capacity,
                  capacity: establishment.capacity,
                })}
              </Typography>
              <EasyAccessStack
                name={establishment.easy_access.name}
                lines={establishment.easy_access.lines}
                size="xs"
                className={classes.easyAccess}
              />
              <Typography variant="caption">
                {establishment.location.address}
              </Typography>
              <div className={classes.descriptionBlock}>
                <Typography variant="h5" gutterBottom>
                  {t('description')}
                </Typography>
                <TypographyMultiline>
                  {establishment.specific_info}
                </TypographyMultiline>
              </div>
            </Grid>
            <Grid item sm={12} md={6} className={classes.calendarBlock}>
              {this.renderCalendar(establishment)}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
const styles = (theme) => ({
  noMoreOffersMessage: {
    margin: theme.spacing(2),
  },
  imgBackground: {
    backgroundColor: '#f5f5f5',
  },
  imgStyle: {
    backgroundColor: 'rgba(50,50,50,.5)',
    minHeight: 200,
    maxHeight: 400,
    width: '100%',
    objectFit: 'cover',
    marginBottom: -6,
  },
  generalInfoBlock: {
    padding: 24,
  },
  calendarBlock: {
    borderLeft: '1px solid #EEEEEE',
    borderTop: '1px solid #EEEEEE',
    padding: 24,
    height: '100%',
  },
  descriptionBlock: {
    paddingTop: theme.spacing(2),
  },
  easyAccess: {
    marginBottom: theme.spacing(1),
  },
});

export default withTranslation(['establishment'])(
  withStyles(styles)(EstablishmentDetail),
);
