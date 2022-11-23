import { TFunction } from 'i18next';
import memoize from 'memoize-one';

export const getMergeTags = memoize(
  (tags: { [tag_name: string]: string[] }, t: TFunction) => {
    if (tags) {
      return [
        ...Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
          acc.push({
            label: t(`notificationRule:tag.${tagCategory}.name`),
            options: [...tagList].map((tag) => ({
              label: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
              value: `{${tag}}`,
            })),
          });
          return acc;
        }, []),
      ];
    }
    return null;
  },
);

export const getSendingTimeNotification = (
  timeComparator: 'before' | 'after',
  periodScale: 'days' | 'hours',
  relativeTimeValue: number,
) => {
  let daysSubmit = 0;
  let hoursSubmit = 0;
  if (periodScale === 'days') {
    daysSubmit = relativeTimeValue;
  } else {
    hoursSubmit = relativeTimeValue;
  }

  if (timeComparator === 'before') {
    daysSubmit *= -1;
    hoursSubmit *= -1;
  }

  return [daysSubmit, hoursSubmit];
};
