// @flow

import moment from 'moment';
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import MarketplaceOffer from './MarketplaceOffer.component';

type Props = {
  offers: ?Array<Offer>,
  date: Object,
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  t: TFunction,
  classes: Object,
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
      <List>
        {offers.map((o) => (
          <MarketplaceOffer
            key={o.id}
            offer={o}
            onClickOffer={this.props.onClickOffer}
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
          {moment(date).format('dddd Do MMMM')}
        </Typography>
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
