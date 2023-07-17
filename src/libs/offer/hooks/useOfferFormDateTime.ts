import { useCallback } from 'react';
import moment, { Moment } from 'moment-timezone';

const useOfferFormDateTime = (timezone: string) => {
  const rebuildDatetime = useCallback(
    (date: Moment, hour: number, minute: number) => {
      return moment(date)
        .tz(timezone)
        .set('hour', hour)
        .set('minute', minute)
        .format();
    },
    [timezone],
  );

  const getMinutes = useCallback((totalMinutes: number) => {
    return totalMinutes % 60;
  }, []);

  const getHours = useCallback(
    (totalMinutes: number) => {
      return ((totalMinutes - getMinutes(totalMinutes)) / 60) % 24;
    },
    [getMinutes],
  );

  const getDays = useCallback((totalMinutes: number) => {
    return Math.floor(totalMinutes / (24 * 60));
  }, []);

  const getDurationMinute = useCallback(
    (
      durationMinute: number,
      dayValue?: number,
      hourValue?: number,
      minuteValue?: number,
    ) => {
      // This sanity check prevents NaN values from spreading around inside computations
      // NaN ?? 2 = NaN
      const sanitizedDayValue = Number.isNaN(dayValue) ? 0 : dayValue;
      let sanitizedHourValue = Number.isNaN(hourValue) ? 0 : hourValue;
      let sanitizedMinuteValue = Number.isNaN(minuteValue) ? 0 : minuteValue;

      if (sanitizedHourValue)
        sanitizedHourValue = Math.min(sanitizedHourValue, 23);
      if (sanitizedMinuteValue)
        sanitizedMinuteValue = Math.min(sanitizedMinuteValue, 59);

      const days = (sanitizedDayValue ?? getDays(durationMinute)) * 24 * 60;
      const minutes = sanitizedMinuteValue ?? getMinutes(durationMinute);
      const hours = (sanitizedHourValue ?? getHours(durationMinute)) * 60;

      const newDurationMinute = days + hours + minutes;

      return newDurationMinute;
    },
    [getDays, getHours, getMinutes],
  );

  return {
    rebuildDatetime,
    getMinutes,
    getHours,
    getDays,
    getDurationMinute,
  };
};

export default useOfferFormDateTime;
