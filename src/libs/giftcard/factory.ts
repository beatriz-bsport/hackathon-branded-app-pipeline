import moment from 'moment';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import {
  ConsumerGiftCard,
  GiftCard,
  GiftCardRecipient,
  GiftcardBackgroundImage,
} from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

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
  moment().add(-2, 'days').format(),
  moment().add(-5, 'days').format(),
  moment().add(-12, 'days').format(),
  moment().add(-17, 'days').format(),
  moment().add(-26, 'days').format(),
];

const DATES_ACTIVE: Array<string> = [
  moment().add(2, 'days').format(),
  moment().add(5, 'days').format(),
  moment().add(12, 'days').format(),
  moment().add(17, 'days').format(),
  moment().add(26, 'days').format(),
];

function random_choice(arr: Array<any>): any {
  return arr[random_int(arr.length)];
}

export function giftcard_recipient_factory(
  num_el: number,
): Array<GiftCardRecipient> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  return GIFTCARD_IDS.map((id) => {
    return {
      date_created: random_choice(DATES_CREATED),
      email_sent_to: random_choice(MESSAGES_FROM_FOR),
      consumer_giftcard: id + 1,
    };
  });
}

export function giftcard_factory(num_el: number): Array<GiftCard> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  return GIFTCARD_IDS.map((id) => {
    return {
      id: id + 1,
      name: `${random_choice(NAMES)} #${id}`,
      description: random_choice(DESCRIPTIONS),
      cover: random_choice(COVERS),
      cover_thumbnail: random_choice(COVERS),
      expiration_days: random_int(100),
      price: random_choice(PRICES),
      available_payment_methods_identifiers: [CB.id],
      manager_only: true,
      disabled: false,
      company: random_int(20) + 1,
      amount_gifted: random_int(100),
    };
  });
}

export function consumer_giftcard_factory(
  num_el: number,
): Array<ConsumerGiftCard> {
  const GIFTCARD_IDS: Array<number> = [...Array(num_el).keys()];
  const RECIPIENTS = giftcard_recipient_factory(num_el);
  return GIFTCARD_IDS.map(() => {
    return {
      id: random_int(1000),
      consumed_amount_gifted: random_int(10),
      src_member: random_int(99999),
      dest_member: random_int(99999),
      message_is_from: random_choice(MESSAGES_FROM_FOR),
      message_is_for: random_choice(MESSAGES_FROM_FOR),
      message_content: random_choice(MESSAGES),
      background_image: random_choice(COVERS),
      date_created: random_choice(DATES_CREATED),
      date_activated: random_choice(DATES_ACTIVE),
      giftcard_recipients: random_choice(RECIPIENTS),
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
