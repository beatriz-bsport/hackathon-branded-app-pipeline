// @ts-nocheck
import { Offer } from './types';
import { Coach } from '#libs/associated-coach/types';
import { Tag } from '#libs/tag/types';
import { Establishment } from '#libs/establishment/types';
import { Level } from '#libs/level/types';
import { coachFactory } from '#libs/associated-coach/factories';
import { tagListFactory } from '../tag/factory';
import { establishment_factory } from '#libs/establishment/factory';
import { levelFactory } from '#libs/level/factories';

const categories = ['Swimming', 'Running', 'Collective'];

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

export function offerFactory(overrideData?: {
  level?: Partial<Level>;
  credits?: number;
}): Offer<Coach, Establishment, number, number, Tag, number, Level> {
  const level = levelFactory();
  const date_start = randomDate(
    new Date(2022, 0, 1, 0, 0),
    new Date(2024, 0, 1, 0, 0),
  );
  const date_end = randomDate(
    date_start,
    new Date(
      date_start.getFullYear(),
      date_start.getMonth(),
      date_start.getDate(),
      23,
      59,
    ),
  );

  return {
    company: random_int(1000),
    activity: random_int(1000),
    title: 'Title of offer',
    broadcast_link: '',
    available: true,
    duration_minute: random_int(90),
    id: random_int(1000),
    activity_id: random_int(1000),
    category: categories[random_int(categories.length - 1)],
    waiting_list_max_size: random_int(50),
    coach_override: coachFactory(),
    coach: coachFactory(),
    cover_main: `Cover of offer`,
    date_end: date_end.toString(),
    date_start: date_start.toString(),
    effectif: random_int(100),
    level: overrideData?.level ?? level,
    level_id: overrideData?.level?.id ?? level.id,
    meta_activity_id: random_int(1000),
    name: `Activity for ${level.name}`,
    nb_option: random_int(10),
    nb_bookings: random_int(50),
    parent_category: random_int(1000),
    price: random_int(50),
    price_coach: random_int(20),
    credit_price: overrideData?.credits ?? random_int(3),
    is_full: false,
    establishment_override: establishment_factory(1)[0],
    establishment: establishment_factory(1)[0],
    meta_activity: random_int(1000),
    timezone_name: 'Europe/Paris',
    room_blueprint: random_int(100),
    whitelist_tags: tagListFactory(3),
    blacklist_tags: tagListFactory(3),
    group: random_int(100),
  };
}

export function offersFactory(
  number = 1,
): Offer<Coach, Establishment, number, number, Tag, number, Level>[] {
  const list_offers = [];
  for (let i = 0; i < number; i += 1) {
    list_offers.push(offerFactory());
  }
  return list_offers;
}
