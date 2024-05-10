import { Settings } from 'luxon';
// @ts-expect-error
import { LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY } from '../../i18n';
import { getLocaleWeekdays } from '#src/utils/datetime';

describe('Test getLocaleWeekdays', () => {
  it('Should return Sunday as first element for specific locales', () => {
    const locale =
      LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY[
        Math.floor(
          Math.random() * LOCALES_WITH_FIRST_WEEKDAY_BEING_SUNDAY.length,
        )
      ];
    Settings.defaultLocale = locale;

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
    Settings.defaultLocale = 'en-GB';

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
