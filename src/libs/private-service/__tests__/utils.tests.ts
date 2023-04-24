// @ts-nocheck

import moment from 'moment-timezone';
import {
  groupSlotsAndMerge,
  intersectSelectionWithMergedIntervals,
} from '../utils';

const availabilitySlots: Array<any> = [
  {
    date_start: moment('2022-09-13T09:30:00+01:00').format(),
    date_end: moment('2022-09-13T12:00:00+01:00').format(),
    associated_coach: 37279,
    associated_establishment: null,
    coach: 33953,
    private_service: null,
    resource_identifier: 'associated_coach:37279',
    is_restriction: false,
    restriction_on_associated_establishments: [3452, 3453],
  },
  {
    date_start: moment('2022-09-13T10:30:00+01:00').format(),
    date_end: moment('2022-09-13T13:00:00+01:00').format(),
    associated_coach: 37279,
    associated_establishment: null,
    coach: 33953,
    private_service: null,
    resource_identifier: 'associated_coach:37279',
    is_restriction: false,
    restriction_on_associated_establishments: [3452, 3453],
  },
  {
    date_start: moment('2022-09-13T13:00:00+01:00').format(),
    date_end: moment('2022-09-13T15:00:00+01:00').format(),
    associated_coach: 37279,
    associated_establishment: null,
    coach: 33953,
    private_service: null,
    resource_identifier: 'associated_coach:37279',
    is_restriction: false,
    restriction_on_associated_establishments: [],
  },
  {
    date_start: moment('2022-09-13T06:30:00+01:00').format(),
    date_end: moment('2022-09-13T12:00:00+01:00').format(),
    associated_coach: 37280,
    associated_establishment: null,
    coach: 33954,
    private_service: null,
    resource_identifier: 'associated_coach:37280',
    is_restriction: false,
    restriction_on_associated_establishments: [3452, 3451],
  },
  {
    date_start: moment('2022-09-13T08:00:00+01:00').format(),
    date_end: moment('2022-09-13T14:30:00+01:00').format(),
    associated_coach: null,
    associated_establishment: 3452,
    establishment: 3587,
    private_service: null,
    resource_identifier: 'associated_establishment:3452',
    is_restriction: false,
    restriction_on_associated_establishments: [],
  },
  {
    date_start: moment('2022-09-13T08:00:00+01:00').format(),
    date_end: moment('2022-09-13T19:00:00+01:00').format(),
    associated_coach: null,
    coach: null,
    associated_establishment: null,
    private_service: 3951,
    resource_identifier: 'private_service:3951',
    is_restriction: false,
    restriction_on_associated_establishments: [],
  },
  {
    date_start: moment('2022-09-13T14:00:00+01:00').format(),
    date_end: moment('2022-09-13T19:00:00+01:00').format(),
    associated_coach: null,
    associated_establishment: 3453,
    resource_identifier: 'associated_establishment:3453',
    establishment: 3588,
    private_service: null,
    is_restriction: false,
    restriction_on_associated_establishments: [],
  },
];

describe('Group and merge availability slots', () => {
  it('Check correct merge', () => {
    const mergedIntervals = groupSlotsAndMerge(availabilitySlots);

    // Associated coach 37279: should have 2 keys
    expect(mergedIntervals).toHaveProperty([
      'associated_coach:37279',
      '[3452,3453]',
    ]);
    expect(mergedIntervals['associated_coach:37279']['[3452,3453]']).toEqual([
      {
        date_start: moment('2022-09-13T09:30:00+01:00').format(),
        date_end: moment('2022-09-13T13:00:00+01:00').format(),
      },
    ]);
    expect(mergedIntervals).toHaveProperty(['associated_coach:37279', '[]']);
    expect(mergedIntervals['associated_coach:37279']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T13:00:00+01:00').format(),
        date_end: moment('2022-09-13T15:00:00+01:00').format(),
      },
    ]);

    // Associated coach 37280: should have 1 key
    expect(mergedIntervals).toHaveProperty([
      'associated_coach:37280',
      '[3451,3452]',
    ]);
    expect(mergedIntervals['associated_coach:37280']['[3451,3452]']).toEqual([
      {
        date_start: moment('2022-09-13T06:30:00+01:00').format(),
        date_end: moment('2022-09-13T12:00:00+01:00').format(),
      },
    ]);

    // Associated establishment 3452: should have 1 key
    expect(mergedIntervals).toHaveProperty([
      'associated_establishment:3452',
      '[]',
    ]);
    expect(mergedIntervals['associated_establishment:3452']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T08:00:00+01:00').format(),
        date_end: moment('2022-09-13T14:30:00+01:00').format(),
      },
    ]);

    // Associated establishment 3453: should have 1 key
    expect(mergedIntervals).toHaveProperty([
      'associated_establishment:3453',
      '[]',
    ]);
    expect(mergedIntervals['associated_establishment:3453']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T14:00:00+01:00').format(),
        date_end: moment('2022-09-13T19:00:00+01:00').format(),
      },
    ]);

    // Private service 3951: should have 1 key
    expect(mergedIntervals).toHaveProperty(['private_service:3951', '[]']);
    expect(mergedIntervals['private_service:3951']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T08:00:00+01:00').format(),
        date_end: moment('2022-09-13T19:00:00+01:00').format(),
      },
    ]);
  });
});

describe('Check slot intersection with selection', () => {
  const mergedIntervals = groupSlotsAndMerge(availabilitySlots);
  it('Check empty intersection', () => {
    let intersectedIntervals = intersectSelectionWithMergedIntervals(
      {
        startStr: moment('2022-09-13T01:00:00+01:00').format(),
        endStr: moment('2022-09-13T02:00:00+01:00').format(),
      },
      mergedIntervals,
    );
    expect(intersectedIntervals).toMatchObject({});
    intersectedIntervals = intersectSelectionWithMergedIntervals(
      {
        startStr: moment('2022-09-13T19:00:00+01:00').format(),
        endStr: moment('2022-09-13T21:00:00+01:00').format(),
      },
      mergedIntervals,
    );
    expect(intersectedIntervals).toMatchObject({});
  });
  it('Check non-empty intersection', () => {
    const intersectedIntervals = intersectSelectionWithMergedIntervals(
      {
        startStr: moment('2022-09-13T11:00:00+01:00').format(),
        endStr: moment('2022-09-13T15:45:00+01:00').format(),
      },
      mergedIntervals,
    );
    expect(intersectedIntervals).toHaveProperty([
      'associated_coach:37279',
      '[3452,3453]',
    ]);
    expect(
      intersectedIntervals['associated_coach:37279']['[3452,3453]'],
    ).toEqual([
      {
        date_start: moment('2022-09-13T11:00:00+01:00').format(),
        date_end: moment('2022-09-13T13:00:00+01:00').format(),
      },
    ]);
    expect(intersectedIntervals).toHaveProperty([
      'associated_coach:37279',
      '[]',
    ]);
    expect(intersectedIntervals['associated_coach:37279']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T13:00:00+01:00').format(),
        date_end: moment('2022-09-13T15:00:00+01:00').format(),
      },
    ]);

    // Associated coach 37280: should have 1 key
    expect(intersectedIntervals).toHaveProperty([
      'associated_coach:37280',
      '[3451,3452]',
    ]);
    expect(
      intersectedIntervals['associated_coach:37280']['[3451,3452]'],
    ).toEqual([
      {
        date_start: moment('2022-09-13T11:00:00+01:00').format(),
        date_end: moment('2022-09-13T12:00:00+01:00').format(),
      },
    ]);

    // Associated establishment 3452: should have 1 key
    expect(intersectedIntervals).toHaveProperty([
      'associated_establishment:3452',
      '[]',
    ]);
    expect(intersectedIntervals['associated_establishment:3452']['[]']).toEqual(
      [
        {
          date_start: moment('2022-09-13T11:00:00+01:00').format(),
          date_end: moment('2022-09-13T14:30:00+01:00').format(),
        },
      ],
    );

    // Associated establishment 3453: should have 1 key
    expect(intersectedIntervals).toHaveProperty([
      'associated_establishment:3453',
      '[]',
    ]);
    expect(intersectedIntervals['associated_establishment:3453']['[]']).toEqual(
      [
        {
          date_start: moment('2022-09-13T14:00:00+01:00').format(),
          date_end: moment('2022-09-13T15:45:00+01:00').format(),
        },
      ],
    );

    // Private service 3951: should have 1 key
    expect(intersectedIntervals).toHaveProperty(['private_service:3951', '[]']);
    expect(intersectedIntervals['private_service:3951']['[]']).toEqual([
      {
        date_start: moment('2022-09-13T11:00:00+01:00').format(),
        date_end: moment('2022-09-13T15:45:00+01:00').format(),
      },
    ]);
  });
});
