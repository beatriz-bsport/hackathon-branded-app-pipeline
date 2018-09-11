// @flow
import React, { Component } from 'react';

import { translate } from 'react-i18next';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import { formatAsDatetime } from '../../datetime';
import type { Booking } from '../../api/types';

type Props = {
  booking: Booking,
};

export class BookingListItem extends Component<Props> {
  render() {
    const { booking } = this.props;
    const { offer } = booking;
    const { activity } = offer;
    return (
      <ActivityMinimalSummary
        activity={activity}
        date={formatAsDatetime(offer.date_start)}
      />
    );
  }
}

export default translate()(BookingListItem);
