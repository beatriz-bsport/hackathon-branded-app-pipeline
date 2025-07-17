import { DateTime, Duration, Interval, Settings } from 'luxon';
import {
  chunkByDurationAndInterval,
  chunkIntervalsByDuration,
  convertSlotToInterval,
  getAvailableDayTimeIntervals,
  getAvailableDayTimeSegments,
  findIntervalsIntersections,
  getIntersectingSlots,
  getDayTimeIntervals,
  mergeOverlappingIntervals,
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

describe('getIntersectingSlots', () => {
  const dayTimeIntervals = getDayTimeIntervals(
    DateTime.fromISO('2024-10-11').toISODate(),
  );
  const slots: Slot[] = [
    ['2024-10-11T07:30:00', '2024-10-11T13:45:00'],
    ['2024-10-11T14:30:00', '2024-10-11T18:25:00'],
    ['2024-10-11T17:30:00', '2024-10-11T23:45:00'],
  ];
  it('should return intersecting intervals when slots overlap the selected interval', () => {
    const morningSlots = getIntersectingSlots(dayTimeIntervals.morning, slots);
    const noonSlots = getIntersectingSlots(dayTimeIntervals.noon, slots);
    const afternoonSlots = getIntersectingSlots(
      dayTimeIntervals.afternoon,
      slots,
    );
    const eveningSlots = getIntersectingSlots(dayTimeIntervals.evening, slots);
    expect(morningSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T07:30:00'),
        DateTime.fromISO('2024-10-11T12:00:00'),
      ),
    );
    expect(noonSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T12:00:00'),
        DateTime.fromISO('2024-10-11T13:45:00'),
      ),
    );
    expect(afternoonSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T17:30:00'),
        DateTime.fromISO('2024-10-11T18:00:00'),
      ),
    );
    expect(eveningSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T18:00:00'),
        DateTime.fromISO('2024-10-11T18:25:00'),
      ),
    );
    expect(eveningSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T18:00:00'),
        DateTime.fromISO('2024-10-11T23:45:00'),
      ),
    );
  });
  it('should return an empty array for slots that do not overlap with the selected interval', () => {
    const result = getIntersectingSlots(dayTimeIntervals.morning, [slots[2]]);
    expect(result).toStrictEqual([]);
  });
  it('should handle slots that exactly match the boundaries of the selected interval', () => {
    const edgeSlots: Slot[] = [
      ['2024-10-11T00:00:00', '2024-10-11T08:45:00'],
      ['2024-10-11T09:00:00', '2024-10-11T12:00:00'],
      ['2024-10-11T12:00:00', '2024-10-11T13:25:00'],
      ['2024-10-11T12:45:00', '2024-10-11T14:00:00'],
      ['2024-10-11T14:00:00', '2024-10-11T17:00:00'],
      ['2024-10-11T17:30:00', '2024-10-11T18:00:00'],
      ['2024-10-11T18:00:00', '2024-10-11T21:00:00'],
      ['2024-10-11T19:30:00', '2024-10-11T24:00:00'],
    ];
    const morningSlots = getIntersectingSlots(
      dayTimeIntervals.morning,
      edgeSlots,
    );
    const noonSlots = getIntersectingSlots(dayTimeIntervals.noon, edgeSlots);
    const afternoonSlots = getIntersectingSlots(
      dayTimeIntervals.afternoon,
      edgeSlots,
    );
    const eveningSlots = getIntersectingSlots(
      dayTimeIntervals.evening,
      edgeSlots,
    );
    expect(morningSlots.length).toEqual(2);
    expect(morningSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T00:00:00'),
        DateTime.fromISO('2024-10-11T08:45:00'),
      ),
    );
    expect(morningSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T09:00:00'),
        DateTime.fromISO('2024-10-11T12:00:00'),
      ),
    );
    expect(noonSlots.length).toEqual(2);
    expect(noonSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T12:00:00'),
        DateTime.fromISO('2024-10-11T13:25:00'),
      ),
    );
    expect(noonSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T12:45:00'),
        DateTime.fromISO('2024-10-11T14:00:00'),
      ),
    );
    expect(afternoonSlots.length).toEqual(2);
    expect(afternoonSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T14:00:00'),
        DateTime.fromISO('2024-10-11T17:00:00'),
      ),
    );
    expect(afternoonSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T17:30:00'),
        DateTime.fromISO('2024-10-11T18:00:00'),
      ),
    );
    expect(eveningSlots.length).toEqual(2);
    expect(eveningSlots[0]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T18:00:00'),
        DateTime.fromISO('2024-10-11T21:00:00'),
      ),
    );
    expect(eveningSlots[1]).toEqual(
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-11T19:30:00'),
        DateTime.fromISO('2024-10-11T23:59:59'),
      ),
    );
  });
  it('should handle an empty or undefined slots array', () => {
    expect(getIntersectingSlots(dayTimeIntervals.afternoon, [])).toEqual([]);
    expect(getIntersectingSlots(dayTimeIntervals.afternoon, undefined)).toEqual(
      [],
    );
  });
});

describe('findIntervalsIntersections', () => {
  it('should return intersections for overlapping intervals', () => {
    const intervalsA = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T12:00:00'),
      ),
    ];
    const intervalsB = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T10:00:00'),
        DateTime.fromISO('2024-10-04T14:00:00'),
      ),
    ];

    const result = findIntervalsIntersections(intervalsA, intervalsB);
    expect(result).toHaveLength(1);
    expect(result[0].start).toStrictEqual(
      DateTime.fromISO('2024-10-04T10:00:00'),
    );
    expect(result[0].end).toStrictEqual(
      DateTime.fromISO('2024-10-04T12:00:00'),
    );
  });

  it('should return empty array when there are no intersections', () => {
    const intervalsA = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00Z'),
        DateTime.fromISO('2024-10-04T10:00:00Z'),
      ),
    ];
    const intervalsB = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T11:00:00Z'),
        DateTime.fromISO('2024-10-04T14:00:00Z'),
      ),
    ];

    const result = findIntervalsIntersections(intervalsA, intervalsB);
    expect(result).toHaveLength(0);
  });

  it('should return correct intersections for multiple overlapping intervals', () => {
    const intervalsA = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T12:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T13:00:00'),
        DateTime.fromISO('2024-10-04T15:00:00'),
      ),
    ];
    const intervalsB = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T10:00:00'),
        DateTime.fromISO('2024-10-04T14:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T15:00:00'),
        DateTime.fromISO('2024-10-04T16:00:00'),
      ),
    ];

    const result = findIntervalsIntersections(intervalsA, intervalsB);
    expect(result).toHaveLength(2);
    expect(result[0].start).toStrictEqual(
      DateTime.fromISO('2024-10-04T10:00:00'),
    );
    expect(result[0].end).toStrictEqual(
      DateTime.fromISO('2024-10-04T12:00:00'),
    );
    expect(result[1].start).toStrictEqual(
      DateTime.fromISO('2024-10-04T13:00:00'),
    );
    expect(result[1].end).toStrictEqual(
      DateTime.fromISO('2024-10-04T14:00:00'),
    );
  });

  it('should handle adjacent intervals without overlap', () => {
    const intervalsA = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T10:00:00'),
      ),
    ];
    const intervalsB = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T10:00:00'),
        DateTime.fromISO('2024-10-04T12:00:00'),
      ),
    ];

    const result = findIntervalsIntersections(intervalsA, intervalsB);
    expect(result).toHaveLength(0);
  });

  it('should handle intervals that overlap exactly at the boundary', () => {
    const intervalsA = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T10:00:00'),
      ),
    ];
    const intervalsB = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T09:00:00'),
      ),
    ];

    const result = findIntervalsIntersections(intervalsA, intervalsB);
    expect(result).toHaveLength(1);
    expect(result[0].start).toStrictEqual(DateTime.fromISO('2024-10-04T08:00'));
    expect(result[0].end).toStrictEqual(DateTime.fromISO('2024-10-04T09:00'));
  });
});

describe('mergeAdjacentIntervals', () => {
  it('should return an empty array for no intervals', () => {
    const result = mergeOverlappingIntervals([]);
    expect(result).toEqual([]);
  });
  it('should return the same interval if there is only one', () => {
    const interval = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-02T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(interval);
    expect(result).toEqual(interval);
  });
  it('should merge two adjacent intervals', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-02T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-02T00:00:00'),
        DateTime.fromISO('2023-10-03T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(intervals);
    const expected = Interval.fromDateTimes(
      DateTime.fromISO('2023-10-01T00:00:00'),
      DateTime.fromISO('2023-10-03T00:00:00'),
    );
    expect(result).toEqual([expected]);
  });
  it('should not merge non-adjacent intervals', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-02T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-03T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(intervals);
    expect(result).toEqual(intervals);
  });
  it('should merge multiple adjacent intervals', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-02T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-02T00:00:00'),
        DateTime.fromISO('2023-10-03T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-03T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(intervals);
    const expected = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    expect(result).toEqual(expected);
  });
  it('should handle intervals out of order', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-02T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-02T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(intervals);
    const expected = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    expect(result).toEqual(expected);
  });
  it('should merge intervals that overlaps', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-03T00:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-02T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    const result = mergeOverlappingIntervals(intervals);
    const expected = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-10-01T00:00:00'),
        DateTime.fromISO('2023-10-04T00:00:00'),
      ),
    ];
    expect(result).toEqual(expected);
  });
});

describe('chunkIntervalsByDuration', () => {
  const duration = Duration.fromObject({ minutes: 30 });
  it('returns empty array when intervals or durationMinutes is missing', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T12:00:00'),
      ),
    ];
    expect(chunkIntervalsByDuration([], duration)).toEqual([]);
    expect(chunkIntervalsByDuration(intervals, undefined)).toEqual([]);
  });
  it('splits intervals correctly by specified duration', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T12:00:00'),
      ),
    ];
    const chunkIntervals = chunkIntervalsByDuration(intervals, duration);

    expect(chunkIntervals).toHaveLength(15);
    chunkIntervals.forEach((chunkInterval) =>
      expect(chunkInterval.toDuration('minutes').minutes).toBe(
        duration.minutes,
      ),
    );
  });
  it('returns only intervals of exact matching duration', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T09:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T09:00:00'),
        DateTime.fromISO('2024-10-04T09:45:00'),
      ),
    ];
    const result = chunkIntervalsByDuration(intervals, duration);

    expect(result).toHaveLength(6);
    result.forEach((interval) => {
      expect(interval.toDuration('minutes').minutes).toBe(duration.minutes);
    });
  });
  it('handles edge case where interval is shorter than specified duration', () => {
    const shortIntervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T08:00:00'),
        DateTime.fromISO('2024-10-04T08:15:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2024-10-04T09:00:00'),
        DateTime.fromISO('2024-10-04T09:25:00'),
      ),
    ];
    const result = chunkIntervalsByDuration(shortIntervals, duration);

    expect(result).toEqual([]);
  });
  it('handles edge case with multiple intervals and varying durations', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T00:00:00'),
        DateTime.fromISO('2023-01-01T00:50:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T01:00:00'),
        DateTime.fromISO('2023-01-01T02:10:00'),
      ),
    ];
    const result = chunkIntervalsByDuration(intervals, duration);

    // Expected 5 intervals of 30 minutes (50 minutes gets truncated)
    expect(result).toHaveLength(5);
    result.forEach((interval) => {
      expect(interval.toDuration('minutes').minutes).toBe(duration.minutes);
    });
  });
  it('handles case with adjacent intervals ', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T00:00:00'),
        DateTime.fromISO('2023-01-01T00:50:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T00:50:00'),
        DateTime.fromISO('2023-01-01T02:10:00'),
      ),
    ];
    const result = chunkIntervalsByDuration(intervals, duration);

    // Expected 7 intervals of 30 minutes, the intervals are adjacent and thus merged
    expect(result).toHaveLength(7);
    result.forEach((interval) => {
      expect(interval.toDuration('minutes').minutes).toBe(duration.minutes);
    });
  });
  it('handles case with out of order adjacent intervals ', () => {
    const intervals = [
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T07:00:00'),
        DateTime.fromISO('2023-01-01T07:15:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T06:30:00'),
        DateTime.fromISO('2023-01-01T07:00:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T12:30:00'),
        DateTime.fromISO('2023-01-01T13:15:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T07:15:00'),
        DateTime.fromISO('2023-01-01T10:30:00'),
      ),
    ];
    const result = chunkIntervalsByDuration(intervals, duration);

    expect(result).toHaveLength(17);
    result.forEach((interval) => {
      expect(interval.toDuration('minutes').minutes).toBe(duration.minutes);
    });
  });
});

describe('chunkByDurationAndInterval', () => {
  test('includes chunks fully engulfed by interval', () => {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO('2023-01-01T09:00'),
      DateTime.fromISO('2023-01-01T11:00'),
    );
    const duration = Duration.fromObject({ minutes: 30 });
    const intervalMinutes = 15;

    // The interval will be split into 15-minute chunks
    const result = chunkByDurationAndInterval(
      interval,
      duration,
      intervalMinutes,
    );

    // We expect 15-minute chunks that can fully fit a 30-minute duration
    expect(result).toEqual([
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:00'),
        DateTime.fromISO('2023-01-01T09:30'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:15'),
        DateTime.fromISO('2023-01-01T09:45'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:30'),
        DateTime.fromISO('2023-01-01T10:00'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:45'),
        DateTime.fromISO('2023-01-01T10:15'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T10:00'),
        DateTime.fromISO('2023-01-01T10:30'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T10:15'),
        DateTime.fromISO('2023-01-01T10:45'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T10:30'),
        DateTime.fromISO('2023-01-01T11:00'),
      ),
    ]);
  });

  test('excludes chunks where duration does not fit within interval', () => {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO('2023-01-01T09:00'),
      DateTime.fromISO('2023-01-01T10:00'),
    );
    const duration = Duration.fromObject({ minutes: 45 }); // Duration is longer than some chunks
    const intervalMinutes = 15;

    // The interval will be split into 15-minute chunks
    const result = chunkByDurationAndInterval(
      interval,
      duration,
      intervalMinutes,
    );

    // Expect chunks that can fully fit a 45-minute duration
    expect(result).toEqual([
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:00'),
        DateTime.fromISO('2023-01-01T09:45'),
      ),
      Interval.fromDateTimes(
        DateTime.fromISO('2023-01-01T09:15'),
        DateTime.fromISO('2023-01-01T10:00'),
      ),
    ]);
  });

  test('returns an empty array when chunks are too small to fit the duration', () => {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO('2023-01-01T09:00'),
      DateTime.fromISO('2023-01-01T09:30'),
    );
    const duration = Duration.fromObject({ minutes: 45 }); // Duration is larger than the interval itself
    const intervalMinutes = 15;

    // The interval will be split into 15-minute chunks
    const result = chunkByDurationAndInterval(
      interval,
      duration,
      intervalMinutes,
    );

    // No chunks should fit a 45-minute duration
    expect(result).toEqual([]);
  });

  test('handles edge cases with no intervals', () => {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO('2023-01-01T09:00'),
      DateTime.fromISO('2023-01-01T09:00'), // Zero-length interval
    );
    const duration = Duration.fromObject({ minutes: 15 });
    const intervalMinutes = 15;

    // No chunks should be generated from a zero-length interval
    const result = chunkByDurationAndInterval(
      interval,
      duration,
      intervalMinutes,
    );

    expect(result).toEqual([]);
  });
});
