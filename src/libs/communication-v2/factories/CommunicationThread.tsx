// @ts-nocheck
import faker from 'faker';

import { CommunicationThread } from '#libs/communication-v2/types';

const MEMBER_DEFAULT_PHOTOS = [
  'https://bsport-django-asset-prod.s3.amazonaws.com/gymnast-male.png',
  'https://bsport-django-asset-prod.s3.amazonaws.com/gymnast-female.png',
];

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

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function fakerName(): string {
  return faker.name.findName();
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

export function MemberThread(): CommunicationThread {
  return {
    id: randomInt(1000),
    name: fakerName(),
    cover: MEMBER_DEFAULT_PHOTOS[randomInt(2)],
    lastCommunicationDate: randomDate(),
    lastCommunicationContent: fakerTextContent(10),
    hasBeenRead: randomBoolean(),
    isMuted: randomBoolean(),
    isFavorite: randomBoolean(),
    isDisabled: randomBoolean(),
    relatedObjectKind: 'member',
    relatedObjectId: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}

export function OfferThread(): CommunicationThread {
  return {
    id: randomInt(1000),
    name: fakerName(),
    subtitle: `${fakerName()} - ${randomDate()}`,
    cover: OFFER_COVERS[randomInt(7)],
    lastCommunicationDate: randomDate(),
    lastCommunicationContent: fakerTextContent(10),
    hasBeenRead: randomBoolean(),
    isMuted: randomBoolean(),
    isFavorite: randomBoolean(),
    isDisabled: randomBoolean(),
    relatedObjectKind: 'offer',
    relatedObjectId: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}

export function SmartListThread(): CommunicationThread {
  return {
    id: randomInt(1000),
    name: fakerName(),
    lastCommunicationDate: randomDate(),
    lastCommunicationContent: fakerTextContent(10),
    hasBeenRead: randomBoolean(),
    isMuted: randomBoolean(),
    isFavorite: randomBoolean(),
    isDisabled: randomBoolean(),
    relatedObjectKind: 'smartlist',
    relatedObjectId: undefined,
    numberOfUnreadAnswers: randomInt(15),
  };
}
