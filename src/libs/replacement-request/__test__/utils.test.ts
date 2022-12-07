import { computeNbCompatibleCoaches } from '../utils';

const fakeCoachesWithoutIds = [
  {
    is_teaching_all_activities: true,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [],
    categories_taught: [],
  },
  {
    is_teaching_all_activities: true,
    is_teaching_all_workshops: true,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [],
    categories_taught: [],
  },
  {
    is_teaching_all_activities: false,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [],
    categories_taught: [],
  },
];

const fakeCoachesOnlyIds = [
  {
    is_teaching_all_activities: false,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [1],
    categories_taught: [1, 2],
  },
  {
    is_teaching_all_activities: false,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [2, 3, 4],
    categories_taught: [1, 2, 3],
  },
  {
    is_teaching_all_activities: false,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [1],
    categories_taught: [9999],
  },
];

const fakeCoachesMixed = [
  {
    is_teaching_all_activities: true,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [1],
    categories_taught: [1, 2],
  },
  {
    is_teaching_all_activities: false,
    is_teaching_all_workshops: true,
    is_teaching_all_categories: true,
    meta_activities_taught: [1, 3],
    workshops_taught: [],
    categories_taught: [],
  },
  {
    is_teaching_all_activities: true,
    is_teaching_all_workshops: false,
    is_teaching_all_categories: false,
    meta_activities_taught: [],
    workshops_taught: [1],
    categories_taught: [9999],
  },
];

describe('TEST computeCompatibleCoaches', () => {
  it('Must work when no id is present, only is teaching all', () => {
    expect(computeNbCompatibleCoaches(fakeCoachesWithoutIds)).toStrictEqual({
      activities: { all: 2 },
      workshops: { all: 1 },
      SCTs: { all: 0 },
    });
  });

  it('Must work when no only ids are present, no is teaching all', () => {
    expect(computeNbCompatibleCoaches(fakeCoachesOnlyIds)).toStrictEqual({
      activities: { all: 0 },
      workshops: { 1: 2, 2: 1, 3: 1, 4: 1, all: 0 },
      SCTs: { 1: 2, 2: 2, 3: 1, 9999: 1, all: 0 },
    });
  });

  it('Must work when no only ids are present and some is teaching all', () => {
    expect(computeNbCompatibleCoaches(fakeCoachesMixed)).toStrictEqual({
      activities: { 1: 3, 3: 3, all: 2 },
      workshops: { 1: 3, all: 1 },
      SCTs: { 1: 2, 2: 2, 9999: 2, all: 1 },
    });
  });
});
