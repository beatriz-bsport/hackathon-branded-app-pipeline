// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';

import BOOKING_SOURCES, {
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
} from '@bsport/common/lib/master-data/booking_source';
import PersonIcon from '@material-ui/icons/Person';
import PublicIcon from '@material-ui/icons/Public';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import type { Booking } from './types';

export const getBookingStatusCode = (t: TFunction, booking: Booking) => {
  switch (booking.booking_status_code) {
    case BOOKING_STATUS_CANCELLED_BY_MANAGER.id:
      return ` (${t('booking:statusCode.cancelledByManager')})`;
    case BOOKING_STATUS_CANCELLED_BY_CONSUMER.id:
      return ` (${t('booking:statusCode.cancelledByConsumer')})`;
    case BOOKING_STATUS_CANCELLED_BY_OFFER.id:
      return ` (${t('booking:statusCode.cancelledByOffer')})`;
    default:
      return '';
  }
};

export const getBookingSourceText = (t: TFunction, source: number) => {
  return t(
    `source.${
      (BOOKING_SOURCES.find((s) => s.id === source) || { text: 'Other' }).text
    }`,
  );
};

export const getBookingSourceIcon = (source: number) => {
  switch (source) {
    case BOOKING_SOURCE_APP.id:
      return <SmartphoneIcon />;
    case BOOKING_SOURCE_WEB.id:
      return <PublicIcon />;
    case BOOKING_SOURCE_SAAS.id:
      return <PersonIcon />;
    default:
      return <PersonOutlineIcon />;
  }
};

export const BookingSource = withNamespaces(['booking'])(
  (props: { t: TFunction, source: number }) => (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div style={{ marginRight: 8 }}>{getBookingSourceIcon(props.source)}</div>
      <Typography>{getBookingSourceText(props.t, props.source)}</Typography>
    </div>
  ),
);
