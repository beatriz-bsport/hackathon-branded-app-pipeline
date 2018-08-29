import React, { Component } from 'react';

import { Typography, Grid, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';

const styles = () => ({
  container: {},
});

type Props = {
  offer: Object,
};

export class OfferSummary extends Component<Props> {
  render() {
    const { offer } = this.props;
    return (
      <ActivityMinimalSummary
        date={offer.date_start}
        activity={offer.activity}
        noDivider
      />
    );
  }
}

export default withStyles(styles)(translate()(OfferSummary));
