// @flow
import React, { Component } from 'react';
import {
  List,
  CircularProgress,
  Typography,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import MarketplaceOffer from './MarketplaceOffer.component';
import { formatAsDate } from '../../datetime';

type Props = {
  offers: ?Array<Offer>,
  date: Object,
  loading: boolean,
  classes: Object,
  t: TFunction,
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
          <MarketplaceOffer key={o.id} offer={o} />
        ))}
      </List>
    );
  };

  render() {
    const { date, t, classes } = this.props;
    return (
      <div>
        <Typography variant="title" className={classes.title}>
          {`${formatAsDate(date)} - ${t('marketplace.sessionThisDay')}`}
        </Typography>
        {this.renderContent()}
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit,
  },
  emptyContent: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default translate()(withStyles(styles)(MarketplaceTimetable));
