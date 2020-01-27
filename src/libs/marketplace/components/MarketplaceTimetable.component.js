// @flow

import React, { PureComponent } from 'react';
import flatten from 'lodash/flatten';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';
import memoize from 'memoize-one';

import { DATE_FORMAT } from '../../../datetime';

import type { Offer } from '../types';
import MarketplaceListItemOffer from './MarketplaceListItemOffer.component';

type Props = {
  offers: ?Array<Offer>,
  date: Object,
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  t: TFunction,
  classes: Object,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  showOfferFilling: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
};

const getWeekOffers = memoize((selectedDate, offers) => {
  const date_start = moment(selectedDate, DATE_FORMAT)
    .clone()
    .startOf('week');
  const weekdays = moment.weekdays(true);
  // split offers par week days
  return weekdays.map((day, i) => {
    const currentDate = moment(date_start).add(i, 'days');
    return offers.filter(
      (o) =>
        currentDate.weekday() === i &&
        moment(o.date_start).isSame(currentDate, 'day'),
    );
  });
});

export class MarketplaceTimetable extends PureComponent<Props> {
  renderDayOffers(offers: Array<*>, i: number) {
    const { date, classes } = this.props;
    if (!offers || offers.length === 0) return null;

    return (
      <div className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          {moment(date, DATE_FORMAT)
            .clone()
            .add(i, 'days')
            .format('dddd Do MMMM')}
        </Typography>
        <Divider />
        <List disablePadding>
          {offers.map((o) => (
            <MarketplaceListItemOffer
              coachLoading={this.props.coachLoading}
              establishmentLoading={this.props.establishmentLoading}
              activityLoading={this.props.activityLoading}
              showOfferFilling={this.props.showOfferFilling}
              key={o.id}
              offer={o}
              onClickOffer={this.props.onClickOffer}
              onClickBook={() => this.props.onClickBook(o.id)}
              onClickBookOption={() => this.props.onClickBookOption(o.id)}
            />
          ))}
        </List>
      </div>
    );
  }

  renderContent = () => {
    const { date, classes, t } = this.props;
    const weekday = moment(date, DATE_FORMAT).weekday();
    // split offer for the selected day
    const weekOffers = getWeekOffers(date, this.props.offers);
    const nextDaysOffers = weekOffers.slice(weekday);

    return !flatten(weekOffers).length ? (
      <Typography variant="caption" className={classes.title}>
        {t('marketplace.noSessionToday')}
      </Typography>
    ) : (
      nextDaysOffers.map((offers, i) => this.renderDayOffers(offers, i))
    );
  };

  render() {
    const { loading, offers } = this.props;
    return !offers || loading ? <CircularProgress /> : this.renderContent();
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  title: {
    margin: theme.spacing.unit * 2,
  },
  emptyContent: {
    margin: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(MarketplaceTimetable));
