// @flow

import React, { Component } from 'react';
import flatten from 'lodash/flatten';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Offer } from '../types';
import MarketplaceListItemOffer from './MarketplaceListItemOffer.component';

type Props = {
  offers: ?Array<Offer>,
  weekOffers: Array<Array<Offer>>,
  date: Object,
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  t: TFunction,
  classes: Object,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  showOfferFilling: boolean,
};

export class MarketplaceTimetable extends Component<Props> {
  renderDayOffers(offers: Array<*>, i: number) {
    const { date, classes, t } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          {date
            .clone()
            .add(i, 'days')
            .format('dddd Do MMMM')}
        </Typography>
        <Divider />
        {offers && offers.length ? (
          <List disablePadding>
            {offers.map((o) => (
              <MarketplaceListItemOffer
                showOfferFilling={this.props.showOfferFilling}
                key={o.id}
                offer={o}
                onClickOffer={this.props.onClickOffer}
                onClickBook={() => this.props.onClickBook(o.id)}
                onClickBookOption={() => this.props.onClickBookOption(o.id)}
              />
            ))}
          </List>
        ) : (
          <Typography variant="caption" className={classes.title}>
            {t('marketplace.noSessionToday')}
          </Typography>
        )}
      </div>
    );
  }

  renderContent = () => {
    const { weekOffers, date, classes, t } = this.props;
    const weekday = date.weekday();
    // split offer for the selected day
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
