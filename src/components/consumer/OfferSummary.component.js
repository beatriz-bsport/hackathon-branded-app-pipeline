// @flow

import React from 'react';

import ActivityMinimalSummary from '../activity/ActivityMinimalSummary.component';
import { formatAsDatetime } from '../../datetime';
import type { Offer } from '../../api/types';

type Props = {
  offer: Offer,
};

export default function OfferSummary(props: Props) {
  const { offer } = props;
  return (
    <ActivityMinimalSummary
      date={formatAsDatetime(offer.date_start)}
      activity={offer.activity}
      noDivider
    />
  );
}
