import { DateTime, Interval, Settings } from 'luxon';
import {
  convertSlotToInterval,
  getAvailableDayTimeIntervals,
  getAvailableDayTimeSegments,
  getDayTimeIntervals,
} from '#src/libs/private-service/interval-utils';

import { DayTimeIntervals } from '#src/libs/private-service/constants';
import type { Slot } from '#src/libs/private-service/types';

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

describe('convertSlotToInterval', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  const slot: Slot = [
    DateTime.now().set({ hour: 7, minute: 30 }).toISO(),
    DateTime.now().set({ hour: 13, minute: 45 }).toISO(),
  ];
  it('should convert a valid slot array to a Luxon Interval', () => {
    const interval = convertSlotToInterval(slot);

    expect(interval).toBeInstanceOf(Interval);
    expect(interval.isValid).toBe(true);
    expect(interval.start.toISO()).toEqual(slot[0]);
    expect(interval.end.toISO()).toEqual(slot[1]);
  });
  it('should throw an error if slot is not an array of exactly two elements ', () => {
    const [start, end] = slot;
    //@ts-expect-error
    expect(() => convertSlotToInterval([start])).toThrow(
      'Slot must be an array containing exactly two date-time strings.',
    );
    //@ts-expect-error
    expect(() => convertSlotToInterval([end])).toThrow(
      'Slot must be an array containing exactly two date-time strings.',
    );
    //@ts-expect-error
    expect(() => convertSlotToInterval([])).toThrow(
      'Slot must be an array containing exactly two date-time strings.',
    );
  });

  it('should log an error if start or end date-time is invalid', () => {
    const invalidStartDateSlot: Slot = ['invalid-date', '2023-10-05T10:00:00'];
    const invalidEndDateSlot: Slot = ['2023-10-05T08:00:00', 'invalid-date'];

    expect(convertSlotToInterval(invalidStartDateSlot).start.day).toEqual(
      DateTime.now().day,
    );
    expect(convertSlotToInterval(invalidEndDateSlot).end.hour).toEqual(
      DateTime.fromISO(invalidEndDateSlot[0]).plus({ hours: 1 }).hour,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Invalid start date-time: invalid-date. Reason: the input "invalid-date" can't be parsed as ISO 8601`,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Invalid end date-time: invalid-date. Reason: the input "invalid-date" can't be parsed as ISO 8601`,
    );
    expect(console.error).toHaveBeenCalledWith(
      `The slot start time should be before the end time.`,
    );
  });

  it('should log an error if start time is after end time', () => {
    const invalidSlot: Slot = ['2023-10-05T12:00:00', '2023-10-05T10:00:00'];
    expect(convertSlotToInterval(invalidSlot).end.hour).toEqual(
      DateTime.fromISO(invalidSlot[0]).plus({ hours: 1 }).hour,
    );
    expect(console.error).toHaveBeenCalledWith(
      `The slot start time should be before the end time.`,
    );
  });
});

describe('getAvailableDayTimeSegments', () => {
  const testDate = DateTime.now().toISODate();
  it('should return the correct day time segments based on overlapping slots', () => {
    const slots: Slot[] = [
      [
        DateTime.now().set({ hour: 7, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 13, minute: 45 }).toISO(),
      ],
      [
        DateTime.now().set({ hour: 14, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 18, minute: 45 }).toISO(),
      ],
      [
        DateTime.now().set({ hour: 17, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 23, minute: 45 }).toISO(),
      ],
    ];

    const result = getAvailableDayTimeSegments(testDate, slots);
    expect(result).toEqual(new Set(Object.values(DayTimeIntervals)));
  });
  it('should return the evening segment if the slot overlap on the next date', () => {
    const slots: Slot[] = [
      [
        DateTime.now().set({ hour: 23, minute: 45 }).toISO(),
        DateTime.now().plus({ day: 1 }).set({ hour: 3, minute: 45 }).toISO(),
      ],
    ];

    const result = getAvailableDayTimeSegments(testDate, slots);
    expect(result).toEqual(new Set([DayTimeIntervals.EVENING]));
  });
  it('should return an empty set if no slots overlap any day time segment', () => {
    const slots: Slot[] = [
      [
        DateTime.now().plus({ day: 1 }).set({ hour: 3, minute: 45 }).toISO(),
        DateTime.now().plus({ day: 1 }).set({ hour: 6, minute: 45 }).toISO(),
      ],
    ];

    const result = getAvailableDayTimeSegments(testDate, slots);
    expect(result).toEqual(new Set());
  });
  it('should return an empty set if no slot is provided', () => {
    const undefinedSlots: Slot[] = undefined;
    const emptySlots: Slot[] = [];

    expect(getAvailableDayTimeSegments(testDate, undefinedSlots)).toEqual(
      new Set(),
    );
    expect(getAvailableDayTimeSegments(testDate, emptySlots)).toEqual(
      new Set(),
    );
  });
});

describe('getAvailableDayTimeIntervals', () => {
  const testDate = DateTime.now().toISODate();
  const dayTimeIntervals = getDayTimeIntervals(testDate);
  it('should return the correct day time interval based on overlapping slots', () => {
    const slots: Slot[] = [
      [
        DateTime.now().set({ hour: 7, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 13, minute: 45 }).toISO(),
      ],
      [
        DateTime.now().set({ hour: 14, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 18, minute: 45 }).toISO(),
      ],
      [
        DateTime.now().set({ hour: 17, minute: 30 }).toISO(),
        DateTime.now().set({ hour: 23, minute: 45 }).toISO(),
      ],
    ];
    const result = getAvailableDayTimeIntervals(testDate, slots);
    expect(result).toStrictEqual(dayTimeIntervals);
  });
  it('should return the evening segment if the slot overlap on the next date', () => {
    const slots: Slot[] = [
      [
        DateTime.now().set({ hour: 23, minute: 45 }).toISO(),
        DateTime.now().plus({ day: 1 }).set({ hour: 3, minute: 45 }).toISO(),
      ],
    ];
    const result = getAvailableDayTimeIntervals(testDate, slots);
    expect(result).toStrictEqual({
      [DayTimeIntervals.EVENING]: dayTimeIntervals[DayTimeIntervals.EVENING],
    });
  });
  it('should return an empty object if no slots overlap any day time segment', () => {
    const slots: Slot[] = [
      [
        DateTime.now().plus({ day: 1 }).set({ hour: 3, minute: 45 }).toISO(),
        DateTime.now().plus({ day: 1 }).set({ hour: 6, minute: 45 }).toISO(),
      ],
    ];

    const result = getAvailableDayTimeIntervals(testDate, slots);
    expect(result).toStrictEqual({});
  });
  it('should return an empty object if no slot is provided', () => {
    const undefinedSlots: Slot[] = undefined;
    const emptySlots: Slot[] = [];

    expect(
      getAvailableDayTimeIntervals(testDate, undefinedSlots),
    ).toStrictEqual({});
    expect(getAvailableDayTimeIntervals(testDate, emptySlots)).toStrictEqual(
      {},
    );
  });
});
