// @flow

import moment from 'moment';
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
        <Typography variant="title" className={classes.title}>
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

export default translate()(withStyles(styles)(MarketplaceTimetable));
