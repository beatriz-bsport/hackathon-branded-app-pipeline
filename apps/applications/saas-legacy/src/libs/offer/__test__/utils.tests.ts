import { _generateRecurrenceDates, getOfferRecurrenceDates } from '../utils';
import { OFFER_RECURRENCE } from '../constants';
import { DateTime } from 'luxon';
import type { LuxonDateTime } from '#src/types';

const invalidDates = ['2023-02-29', '1700-12-32', '1234-56-78', '2025-99-70'];
const randomInvalidDate =
  invalidDates[Math.floor(Math.random() * invalidDates.length)];

const INVALID_DATE = DateTime.fromISO(randomInvalidDate);
const TODAY = DateTime.fromISO('2023-05-04').set({
  hour: 10,
  minute: 30,
});

const ONE_WEEK_AHEAD = TODAY.plus({ week: 1 });
const TWO_DAYS_AHEAD = TODAY.plus({ days: 2 });
const FIVE_YEARS_AHEAD = TODAY.plus({ year: 5 });
const TIMEZONE = 'Europe/Paris';
const ISO_WEEKDAY_RECURRENCE_STATE = {
  '1': false,
  '2': false,
  '3': false,
  '4': true,
  '5': false,
  '6': true,
  '7': false,
};
const SELECTED_ISO_WEEKDAY_RECURRENCE = [TODAY.weekday, TWO_DAYS_AHEAD.weekday];

const parseToUnix = (dates: LuxonDateTime[]) => {
  return dates.map((date) => date.toUnixInteger());
};

describe('Check offer form dates generation', () => {
  it('Should generate recurrence dates for create form', () => {
    const datesOneWeekAhead = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: TODAY,
        dateIntervalEnd: ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesOneWeekAheadGenerateOnly = _generateRecurrenceDates(
      TODAY,
      ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    expect(parseToUnix(datesOneWeekAhead)).toStrictEqual([
      TODAY.toUnixInteger(),
      TWO_DAYS_AHEAD.toUnixInteger(),
      ONE_WEEK_AHEAD.toUnixInteger(),
    ]);
    expect(parseToUnix(datesOneWeekAheadGenerateOnly)).toStrictEqual([
      TODAY.toUnixInteger(),
      TWO_DAYS_AHEAD.toUnixInteger(),
      ONE_WEEK_AHEAD.toUnixInteger(),
    ]);
  });

  it('Should return an array when generating invalid recurrences dates', () => {
    const datesInvalidStartDate = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: INVALID_DATE,
        dateIntervalEnd: ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidStartDateGenerateOnly = _generateRecurrenceDates(
      INVALID_DATE,
      ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidEndDate = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: TODAY,
        dateIntervalEnd: FIVE_YEARS_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidEndDateGenerateOnly = _generateRecurrenceDates(
      TODAY,
      FIVE_YEARS_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidRecurrence = getOfferRecurrenceDates(
      {
        // @ts-expect-error
        recurrence: 'quarters',
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: TODAY,
        dateIntervalEnd: ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidRecurrenceGenerateOnly = _generateRecurrenceDates(
      TODAY,
      ONE_WEEK_AHEAD,
      // @ts-expect-error
      'quarters',
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidIsoWeekday = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        // @ts-expect-error
        recurrenceWeekDay: {},
        dateIntervalStart: TODAY,
        dateIntervalEnd: ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidIsoWeekdayGenerateOnly = _generateRecurrenceDates(
      TODAY,
      ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      [],
    );

    expect(datesInvalidStartDate).toStrictEqual([]);
    expect(datesInvalidStartDateGenerateOnly).toStrictEqual([]);

    expect(parseToUnix(datesInvalidEndDate)).toStrictEqual([
      TODAY.toUnixInteger(),
    ]);
    expect(parseToUnix(datesInvalidEndDateGenerateOnly)).toStrictEqual([
      TODAY.toUnixInteger(),
    ]);

    expect(parseToUnix(datesInvalidRecurrence)).toStrictEqual([
      TODAY.toUnixInteger(),
    ]);
    expect(parseToUnix(datesInvalidRecurrenceGenerateOnly)).toStrictEqual([
      TODAY.toUnixInteger(),
    ]);

    expect(parseToUnix(datesInvalidIsoWeekday)).toStrictEqual([]);
    expect(parseToUnix(datesInvalidIsoWeekdayGenerateOnly)).toStrictEqual([]);
  });
});
