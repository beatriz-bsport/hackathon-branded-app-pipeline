import moment, { Moment } from 'moment-timezone';
import { _generateRecurrenceDates, getOfferRecurrenceDates } from '../utils';
import { OFFER_RECURRENCE } from '../constants';

const invalidDates = ['2023-02-29', '1700-12-32', '1234-56-78', '2025-99-70'];
const randomInvalidDate =
  invalidDates[Math.floor(Math.random() * invalidDates.length)];

const INVALID_DATE = moment(randomInvalidDate);
const MOMENT_TODAY = moment('2023-05-04 10:30');
const MOMENT_ONE_WEEK_AHEAD = moment(MOMENT_TODAY).add(1, 'week');
const MOMENT_TWO_DAYS_AHEAD = moment(MOMENT_TODAY).add(2, 'days');
const MOMENT_FIVE_YEARS_AHEAD = moment(MOMENT_TODAY).add(5, 'years');
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
const SELECTED_ISO_WEEKDAY_RECURRENCE = [
  MOMENT_TODAY.isoWeekday(),
  MOMENT_TWO_DAYS_AHEAD.isoWeekday(),
];

const parseToUnix = (dates: Moment[]) => {
  return dates.map((date) => date.unix());
};

describe('Check offer form dates generation', () => {
  it('Should generate recurrence dates for create form', () => {
    const datesOneWeekAhead = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: MOMENT_TODAY,
        dateIntervalEnd: MOMENT_ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesOneWeekAheadGenerateOnly = _generateRecurrenceDates(
      MOMENT_TODAY,
      MOMENT_ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    expect(parseToUnix(datesOneWeekAhead)).toStrictEqual([
      MOMENT_TODAY.unix(),
      MOMENT_TWO_DAYS_AHEAD.unix(),
      MOMENT_ONE_WEEK_AHEAD.unix(),
    ]);
    expect(parseToUnix(datesOneWeekAheadGenerateOnly)).toStrictEqual([
      MOMENT_TODAY.unix(),
      MOMENT_TWO_DAYS_AHEAD.unix(),
      MOMENT_ONE_WEEK_AHEAD.unix(),
    ]);
  });

  it('Should return an array when generating invalid recurrences dates', () => {
    const datesInvalidStartDate = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: INVALID_DATE,
        dateIntervalEnd: MOMENT_ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidStartDateGenerateOnly = _generateRecurrenceDates(
      INVALID_DATE,
      MOMENT_ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidEndDate = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: MOMENT_TODAY,
        dateIntervalEnd: MOMENT_FIVE_YEARS_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidEndDateGenerateOnly = _generateRecurrenceDates(
      MOMENT_TODAY,
      MOMENT_FIVE_YEARS_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidRecurrence = getOfferRecurrenceDates(
      {
        // @ts-ignore
        recurrence: 'quarters',
        recurrenceWeekDay: ISO_WEEKDAY_RECURRENCE_STATE,
        dateIntervalStart: MOMENT_TODAY,
        dateIntervalEnd: MOMENT_ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidRecurrenceGenerateOnly = _generateRecurrenceDates(
      MOMENT_TODAY,
      MOMENT_ONE_WEEK_AHEAD,
      // @ts-ignore
      'quarters',
      TIMEZONE,
      SELECTED_ISO_WEEKDAY_RECURRENCE,
    );

    const datesInvalidIsoWeekday = getOfferRecurrenceDates(
      {
        recurrence: OFFER_RECURRENCE.WEEKLY,
        // @ts-ignore
        recurrenceWeekDay: {},
        dateIntervalStart: MOMENT_TODAY,
        dateIntervalEnd: MOMENT_ONE_WEEK_AHEAD,
      },
      TIMEZONE,
    );
    const datesInvalidIsoWeekdayGenerateOnly = _generateRecurrenceDates(
      MOMENT_TODAY,
      MOMENT_ONE_WEEK_AHEAD,
      OFFER_RECURRENCE.WEEKLY,
      TIMEZONE,
      [],
    );

    expect(datesInvalidStartDate).toStrictEqual([]);
    expect(datesInvalidStartDateGenerateOnly).toStrictEqual([]);

    expect(parseToUnix(datesInvalidEndDate)).toStrictEqual([
      MOMENT_TODAY.unix(),
    ]);
    expect(parseToUnix(datesInvalidEndDateGenerateOnly)).toStrictEqual([
      MOMENT_TODAY.unix(),
    ]);

    expect(parseToUnix(datesInvalidRecurrence)).toStrictEqual([
      MOMENT_TODAY.unix(),
    ]);
    expect(parseToUnix(datesInvalidRecurrenceGenerateOnly)).toStrictEqual([
      MOMENT_TODAY.unix(),
    ]);

    expect(parseToUnix(datesInvalidIsoWeekday)).toStrictEqual([]);
    expect(parseToUnix(datesInvalidIsoWeekdayGenerateOnly)).toStrictEqual([]);
  });
});
