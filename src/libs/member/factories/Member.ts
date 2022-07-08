import type { Member } from '../types';

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

export function MemberFactory(): Member {
  const wichGender = random_int(2);
  const firstname = firstnames[random_int(lastnames.length - 1)];
  const lastname = lastnames[random_int(lastnames.length - 1)];
  return {
    id: random_int(1000),
    name: `${firstname} ${lastname}`,
    consumer: random_int(1000),
    firstname,
    lastname,
    gender: gender[wichGender],
    barcode: '123',
    date_joined: randomDate(),
    membership_ID: '1',
    accept_email: randomBoolean(),
    accept_sms: randomBoolean(),
    email: `${firstname}@member.bsport`,
    address: '3 Avenue du Bar',
    internal_account: random_int(50),
    credit_account_balance: random_int(50),
    notes: [],
    tags: [],
    next_booking: randomDate(),
    previous_booking: randomDate(),
    billing_plans: null,
    photo: photo[wichGender],
    phone_number: `00645545${random_int(9)}`,
    birthday: randomDate(),
    files: [],
    general_terms_and_conditions_date_accepted: null,
    general_terms_and_conditions_accepted: null,
    general_terms_of_use_date_accepted: null,
    general_terms_of_use_accepted: null,
    waiver_accepted: 'foo',
    emergency_contact: 'bar',
    archived: false,
    pending_email: null,
  };
}

export default function MembersFactory(length: number): Array<Member> {
  const res = new Array(length).fill(0);
  return res.map(() => MemberFactory());
}
