import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import {
  formatISOStringAsTime,
  formatMinutes,
  getUserZone,
} from '#src/utils/datetime';

/**
 * Get the formatted date from a given booking for member profile
 *
 * @param dateStart The start date of the booking
 * @param durationMinute The duration of the booking in minutes
 * @param establishmentTimezoneName The establishment timezone retrieved from the company theme
 * @param isMetaActivityBroadcast Whether the offer's activity is online or not
 * @param sessionTimeDisplay The time display configuration retrieved from the company offer
 * @param timezoneName The name of the timezone retrieved from the company offer
 *
 * @example
 * const bookingDate = useConsumerBookingDateTime({
 *   dateStart,
 *   durationMinute,
 *   establishmentTimezoneName,
 *   isMetaActivityBroadcast,
 *   sessionTimeDisplay,
 *   timezoneName,
 * })
 * // Wed 18 May • 09:30 AM - 10:30 AM
 */
export default function useConsumerBookingDateTime({
  dateStart,
  durationMinute,
  establishmentTimezoneName,
  isMetaActivityBroadcast,
  sessionTimeDisplay,
  timezoneName,
}: {
  dateStart: string;
  durationMinute: number;
  establishmentTimezoneName: string;
  isMetaActivityBroadcast: boolean;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  timezoneName: string;
}) {
  const { t } = useTranslation('datetime');

  const getOfferHours = useCallback(() => {
    if (dateStart && establishmentTimezoneName) {
      const tz = isMetaActivityBroadcast
        ? getUserZone()
        : establishmentTimezoneName;

      const startDateTime = DateTime.fromISO(dateStart).setZone(tz);
      const startHour = formatISOStringAsTime(startDateTime.toISO(), tz);

      const readableDuration = formatMinutes(durationMinute, t);

      const endDateTime = startDateTime
        .plus({ minute: durationMinute })
        .setZone(tz);

      if (!endDateTime.hasSame(startDateTime, 'day')) {
        return { startTime: startHour, endTimeOrDuration: '' };
      }
      const endHour = formatISOStringAsTime(endDateTime.toISO(), tz);

      switch (sessionTimeDisplay) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return { startTime: startHour, endTimeOrDuration: '' };
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return { startTime: startHour, endTimeOrDuration: readableDuration };
        default:
          return { startTime: startHour, endTimeOrDuration: endHour };
      }
    }

    if (dateStart) {
      const tz = isMetaActivityBroadcast
        ? getUserZone()
        : timezoneName || getUserZone();
      const startDateTime = DateTime.fromISO(dateStart).setZone(tz);
      // not localized WTF?
      const startHour = startDateTime.toFormat('HH:mm');

      const readableDuration = formatMinutes(durationMinute, t);

      const endMoment = DateTime.fromISO(dateStart)
        .plus({ minute: durationMinute })
        .setZone(tz);
      // not localized WTF?
      const endHour = endMoment.toFormat('HH:mm');

      if (!endMoment.hasSame(startDateTime, 'day')) {
        return { startTime: startHour, endTimeOrDuration: '' };
      }

      switch (sessionTimeDisplay) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return { startTime: startHour, endTimeOrDuration: '' };
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return { startTime: startHour, endTimeOrDuration: readableDuration };
        default:
          return { startTime: startHour, endTimeOrDuration: endHour };
      }
    }
    return { startTime: '', endTimeOrDuration: '' };
  }, [
    establishmentTimezoneName,
    isMetaActivityBroadcast,
    dateStart,
    durationMinute,
    sessionTimeDisplay,
    t,
    timezoneName,
  ]);

  const offerHours = getOfferHours();
  let date = useMemo(
    () => DateTime.fromISO(dateStart).toFormat('EEE dd MMMM'),
    [dateStart],
  );

  if (offerHours.startTime && offerHours.endTimeOrDuration) {
    date += ` • ${offerHours.startTime} - ${offerHours.endTimeOrDuration}`;
  } else {
    date += ` • ${offerHours.startTime || offerHours.endTimeOrDuration}`;
  }

  return date;
}
