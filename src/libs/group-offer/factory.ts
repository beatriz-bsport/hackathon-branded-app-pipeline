import moment from 'moment';
import AVAILABLE_CATEGORY from '@bsport/common/lib/master-data/sports';
import { MetaActivity } from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

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
  moment().add(2, 'days').calendar(),
  moment().add(5, 'days').calendar(),
  moment().add(12, 'days').calendar(),
  moment().add(17, 'days').calendar(),
  moment().add(26, 'days').calendar(),
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
  return arr[random_int(arr.length)];
}

export function meta_activity_factory(num_el: number): Array<MetaActivity> {
  const META_ACTIVITY_IDS: Array<number> = [...Array(num_el).keys()];
  const names = [...Array(num_el)].map((_, i) => NAMES[i % NAMES.length]);
  const images_fac = [...Array(num_el).keys()].map((id) => ({
    id,
    image: random_choice(IMAGES),
  }));
  return META_ACTIVITY_IDS.map((id) => {
    return {
      id: id + 1,
      name: names[id],
      cover_main: random_choice(COVERS_MAIN),
      rating: random_choice(RATINGS),
      SCT: id,
      parent_category: random_choice(AVAILABLE_CATEGORY).id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      images: images_fac.filter((e) => random_int(6) === 1),
      establishments: [],
      next_slot: random_choice(NEXT_SLOTS),
      company: id,
      activities: [],
      description: random_choice(DESCRIPTIONS),
      last_booking_minutes: random_int(5000),
      last_discard_minutes: random_int(5000),
      first_booking_minutes_until: random_int(20000),
      is_workshop: false,
      is_broadcast: false,
      customer_enabled: false,
      color: random_choice(COLORS),
      on_booking_notification: [],
      auto_discard_active: false,
      auto_discard_hours_before_start: random_int(20),
      auto_discard_min_bookings_nb: random_int(20),
    };
  });
}
