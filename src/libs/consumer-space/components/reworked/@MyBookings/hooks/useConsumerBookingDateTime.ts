import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { formatAsTime, formatMinutes } from '#utils/datetime';

/**
 * Get the formatted date from a given booking for member profile
 *
 * @param t The t function from i18n with `datetime` NS loaded
 * @param offerDateStart The start date of the offer
 * @param offerDurationMinute The duration of the offer in minutes
 * @param establishmentTimezoneName The establishment timezone retrieved from the company theme
 * @param isMetaActivityBroadcast Whether the offer's activity is online or not
 * @param sessionTimeDisplay The time display configuration retrieved from the company offer
 * @param timezoneName The name of the timezone retrieved from the company offer
 *
 * @example
 * const bookingDate = useConsumerBookingDateTime({
 *   offerDateStart,
 *   offerDurationMinute,
 *   establishmentTimezoneName,
 *   isMetaActivityBroadcast,
 *   sessionTimeDisplay,
 *   timezoneName,
 * })
 * // Wed 18 May • 09:30 AM - 10:30 AM
 */
export default function useConsumerBookingDateTime({
  offerDateStart,
  offerDurationMinute,
  establishmentTimezoneName,
  isMetaActivityBroadcast,
  sessionTimeDisplay,
  timezoneName,
}: {
  offerDateStart: string;
  offerDurationMinute: number;
  establishmentTimezoneName: string;
  isMetaActivityBroadcast: boolean;
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  timezoneName: string;
}) {
  const { t } = useTranslation('datetime');

  const getOfferHours = useCallback(() => {
    if (offerDateStart && establishmentTimezoneName) {
      const tz = isMetaActivityBroadcast
        ? moment.tz.guess()
        : establishmentTimezoneName;

      const startMoment = moment(offerDateStart).tz(tz);
      const startHour = formatAsTime(startMoment, tz);

      const duration = moment.duration(offerDurationMinute, 'minutes');
      const durationInMinutes = duration.asMinutes();
      const readableDuration = formatMinutes(durationInMinutes, t);

      const endMoment = moment(offerDateStart).add(duration).tz(tz);

      if (!endMoment.isSame(startMoment, 'day')) {
        return { startTime: startHour, endTimeOrDuration: '' };
      }
      const endHour = formatAsTime(endMoment, tz);

      switch (sessionTimeDisplay) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return { startTime: startHour, endTimeOrDuration: '' };
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return { startTime: startHour, endTimeOrDuration: readableDuration };
        default:
          return { startTime: startHour, endTimeOrDuration: endHour };
      }
    }

    if (offerDateStart) {
      const tz = isMetaActivityBroadcast
        ? moment.tz.guess()
        : timezoneName || moment.tz.guess();
      const startMoment = moment(offerDateStart).tz(tz);
      const startHour = startMoment.format('HH:mm');

      const duration = moment.duration(offerDurationMinute, 'minutes');
      const durationInMinutes = duration.asMinutes();
      const readableDuration = formatMinutes(durationInMinutes, t);

      const endMoment = moment(offerDateStart)
        .add(moment.duration(offerDurationMinute, 'minutes'))
        .tz(tz);
      const endHour = endMoment.format('HH:mm');

      if (!endMoment.isSame(startMoment, 'day')) {
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
    offerDateStart,
    offerDurationMinute,
    sessionTimeDisplay,
    t,
    timezoneName,
  ]);

  const offerHours = getOfferHours();
  let date = useMemo(
    () => moment(offerDateStart).format('ddd D MMMM'),
    [offerDateStart],
  );

  if (offerHours.startTime && offerHours.endTimeOrDuration) {
    date += ` • ${offerHours.startTime} - ${offerHours.endTimeOrDuration}`;
  }

  return date;
}
