import { faker } from '@faker-js/faker';
import type { Member, MemberNote, MemberUploadedFile } from '../types';
import FactoryBotTag from '../../tag/factory';
import { generateRandomInt } from '../../../utils/factories';

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
  const y = (1950 + generateRandomInt(70)).toString();
  const m = generateRandomInt(13);
  let mm = '';
  if (m < 11) {
    mm = `0${m.toString()}`;
  } else {
    mm = m.toString();
  }

  const d = generateRandomInt(31) + 1;
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
  return table[generateRandomInt(2)];
}

const randomMemberNote = (): MemberNote => {
  return {
    id: generateRandomInt(1000),
    text: faker.hacker.phrase(),
    highlighted: randomBoolean(),
    date: randomDate(),
    is_medical: randomBoolean(),
  };
};

const randomNotes = (): MemberNote[] => {
  return new Array(generateRandomInt(10)).fill(randomMemberNote());
};

const randomFile = (): MemberUploadedFile => {
  return {
    id: generateRandomInt(1000),
    member: generateRandomInt(1000),
    name: faker.person.fullName(),
    updated_at: randomDate(),
    file_path: 'random_path.doc',
    coach_has_access: randomBoolean(),
  };
};

const randomFiles = (): MemberUploadedFile[] => {
  return new Array(generateRandomInt(10)).fill(randomFile());
};

type MemberProps = {
  credit_account_balance?: number;
  total_unpaid_amount?: string;
  number_tags?: number;
};

export function MemberFactory(
  {
    credit_account_balance = generateRandomInt(50),
    total_unpaid_amount = `${generateRandomInt(50)}`,
    number_tags = 0,
  }: MemberProps,
  withoutPhoneOrEmail?: boolean,
  id?: number,
): Member {
  const wichGender = generateRandomInt(2);
  const firstname = firstnames[generateRandomInt(lastnames.length - 1)];
  const lastname = lastnames[generateRandomInt(lastnames.length - 1)];
  let email = `${firstname}@member.bsport`;
  let phone_number = `00645545${generateRandomInt(9)}`;
  if (withoutPhoneOrEmail && Math.random() < 0.3) email = '';
  if (withoutPhoneOrEmail && Math.random() < 0.3) phone_number = '';
  const memberId = id || generateRandomInt(1000);
  return {
    id: memberId,
    name: `${firstname} ${lastname}`,
    consumer: generateRandomInt(1000),
    firstname,
    lastname,
    gender: gender[wichGender],
    barcode: '123',
    date_joined: randomDate(),
    membership_ID: '1',
    accept_email: randomBoolean(),
    accept_sms: randomBoolean(),
    email,
    address: '3 Avenue du Bar',
    internal_account: generateRandomInt(50),
    credit_account_balance,
    total_unpaid_amount,
    notes: randomNotes(),
    tags: FactoryBotTag.Tag.create(number_tags),
    next_booking: randomDate(),
    previous_booking: randomDate(),
    billing_plans: null,
    photo: photo[wichGender],
    phone_number,
    birthday: randomDate(),
    files: randomFiles(),
    general_terms_and_conditions_date_accepted: null,
    general_terms_and_conditions_accepted: null,
    general_terms_of_use_date_accepted: null,
    general_terms_of_use_accepted: null,
    waiver_accepted: 'foo',
    emergency_contact: 'bar',
    archived: false,
    pending_email: null,
    default_billing_establishment: null,
    unsubscribe_link: faker.hacker.phrase(),
    spivi_privacy_settings_accepted: randomBoolean(),
  };
}

export default function MembersFactory(
  length: number,
  withoutPhoneOrEmail?: boolean,
  idList?: number[],
): Array<Member> {
  const res = new Array(length).fill(0);
  return res.map((_, i) => MemberFactory({}, withoutPhoneOrEmail, idList?.[i]));
}
