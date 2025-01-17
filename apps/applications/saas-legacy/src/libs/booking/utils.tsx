import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code.js';

import BOOKING_SOURCES, {
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
} from '@bsport/common/lib/master-data/booking_source.js';
import PersonIcon from '@material-ui/icons/Person';
import PublicIcon from '@material-ui/icons/Public';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import { TFunction } from 'i18next';
import { BOOKING_CANCELLED_BY_STAFF } from '#src/libs/booking/components/constants';
import {
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
} from '#src/libs/private-service/components/constants';
import { UserRoleData } from '#src/libs/role/types';
import { PrivateBooking } from '#src/libs/private-service/types';
import type { Booking } from './types';
import { formatAsDate, formatISOStringAsTime } from '../../utils/datetime';

export const getStaffName = (staff: UserRoleData) =>
  staff?.first_name?.length && staff?.last_name?.length
    ? `${staff?.first_name} ${staff?.last_name}`
    : staff?.email;

export const getPrivateBookingStatusCodeForCalendar = (
  private_booking: PrivateBooking,
) => {
  const cancelled_by = [
    ...private_booking?.staff_history?.filter(
      (sh) =>
        sh?.action_identifier === PRIVATE_BOOKING_CANCELLED_BY_STAFF ||
        sh?.action_identifier === RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
    ),
  ].sort((sh, sh_) => {
    if (sh.timestamp < sh_.timestamp) {
      return 1;
    }
    return -1;
  })[0]?.staff;

  if (cancelled_by?.id) {
    return private_booking.date_canceled
      ? [
          'privateBooking.isCancelledByManagerDate',
          {
            date: formatAsDate(private_booking.date_canceled),
            time: formatISOStringAsTime(private_booking.date_canceled),
            cancelled_by: getStaffName(cancelled_by),
          },
        ]
      : [
          'privateBooking.isCancelledByManager',
          {
            cancelled_by: getStaffName(cancelled_by),
          },
        ];
  }

  return private_booking.date_canceled
    ? [
        'privateBooking.isCancelledDate',
        {
          date: formatAsDate(private_booking.date_canceled),
          time: formatISOStringAsTime(private_booking.date_canceled),
        },
      ]
    : ['privateBooking.isCancelled'];
};

export const BookingStatusCodeText: React.FC<{
  booking: Booking | PrivateBooking;
}> = ({ booking }) => {
  const classes = useStyles();
  const { t } = useTranslation('booking');
  return (
    <span className={classes.preWrap}>{getBookingStatusCode(booking, t)}</span>
  );
};

const getBookingStatusCode = (
  booking: Booking | PrivateBooking,
  t: TFunction,
) => {
  const cancelled_by = [
    ...booking?.staff_history?.filter(
      (sh) =>
        sh?.action_identifier === BOOKING_CANCELLED_BY_STAFF ||
        sh?.action_identifier === PRIVATE_BOOKING_CANCELLED_BY_STAFF ||
        sh?.action_identifier === RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
    ),
  ].sort((sh, sh_) => {
    if (sh.timestamp < sh_.timestamp) {
      return 1;
    }
    return -1;
  })[0]?.staff;
  switch (booking?.booking_status_code) {
    case BOOKING_STATUS_CANCELLED_BY_MANAGER?.id:
      if (cancelled_by?.id) {
        return ` (${
          booking.date_canceled
            ? t('statusCode.cancelledByManagerDate', {
                date: formatAsDate(booking.date_canceled),
                time: formatISOStringAsTime(booking.date_canceled),
                cancelled_by: getStaffName(cancelled_by),
              })
            : t('statusCode.cancelledByManager', {
                cancelled_by: getStaffName(cancelled_by),
              })
        })`;
      }

      return ` (${
        booking.date_canceled
          ? t('statusCode.cancelledByAnonymousManagerDate', {
              date: formatAsDate(booking.date_canceled),
              time: formatISOStringAsTime(booking.date_canceled),
            })
          : t('statusCode.cancelledByAnonymousManager')
      })`;

    case BOOKING_STATUS_CANCELLED_BY_CONSUMER.id:
      return ` (${
        booking.date_canceled
          ? t('statusCode.cancelledByConsumerDate', {
              date: formatAsDate(booking.date_canceled),
              time: formatISOStringAsTime(booking.date_canceled),
            })
          : t('statusCode.cancelledByConsumer')
      })`;

    case BOOKING_STATUS_CANCELLED_BY_OFFER.id:
      return ` (${
        booking.date_canceled
          ? t('statusCode.cancelledByOfferDate', {
              date: formatAsDate(booking.date_canceled),
              time: formatISOStringAsTime(booking.date_canceled),
            })
          : t('statusCode.cancelledByOffer')
      })`;

    default:
      return '';
  }
};

export const getBookingSourceText = (source: number, t: TFunction) => {
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

type SourceProps = {
  source: number;
};
export const BookingSource: React.FC<SourceProps> = ({ source }) => {
  const classes = useStyles();
  const { t } = useTranslation('booking');
  return (
    <div className={classes.bookingSourceRow}>
      <div className={classes.marginRight}>{getBookingSourceIcon(source)}</div>
      <Typography>{getBookingSourceText(source, t)}</Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  preWrap: {
    whiteSpace: 'pre-wrap',
  },
  bookingSourceRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
}));
