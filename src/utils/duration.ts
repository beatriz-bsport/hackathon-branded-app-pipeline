// @ts-nocheck
import { TFunction } from 'i18next';

export const formatDurationFromMinute = (
  durationMinute: number,
  t: TFunction,
) => {
  const day = parseInt(`${durationMinute / 60 / 24}`, 10);
  const hour = parseInt(`${(durationMinute - day * 24 * 60) / 60}`, 10);
  const minute = durationMinute - hour * 60 - day * 24 * 60;

  return (
    (day ? `${t('common:duration.day', { count: day })} ` : '') +
    (hour ? `${t('common:duration.hour', { count: hour })} ` : '') +
    (minute ? `${t('common:duration.minute', { count: minute })} ` : '')
  );
};
