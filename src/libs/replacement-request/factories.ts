// @ts-nocheck

import { offerFactory } from '#libs/offer/factory';
import { generateRandomInt } from '../../utils/factories';

import { ReplacementRequest, ReplacementRequestCoachAnswer } from './types';
import { Coach } from '#libs/associated-coach/types';
import { Tag } from '#libs/tag/types';
import { Establishment } from '#libs/establishment/types';
import { Level } from '#libs/level/types';
import {
  ReplacementRequestCoachAnswerStatus,
  ReplacementRequestStatus,
} from './constants';
import { coachFactory } from '#libs/associated-coach/factories';

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomStatus() {
  return generateRandomInt(3) + 1;
}

export function replacementRequestFactory(
  status: ReplacementRequestStatus = null,
): ReplacementRequest<
  Coach,
  Establishment,
  number,
  number,
  Tag,
  number,
  Level
> {
  return {
    id: generateRandomInt(99),
    company: generateRandomInt(999),
    status: status || randomStatus(),
    reason: 'Reason of the replacement request',
    date_requested: randomDate(
      new Date(),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    closing_date: randomDate(
      new Date(2022, 0, 1, 0, 0),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    closing_date_override: null,
    offer: offerFactory(),
    coach_answer: [],
    has_requested_late: generateRandomInt(3) === 0,
  };
}

export function replacementRequestsFactory(
  number = 1,
  status: ReplacementRequestStatus = null,
): ReplacementRequest<
  Coach,
  Establishment,
  number,
  number,
  Tag,
  number,
  Level
>[] {
  const ids = [...Array(number).keys()];
  return ids.map((id) => ({
    id,
    company: generateRandomInt(999),
    status: status || randomStatus(),
    reason: `Reason of the replacement request n°${id}`,
    date_requested: randomDate(
      new Date(),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    closing_date: randomDate(
      new Date(2022, 0, 1, 0, 0),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    closing_date_override: null,
    offer: offerFactory(),
    coach_answer: [],
    has_requested_late: generateRandomInt(3) === 0,
  }));
}

export function replacementRequestCoachAnswerFactory(
  status: ReplacementRequestCoachAnswerStatus = null,
): ReplacementRequestCoachAnswer<
  Coach,
  ReplacementRequest<Coach, Establishment, number, number, Tag, number, Level>
> {
  return {
    id: generateRandomInt(99),
    answer: status || randomStatus(),
    date_created: randomDate(new Date(), new Date(2023, 0, 1, 0, 0)).toString(),
    date_answered: randomDate(
      new Date(2022, 0, 1, 0, 0),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    coach: coachFactory(),
    replacementRequest: replacementRequestFactory(),
  };
}

export function replacementRequestCoachAnswersFactory(
  number = 1,
  status: ReplacementRequestCoachAnswerStatus = null,
): ReplacementRequestCoachAnswer<
  Coach,
  ReplacementRequest<Coach, Establishment, number, number, Tag, number, Level>
>[] {
  const ids = [...Array(number).keys()];
  return ids.map((id) => ({
    id,
    answer: status || randomStatus(),
    date_created: randomDate(new Date(), new Date(2023, 0, 1, 0, 0)).toString(),
    date_answered: randomDate(
      new Date(2022, 0, 1, 0, 0),
      new Date(2023, 0, 1, 0, 0),
    ).toString(),
    coach: coachFactory(),
    replacementRequest: replacementRequestFactory(),
  }));
}
