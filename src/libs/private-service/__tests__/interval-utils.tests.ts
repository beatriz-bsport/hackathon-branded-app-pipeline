import { DateTime, Interval, Settings } from 'luxon';
import { getDayTimeIntervals } from '#src/libs/private-service/interval-utils';

describe('getDayTimeIntervals', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return correct intervals for each day time interval', () => {
    const testDate = DateTime.now().toISODate();
    const dayTimeIntervals = getDayTimeIntervals(testDate);

    expect(dayTimeIntervals.morning).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO(`${testDate}T00:00:00`),
        DateTime.fromISO(`${testDate}T12:00:00`),
      ),
    );

    expect(dayTimeIntervals.noon).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO(`${testDate}T12:00:00`),
        DateTime.fromISO(`${testDate}T14:00:00`),
      ),
    );

    expect(dayTimeIntervals.afternoon).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO(`${testDate}T14:00:00`),
        DateTime.fromISO(`${testDate}T18:00:00`),
      ),
    );

    expect(dayTimeIntervals.evening).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO(`${testDate}T18:00:00`),
        DateTime.fromISO(`${testDate}T23:59:59`),
      ),
    );
  });

  it('should log an error for an invalid date format ', () => {
    const invalidDate = 'invalid date';
    const result = getDayTimeIntervals(invalidDate);
    expect(result.morning.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 0 }),
        DateTime.now().set({ hour: 12 }),
      ).start.hour,
    );
    expect(result.morning.end.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 0 }),
        DateTime.now().set({ hour: 12 }),
      ).end.hour,
    );
    expect(result.noon.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 12 }),
        DateTime.now().set({ hour: 14 }),
      ).start.hour,
    );
    expect(result.afternoon.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 14 }),
        DateTime.now().set({ hour: 18 }),
      ).start.hour,
    );
    expect(result.evening.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 18 }),
        DateTime.now().set({ hour: 23, minute: 59, second: 59 }),
      ).start.hour,
    );
    expect(console.error).toHaveBeenCalledWith(
      'Invalid date provided: invalid date. Reason: the input "invalid date" can\'t be parsed as format yyyy-MM-dd',
    );
  });

  it('should log an error for an incomplete ISO date', () => {
    const incompleteDate = '2023-10';
    const result = getDayTimeIntervals(incompleteDate);
    expect(result.morning.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 0 }),
        DateTime.now().set({ hour: 12 }),
      ).start.hour,
    );
    expect(result.morning.end.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 0 }),
        DateTime.now().set({ hour: 12 }),
      ).end.hour,
    );
    expect(result.noon.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 12 }),
        DateTime.now().set({ hour: 14 }),
      ).start.hour,
    );
    expect(result.afternoon.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 14 }),
        DateTime.now().set({ hour: 18 }),
      ).start.hour,
    );
    expect(result.evening.start.hour).toEqual(
      Interval.fromDateTimes(
        DateTime.now().set({ hour: 18 }),
        DateTime.now().set({ hour: 23, minute: 59, second: 59 }),
      ).start.hour,
    );
    expect(console.error).toBeCalledWith(
      'Invalid date provided: 2023-10. Reason: the input "2023-10" can\'t be parsed as format yyyy-MM-dd',
    );
  });

  it('should return intervals in local timezone representation', () => {
    Settings.defaultZone = 'America/Los_Angeles';
    const testDate = DateTime.now().toISODate();
    const dayTimeIntervals = getDayTimeIntervals(testDate);

    expect(dayTimeIntervals.morning.start.zoneName).toEqual(
      'America/Los_Angeles',
    );

    expect(dayTimeIntervals.morning.end.zoneName).toEqual(
      'America/Los_Angeles',
    );

    expect(dayTimeIntervals.noon.start.zoneName).toEqual('America/Los_Angeles');

    expect(dayTimeIntervals.noon.end.zoneName).toEqual('America/Los_Angeles');

    expect(dayTimeIntervals.afternoon.start.zoneName).toEqual(
      'America/Los_Angeles',
    );

    expect(dayTimeIntervals.afternoon.end.zoneName).toEqual(
      'America/Los_Angeles',
    );

    expect(dayTimeIntervals.evening.start.zoneName).toEqual(
      'America/Los_Angeles',
    );

    expect(dayTimeIntervals.evening.end.zoneName).toEqual(
      'America/Los_Angeles',
    );
    Settings.defaultZone = 'system';
  });
});
