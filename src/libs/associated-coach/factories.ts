import type { Coach } from './types';

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

const lastnames = [
  'Martin',
  'Pitt',
  'Bryan',
  'Bernard',
  'Smith',
  'Johnson',
  'William',
  'Moore',
  'Tayler',
  'Walker',
  'Lee',
];

const firstnames = [
  'Noah',
  'Aron',
  'Etan',
  'Tom',
  'Isac',
  'Nolan',
  'Evan',
  'Lenny',
  'Charlie',
  'Julian',
];

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

export function coachFactory(): Coach {
  const wichGender = random_int(2);
  const name = lastnames[random_int(lastnames.length - 1)];
  return {
    firstname: firstnames[random_int(firstnames.length - 1)],
    lastname: name,
    name,
    gender: gender[wichGender],
    rating,
    id: random_int(1000),
    birthday: randomDate(),
    photo: photo[wichGender],
    description: `Hello, my name is ${name}`,
    phone: `00645545${random_int(9)}`,
    email: `${name}@coach.bsport`,
    associated_coach_id: random_int(1000),
    default_payment_rule_id: random_int(1000),
    coach_payment_rule_id: random_int(1000),
    private_coach_payment_rule_id: random_int(1000),
    workshop_coach_payment_rule_id: random_int(1000),
    coach_payment_rule_group_id: random_int(1000),
    facebook_url: `${name}.facebook.com`,
    instagram_url: `${name}.insta.com`,
    disabled: randomBoolean(),
    associatedcoach_set: randomArray(10),
    private_slots_coach_payment_rules:
      randomPrivate_slots_coach_payment_rules(3),
  };
}

export function coachesFactory(length: number): Array<Coach> {
  const res = new Array(length).fill(0);
  return res.map(() => coachFactory());
}
