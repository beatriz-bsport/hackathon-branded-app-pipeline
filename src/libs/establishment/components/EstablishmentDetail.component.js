// @flow

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SPORTS from '@bsport/common/lib/master-data/sports';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Moment from 'moment';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

import type { Establishment, Offer } from '../../../api/types';

import { TimeTable, Calendar } from '../../../components';
import Map from '../../../components/map/Map.component';
import EasyAccessStack from '../../category/components/EasyAccessStack.component';

const DEFAULT_SPORT = 7;

type Props = {
  timetableLoading: boolean,
  offers: Array<Offer>,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  goToOffer: (offerId: number) => void,
  goToEditForm: () => void,
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

  renderCalendar = (establishment: Establishment) => {
    const { offers, timetableLoading } = this.props;
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
      <div>
        <Calendar
          events={events_}
          onDateClick={this.onDateClick(establishment.id)}
          date={selectedDay[establishment.id] || Moment()}
        />
        <TimeTable
          loading={timetableLoading}
          offers={offers.filter((o) => o.etablissement.id === establishment.id)}
          establishmentId={establishment.id}
          date={selectedDay[establishment.id]}
          onOfferSelected={(o) => this.props.goToOffer(o.id)}
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
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <Typography variant="h4" color="textPrimary" gutterBottom>
                    {establishment.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={this.props.goToEditForm} color="primary">
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
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
                  {t('common.description')}
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
    margin: theme.spacing.unit * 2,
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
    paddingTop: theme.spacing.unit * 2,
  },
  easyAccess: {
    marginBottom: theme.spacing.unit,
  },
});

export default withNamespaces([])(withStyles(styles)(EstablishmentDetail));
