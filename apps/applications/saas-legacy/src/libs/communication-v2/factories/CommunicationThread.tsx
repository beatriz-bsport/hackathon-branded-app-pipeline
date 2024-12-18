import { faker } from '@faker-js/faker';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { CommunicationThreadWithUnreadAnswersCount } from '#src/libs/communication-v2/types';
import DEFAULT_PROFILE_PICTURE_URL from '../../../assets/constants';

const OFFER_COVERS: Array<string> = [
  'https://assets.staging.bsport.io/activity/boxethai.jpg',
  'https://assets.staging.bsport.io/activity/ladyboxing.jpg',
  'https://assets.staging.bsport.io/activity/boxefitness.jpg',
  'https://assets.staging.bsport.io/activity/multiboxealterne.jpeg',
  'https://assets.staging.bsport.io/activity/kickboxing.jpg',
  'https://assets.staging.bsport.io/activity/Image_Boxe_Anglise.jpg',
  'https://assets.staging.bsport.io/activity/Boxe_Francaise.jpg',
];

function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function fakerName(): string {
  return faker.person.fullName();
}

function fakerTextContent(length: number): string {
  let fakeText = '';
  for (let i = 0; i < randomInt(length); i += 1) {
    fakeText += faker.hacker.phrase();
  }

  if (fakeText.length > 50) {
    fakeText = fakeText.slice(0, 47).concat('...');
  }
  return fakeText;
}

function twoDigitsInstant(instant: number): string {
  let stringInstant = '';

  if (instant < 10) {
    stringInstant = `0${instant}`;
  } else {
    stringInstant = instant.toString();
  }

  return stringInstant;
}

function randomDate(): string {
  const y = (2022 + randomInt(1)).toString();

  const m = randomInt(12);
  const mm = twoDigitsInstant(m);

  const d = randomInt(30) + 1;
  const dd = twoDigitsInstant(d);

  const h = randomInt(23);
  const HH = twoDigitsInstant(h);

  const M = randomInt(59);
  const MM = twoDigitsInstant(M);

  return `${y}-${mm}-${dd} ${HH}:${MM}`;
}

export function MemberThread(
  index?: number,
): CommunicationThreadWithUnreadAnswersCount {
  // @ts-expect-error
  return {
    id: index || randomInt(1000),
    title: fakerName(),
    cover: DEFAULT_PROFILE_PICTURE_URL,
    last_communication_datetime: randomDate(),
    last_communication_content: fakerTextContent(10),
    last_communication_has_been_read: randomBoolean(),
    muted: randomBoolean(),
    favorite: randomBoolean(),
    disabled: randomBoolean(),
    related_object_kind: ChatThreadKinds.Member,
    related_object_id: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}

function MemberThreadList(
  length: number,
): CommunicationThreadWithUnreadAnswersCount[] {
  const threadList = [];
  for (let i = 0; i < length; i += 1) {
    threadList.push(MemberThread());
  }
  return threadList;
}

function MemberThreadBatch(): CommunicationThreadWithUnreadAnswersCount[] {
  return MemberThreadList(15);
}

export function OfferThread(): CommunicationThreadWithUnreadAnswersCount {
  // @ts-expect-error
  return {
    id: randomInt(1000),
    title: fakerName(),
    subtitle: `${fakerName()} - ${randomDate()}`,
    cover: OFFER_COVERS[randomInt(7)],
    last_communication_datetime: randomDate(),
    last_communication_content: fakerTextContent(10),
    last_communication_has_been_read: randomBoolean(),
    muted: randomBoolean(),
    favorite: randomBoolean(),
    disabled: randomBoolean(),
    related_object_kind: ChatThreadKinds.Offer,
    related_object_id: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}

function OfferThreadList(
  length: number,
): CommunicationThreadWithUnreadAnswersCount[] {
  const threadList = [];
  for (let i = 0; i < length; i += 1) {
    threadList.push(OfferThread());
  }
  return threadList;
}

function OfferThreadBatch(): CommunicationThreadWithUnreadAnswersCount[] {
  return OfferThreadList(15);
}

export function SmartListThread(): CommunicationThreadWithUnreadAnswersCount {
  // @ts-expect-error
  return {
    id: randomInt(1000),
    title: fakerName(),
    last_communication_datetime: randomDate(),
    last_communication_content: fakerTextContent(10),
    last_communication_has_been_read: randomBoolean(),
    muted: randomBoolean(),
    favorite: randomBoolean(),
    disabled: randomBoolean(),
    related_object_kind: ChatThreadKinds.Smartlist,
    related_object_id: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}

function SmartlistThreadList(
  length: number,
): CommunicationThreadWithUnreadAnswersCount[] {
  const threadList = [];
  for (let i = 0; i < length; i += 1) {
    threadList.push(SmartListThread());
  }
  return threadList;
}

function SmartlistThreadBatch(): CommunicationThreadWithUnreadAnswersCount[] {
  return SmartlistThreadList(15);
}

export function RandomThreadBatch(): CommunicationThreadWithUnreadAnswersCount[] {
  const threadBatches = [
    MemberThreadBatch(),
    SmartlistThreadBatch(),
    OfferThreadBatch(),
  ];
  return threadBatches[randomInt(threadBatches.length)];
}
