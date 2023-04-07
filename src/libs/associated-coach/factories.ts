// @ts-nocheck
import faker from 'faker';

import type { Coach } from './types';

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

const gender = ['M', 'F'];

const rating = '-1.00';

const photo = [
  'https://bsport-django-asset-prod.s3.amazonaws.com/gymnast-male.png',
  'https://bsport-django-asset-prod.s3.amazonaws.com/gymnast-female.png',
];

function randomDate() {
  const y = (1950 + random_int(70)).toString();
  const m = random_int(13);
  let mm = '';
  if (m < 11) {
    mm = `0${m.toString()}`;
  } else {
    mm = m.toString();
  }

  const d = random_int(31) + 1;
  let dd = '';
  if (d < 11) {
    dd = `0${d.toString()}`;
  } else {
    dd = d.toString();
  }

  return `${y}-${mm}-${dd}`;
}

const hexa_list = '0123456789ABCDEF';

function randomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    const number_decimal = random_int(16);
    color += hexa_list[number_decimal];
  }
  return color;
}

function randomBoolean() {
  const table = [true, false];
  return table[random_int(2)];
}

function randomArray(length: number) {
  const res = new Array(length).fill(0);
  return res.map(() => random_int(1000));
}

function randomPrivate_slots_coach_payment_rules(length: number) {
  const res = new Array(length).fill(0);
  return res.map(() => ({
    private_slot: random_int(100),
    coach_payment_rule: random_int(1000),
  }));
}

export function coachFactory(
  coach_payment_rule_group_id?: number,
): Partial<Coach> {
  const wichGender = random_int(2);
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const name = `${firstName} ${lastName}`;

  return {
    firstname: firstName,
    lastname: lastName,
    name,
    gender: gender[wichGender],
    rating,
    id: random_int(1000),
    birthday: randomDate(),
    photo: photo[wichGender],
    description: `Hello, my name is ${name}`,
    phone: `00645545${random_int(9)}`,
    email: faker.internet.email(firstName, lastName),
    color: randomColor(),
    associated_coach_id: random_int(1000),
    default_payment_rule_id: random_int(1000),
    coach_payment_rule_id: random_int(1000),
    private_coach_payment_rule_id: random_int(1000),
    workshop_coach_payment_rule_id: random_int(1000),
    coach_payment_rule_group_id:
      coach_payment_rule_group_id || random_int(1000),
    facebook_url: `${lastName}.facebook.com`,
    instagram_url: `${lastName}.insta.com`,
    disabled: randomBoolean(),
    associatedcoach_set: randomArray(10),
    private_slots_coach_payment_rules:
      randomPrivate_slots_coach_payment_rules(3),
    has_access_to_coach_space: randomBoolean(),
  };
}

export function coachesFactory(length: number): Partial<Coach>[] {
  const res = new Array(length).fill(0);
  return res.map(() => coachFactory());
}
