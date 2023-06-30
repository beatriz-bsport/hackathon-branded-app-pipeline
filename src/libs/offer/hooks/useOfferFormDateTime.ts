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
      const days = (dayValue ?? getDays(durationMinute)) * 24 * 60;
      const minutes = minuteValue ?? getMinutes(durationMinute);
      const hours = (hourValue ?? getHours(durationMinute)) * 60;
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
