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
import { generateRandomInt } from '../../utils/factories';

const categories = ['Swimming', 'Running', 'Collective'];

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
    company: generateRandomInt(1000),
    activity: generateRandomInt(1000),
    title: 'Title of offer',
    broadcast_link: '',
    available: true,
    duration_minute: generateRandomInt(90),
    id: generateRandomInt(1000),
    activity_id: generateRandomInt(1000),
    category: categories[generateRandomInt(categories.length - 1)],
    waiting_list_max_size: generateRandomInt(50),
    coach_override: coachFactory(),
    coach: coachFactory(),
    cover_main: `Cover of offer`,
    date_end: date_end.toString(),
    date_start: date_start.toString(),
    effectif: generateRandomInt(100),
    level: overrideData?.level ?? level,
    level_id: overrideData?.level?.id ?? level.id,
    meta_activity_id: generateRandomInt(1000),
    name: `Activity for ${level.name}`,
    nb_option: generateRandomInt(10),
    nb_bookings: generateRandomInt(50),
    parent_category: generateRandomInt(1000),
    price: generateRandomInt(50),
    price_coach: generateRandomInt(20),
    credit_price: overrideData?.credits ?? generateRandomInt(3),
    is_full: false,
    establishment_override: establishment_factory(1)[0],
    establishment: establishment_factory(1)[0],
    meta_activity: generateRandomInt(1000),
    timezone_name: 'Europe/Paris',
    room_blueprint: generateRandomInt(100),
    whitelist_tags: tagListFactory(3),
    blacklist_tags: tagListFactory(3),
    group: generateRandomInt(100),
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
