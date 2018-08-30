import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';

const styles = () => ({
  container: {},
});

type Props = {
  booking: Object,
};

export class BookingListItem extends Component<Props> {
  render() {
    const { booking, nb_place } = this.props;
    const { offer } = booking;
    const { activity, date_start } = offer;
    return (
      <ActivityMinimalSummary activity={activity} date={offer.date_start} />
    );
  }
}

export default withStyles(styles)(translate()(BookingListItem));
