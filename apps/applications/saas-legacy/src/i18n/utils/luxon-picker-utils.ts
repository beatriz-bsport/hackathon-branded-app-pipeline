import LuxonUtils from '@date-io/luxon';
import { DateTime, Settings } from 'luxon';
import { getLocaleWeekdays } from '#src/utils/datetime';

/**
 * Extends the base LuxonUtils for localization purposes
 * For en-us locale, the first day of the week is Sunday
 *
 * See node_modules/@date-io/luxon/src/luxon-utils for reference
 */
export class LocalizedLuxonUtils extends LuxonUtils {
  public getWeekdays() {
    return getLocaleWeekdays('narrow');
  }

  public getWeekArray(date: DateTime) {
    const dateWithProperLocale = date.setLocale(Settings.defaultLocale);
    const { days } = dateWithProperLocale
      .endOf('month')
      .endOf('week', { useLocaleWeeks: true })
      .diff(
        dateWithProperLocale
          .startOf('month')
          .startOf('week', { useLocaleWeeks: true }),
        'days',
      )
      .toObject();

    const weeks: DateTime[][] = [];
    new Array<number>(Math.round(days!))
      .fill(0)
      .map((_, i) => i)
      .map((day) =>
        dateWithProperLocale
          .startOf('month')
          .startOf('week', { useLocaleWeeks: true })
          .plus({ days: day }),
      )
      .forEach((v, i) => {
        if (i === 0 || (i % 7 === 0 && i > 6)) {
          weeks.push([v]);
          return;
        }

        weeks[weeks.length - 1].push(v);
      });

    return weeks;
  }
}
