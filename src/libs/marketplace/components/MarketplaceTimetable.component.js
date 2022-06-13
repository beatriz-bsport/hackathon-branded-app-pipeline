// @flow

import React, { PureComponent } from 'react';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import memoize from 'memoize-one';

import { DATE_FORMAT } from '../../../utils/datetime';

import type { Offer } from '../types';
import OfferListItemConsumer from '../../offer/components/OfferListItemConsumer.component';
import MarketplaceBookButton from './MarketplaceBookButton.component';
import { isOfferInThePast } from '../../offer/utils';

type Props = {
  offers: ?Array<Offer>,
  date: Object,
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  classes: Object,
  onClickBook: (offer: Offer) => void,
  onClickBookOption: (offer: Offer) => void,
  showOfferFilling: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
  showOfferGender: boolean,
  hideCoach: boolean,
  bookedOffers?: number[],
};

const getWeekOffers = memoize((selectedDate, offers) => {
  const date_start = moment(selectedDate, DATE_FORMAT).clone().startOf('week');
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
  handleBook = (offfer) => () => {
    this.props.onClickBook(offfer);
  };

  handleBookOption = (offfer) => () => {
    this.props.onClickBookOption(offfer);
  };

  handleClick = (offer) => () => {
    const isInThePast = isOfferInThePast(offer);

    if (!this.props.onClickOffer || !isInThePast) {
      return;
    }
    this.props.onClickOffer(offer.id);
  };

  renderDayOffers(offers: Array<*>, i: number) {
    const { date, classes, bookedOffers } = this.props;
    if (!offers || offers.length === 0) return null;
    const displayedDate = moment(date, DATE_FORMAT)
      .clone()
      .add(i, 'days')
      .format('dddd Do MMMM');

    return (
      <div key={displayedDate} className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          {displayedDate}
        </Typography>
        <Divider />
        <List disablePadding>
          {offers.map((o) => {
            const isInThePast = isOfferInThePast(o);

            return (
              <OfferListItemConsumer
                coachLoading={this.props.coachLoading}
                establishmentLoading={this.props.establishmentLoading}
                activityLoading={this.props.activityLoading}
                hideCoach={this.props.hideCoach}
                showOfferFilling={this.props.showOfferFilling}
                key={o.id}
                offer={o}
                onClick={this.handleClick(o)}
                isRegistered={
                  bookedOffers?.length ? bookedOffers.includes(o.id) : false
                }
                actions={
                  <div className={classes.inlineContainer}>
                    <Hidden xsDown>
                      <IconButton
                        disabled={!isInThePast}
                        onClick={this.handleClick(o)}
                        color="secondary"
                      >
                        <InfoIcon />
                      </IconButton>
                    </Hidden>
                    <MarketplaceBookButton
                      showOfferGender={this.props.showOfferGender}
                      onClickBook={this.handleBook(o)}
                      onClickBookOption={this.handleBookOption(o)}
                      offer={o}
                    />
                  </div>
                }
              />
            );
          })}
        </List>
      </div>
    );
  }

  render() {
    const { loading, offers, date } = this.props;

    if (!offers || loading) {
      return <CircularProgress />;
    }

    const weekday = moment(date, DATE_FORMAT).weekday();
    // split offer for the selected day
    const weekOffers = getWeekOffers(date, this.props.offers);
    const nextDaysOffers = weekOffers.slice(weekday);

    return (
      <>
        {nextDaysOffers.map((dayOffers, i) =>
          this.renderDayOffers(dayOffers, i),
        )}
      </>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  title: {
    margin: theme.spacing(2),
  },
  emptyContent: {
    margin: theme.spacing(2),
  },
  inlineContainer: { alignItems: 'center', display: 'flex' },
});

export default withTranslation()(withStyles(styles)(MarketplaceTimetable));
