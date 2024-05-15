import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import AVAILABLE_CATEGORY from '@bsport/common/lib/master-data/sports';
import { generateRandomInt } from '../../utils/factories';

import { MetaActivity } from '#libs/meta-activity/types';
import { RecurrenceRuleGroupOffer } from './types';

const NAMES: Array<string> = [
  'Boxing',
  'Yoga',
  'Gym',
  'Swimming',
  'Football',
  'Tennis',
  'Basketball',
  'Fitness',
  'Ping Pong',
  'Running',
];

const COVERS_MAIN: Array<string> = [
  'https://assets.staging.bsport.io/activity/boxethai.jpg',
  'https://assets.staging.bsport.io/activity/ladyboxing.jpg',
  'https://assets.staging.bsport.io/activity/boxefitness.jpg',
  'https://assets.staging.bsport.io/activity/multiboxealterne.jpeg',
  'https://assets.staging.bsport.io/activity/kickboxing.jpg',
  'https://assets.staging.bsport.io/activity/Image_Boxe_Anglise.jpg',
  'https://assets.staging.bsport.io/activity/Boxe_Francaise.jpg',
];

const RATINGS: Array<string> = ['1', '2', '3', '4', '5'];

const IMAGES: Array<string> = ['Ball', 'Room', 'Stadium', 'Pitch'];

const NEXT_SLOTS: Array<string> = [
  DateTime.now().plus({ days: 2 }).toRelativeCalendar(),
  DateTime.now().plus({ days: 5 }).toRelativeCalendar(),
  DateTime.now().plus({ days: 12 }).toRelativeCalendar(),
  DateTime.now().plus({ days: 17 }).toRelativeCalendar(),
  DateTime.now().plus({ days: 26 }).toRelativeCalendar(),
];

const DESCRIPTIONS: Array<string> = [
  'Very beautifull',
  'Handsome',
  'Small',
  'Big',
  'Far away',
  'Expensive',
  'Good rates',
];

const COLORS: Array<string> = ['', 'blue', 'red', 'green', 'yellow', 'black'];

function random_choice(arr: Array<any>): any {
  return arr[generateRandomInt(arr.length)];
}

export function meta_activity_factory(num_el: number): Array<MetaActivity> {
  const META_ACTIVITY_IDS: Array<number> = [...Array(num_el).keys()];
  const names = [...Array(num_el)].map((_, i) => NAMES[i % NAMES.length]);
  const images_fac = [...Array(num_el).keys()].map((id) => ({
    id,
    image: random_choice(IMAGES),
  }));
  // @ts-expect-error
  return META_ACTIVITY_IDS.map((id) => {
    return {
      id: id + 1,
      name: names[id],
      cover_main: random_choice(COVERS_MAIN),
      rating: random_choice(RATINGS),
      SCT: id,
      parent_category: random_choice(AVAILABLE_CATEGORY).id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      images: images_fac.filter((e) => generateRandomInt(6) === 1),
      establishments: [],
      next_slot: random_choice(NEXT_SLOTS),
      company: id,
      activities: [],
      description: random_choice(DESCRIPTIONS),
      last_booking_minutes: generateRandomInt(5000),
      last_discard_minutes: generateRandomInt(5000),
      first_booking_minutes_until: generateRandomInt(20000),
      is_workshop: false,
      is_broadcast: false,
      customer_enabled: false,
      color: random_choice(COLORS),
      on_booking_notification: [],
      auto_discard_active: false,
      auto_discard_hours_before_start: generateRandomInt(20),
      auto_discard_min_bookings_nb: generateRandomInt(20),
    };
  });
}

export const offerGroupFactory = () => ({
  id: 1,
  company: 1,
  meta_activity: 1,
  offers: [] as number[],
  level: 1,
  full_booking_only: true,
  allow_booking_after_start: true,
  available: true,
  recurrence_id: 'fdsfdsfsd',
  name: faker.lorem.word(2),
  recurrence_rule: {
    count: 1,
    frequence: 0,
    interval: null,
    until: null,
  } as RecurrenceRuleGroupOffer,
  manager_only: false,
  recurrence_index: 1,
});
