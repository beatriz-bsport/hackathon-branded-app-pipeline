import { getLocaleWeekdays } from '#src/utils/datetime';
import {
  LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY,
  setLuxonLocale,
  // @ts-expect-error
} from '../../i18n';

describe('Test getLocaleWeekdays', () => {
  it('Should return Sunday as first element for specific locales', () => {
    const locale =
      LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY[
        Math.floor(
          Math.random() * LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY.length,
        )
      ];
    setLuxonLocale(locale);

    expect(getLocaleWeekdays('long')).toStrictEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]);
  });

  it('Should return Monday as first element for the others', () => {
    setLuxonLocale('en-GB');

    expect(getLocaleWeekdays('long')).toStrictEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });
});
