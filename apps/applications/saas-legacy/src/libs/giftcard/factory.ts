import { DateTime } from 'luxon';
import { CB } from '@bsport/common/lib/master-data/payment-methods.js';
import { FranchiseCompanyListFactory } from '#src/libs/franchise/factories/FranchiseCompanyFactory';
import { WithFranchiseCompanies } from '#src/libs/franchise/types';
import { generateRandomInt } from '../../utils/factories';
import {
  ConsumerGiftcard,
  GiftcardV2,
  GiftcardRecipient,
  GiftcardBackgroundImage,
  GiftcardTemplateV2,
} from './types';
import { GIFTCARD_TYPES } from './constants';

const NAMES: Array<string> = [
  '10 EUR giftcard',
  '20 EUR giftcard',
  '50 EUR giftcard',
  '100 EUR giftcard',
  '200 EUR giftcard',
];

const COVERS: Array<string> = [
  'https://assets.staging.bsport.io/activity/boxethai.jpg',
  'https://assets.staging.bsport.io/activity/ladyboxing.jpg',
  'https://assets.staging.bsport.io/activity/boxefitness.jpg',
  'https://assets.staging.bsport.io/activity/multiboxealterne.jpeg',
  'https://assets.staging.bsport.io/activity/kickboxing.jpg',
  'https://assets.staging.bsport.io/activity/Image_Boxe_Anglise.jpg',
  'https://assets.staging.bsport.io/activity/Boxe_Francaise.jpg',
];

const PRICES: Array<string> = ['4.50', '2,50', '1.00', '10.00', '50.00'];

const DESCRIPTIONS: Array<string> = [
  'For students',
  'For teachers',
  'For a friend',
  'For manager',
];

const MESSAGES_FROM_FOR: Array<string> = [
  'Anthony',
  'Sofian',
  'Thomas',
  'Henry',
  'Pierre',
  'Aymeric',
  'Aude',
  'Alicia',
];

const MESSAGES: Array<string> = [
  "I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
  "It's for you I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
  "Kiss I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
  "Leave me alone I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
  "I am rich I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
  "You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor I like you It's for you Kiss Leave me alone I am rich You are poor",
];

const DATES_CREATED: Array<string> = [
  DateTime.now().minus({ days: 2 }).toISO(),
  DateTime.now().minus({ days: 5 }).toISO(),
  DateTime.now().minus({ days: 12 }).toISO(),
  DateTime.now().minus({ days: 17 }).toISO(),
  DateTime.now().minus({ days: 26 }).toISO(),
];

const DATES_ACTIVE: Array<string> = [
  DateTime.now().plus({ days: 2 }).toISO(),
  DateTime.now().plus({ days: 5 }).toISO(),
  DateTime.now().plus({ days: 12 }).toISO(),
  DateTime.now().plus({ days: 17 }).toISO(),
  DateTime.now().plus({ days: 26 }).toISO(),
];

function random_choice(arr: Array<any>): any {
  return arr[generateRandomInt(arr.length)];
}

export function giftcard_recipient_factory(
  num_el: number,
): Array<GiftcardRecipient> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  return GIFTCARD_IDS.map((id) => {
    return {
      id,
      date_created: random_choice(DATES_CREATED),
      email_sent_to: random_choice(MESSAGES_FROM_FOR),
      consumer_giftcard: id + 1,
    };
  });
}

export function giftcard_factory(
  num_el: number,
): Array<GiftcardV2<typeof GIFTCARD_TYPES.FIXED>> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  return GIFTCARD_IDS.map((id) => {
    return {
      id: id + 1,
      name: `${random_choice(NAMES)} #${id}`,
      description: random_choice(DESCRIPTIONS),
      cover: random_choice(COVERS),
      cover_thumbnail: random_choice(COVERS),
      expiration_days: generateRandomInt(100),
      price: random_choice(PRICES),
      available_payment_method_identifiers: [CB.id],
      manager_only: true,
      disabled: false,
      company: generateRandomInt(20) + 1,
      amount_gifted: generateRandomInt(100).toString(),
      bookkeeping_account: null,
      is_shared_giftcard: false,
      tags_on_consumer_item_creation: [],
      card_type: GIFTCARD_TYPES.FIXED,
      max_price: null,
      min_price: null,
      date_updated: null,
    };
  });
}

export function consumer_giftcard_factory(
  num_el: number,
): Array<ConsumerGiftcard> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  const RECIPIENTS = giftcard_recipient_factory(num_el);
  // @ts-expect-error
  return GIFTCARD_IDS.map((id) => {
    return {
      id: generateRandomInt(1000),
      consumed_amount_gifted: generateRandomInt(10).toString(),
      src_member: generateRandomInt(99999),
      dst_member: generateRandomInt(99999),
      background_image: random_choice(COVERS),
      message_is_from: random_choice(MESSAGES_FROM_FOR),
      message_is_for: random_choice(MESSAGES_FROM_FOR),
      message_content: random_choice(MESSAGES),
      date_created: random_choice(DATES_CREATED),
      date_activated: random_choice(DATES_ACTIVE),
      planned_date_send: random_choice(DATES_ACTIVE),
      giftcard_recipients: [random_choice(RECIPIENTS)],
      giftcard: generateRandomInt(10) + 1,
      invitation_sent: false,
      active: true,
      name: `${random_choice(NAMES)} #${id}`,
      price_bought: random_choice(PRICES),
      activation_code: 'http://mycodeactivation.fr',
    };
  });
}

export function giftcard_background_image_factory(
  num_el: number,
): Array<GiftcardBackgroundImage> {
  return [...Array(num_el).keys()].map((id) => ({
    id,
    image: random_choice(COVERS),
  }));
}

export function GiftcardTemplateListFactory(
  num_el: number,
  manager_only?: boolean,
): Array<WithFranchiseCompanies<GiftcardTemplateV2>> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  return GIFTCARD_IDS.map((id) => {
    const item: WithFranchiseCompanies<GiftcardTemplateV2> = {
      id: id + 1,
      franchisor: 1,
      cover: random_choice(COVERS),
      name: `${random_choice(NAMES)} #${id}`,
      description: random_choice(DESCRIPTIONS),
      expiration_days: generateRandomInt(100),
      price: random_choice(PRICES),
      available_payment_method_identifiers: [CB.id],
      manager_only: !!manager_only,
      disabled: false,
      amount_gifted: generateRandomInt(100).toString(),
      // @ts-expect-error
      companies: FranchiseCompanyListFactory(Math.floor(Math.random() * 20)),
    };
    return item;
  });
}
