// @flow

import React, { Component } from 'react';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
};

export class MarketplaceTimetable extends Component<Props> {
  renderContent = () => {
    const { loading, offers, t, classes } = this.props;
    if (!offers || loading) {
      return <CircularProgress />;
    }
    if (!offers.length) {
      return (
        <Typography variant="caption" className={classes.emptyContent}>
          {t('marketplace.noSessionToday')}
        </Typography>
      );
    }
    return (
      <List disablePadding>
        {offers.map((o) => (
          <MarketplaceListItemOffer
            key={o.id}
            offer={o}
            onClickOffer={this.props.onClickOffer}
            onClickBook={() => this.props.onClickBook(o.id)}
            onClickBookOption={() => this.props.onClickBookOption(o.id)}
          />
        ))}
      </List>
    );
  };

  render() {
    const { date, classes } = this.props;
    return (
      <div>
        <Typography variant="h6" className={classes.title}>
          {date.format('dddd Do MMMM')}
        </Typography>
        <Divider />
        {this.renderContent()}
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit * 2,
  },
  emptyContent: {
    margin: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(MarketplaceTimetable));
