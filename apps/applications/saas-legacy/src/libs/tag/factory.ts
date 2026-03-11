// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import type { Tag, TagGroup } from './types';

const random_hex_color_code = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return `#${n.slice(0, 6)}`;
};

const iconNameList = ['AcUnit', 'AccessAlarm', 'Accessible', 'AddBox'];

FactoryBot.define('Tag', {
  id: FactoryBot.sequence(),
  name: () => faker.lorem.word(2),
  group: () => ({
    id: faker.number.int(1000),
    name: faker.lorem.word(),
    kind: faker.number.int(400),
  }),
  color: () => random_hex_color_code(),
  icon: () => iconNameList[Math.floor(Math.random() * iconNameList.length)],
});

export const tagWithoutGroupFactory = (): Tag => {
  return {
    id: faker.number.int(1000),
    name: faker.lorem.words(2),
    group: faker.number.int(1000),
    color: faker.internet.color(),
    icon: '',
  };
};

export const tagWithoutGroupListFactory = (num_el: number): Tag[] => {
  const tagItemsList = new Array(num_el).fill(0);
  return tagItemsList.map(() => tagWithoutGroupFactory());
};

export const tagFactory = (): Partial<Tag<TagGroup>> => {
  return {
    id: faker.number.int(1000),
    name: faker.lorem.words(2),
    group: {
      id: faker.number.int(1000),
      name: faker.lorem.word(),
      kind: faker.number.int(400),
      tags: [],
    },
    color: faker.internet.color(),
    icon: '',
  };
};

export const tagListFactory = (num_el: number): Partial<Tag<TagGroup>>[] => {
  const tagItemsList = new Array(num_el).fill(0);
  return tagItemsList.map(() => tagFactory());
};

export const tagListWithGroupFactory = (
  num_el: number,
): Partial<Tag<TagGroup>>[] => {
  const tagItemsList = new Array(num_el).fill(0);
  return tagItemsList.map(() => tagFactory());
};

export const tagCategories = {
  Offer: [
    'activity',
    'coach',
    'date',
    'establishment',
    'establishment_practical_info',
    'address',
  ],
  BillingPlan: [
    'subscription_name',
    'subscription_recurrent_price',
    'subscription_nb_months',
    'subscription_flat_fee',
    'subscription_payment_method',
    'subscription_nb_days_pause',
    'subscription_next_invoice_date',
  ],
  User: [
    'firstname',
    'lastname',
    'unsubscribe_link',
    'reset_password_url',
    'email_confirmation_url',
    'marketing_email_double_opt_in_url',
  ],
  Booking: [
    'activity',
    'coach',
    'date',
    'establishment',
    'establishment_practical_info',
    'address',
    'ics_calendar_link',
    'spot',
    'canceled_grouped_session',
  ],
  PrivateConsumerPass: [
    'pass_price',
    'pass_name',
    'pass_starting_date',
    'pass_expiration',
    'pass_credit_left',
  ],
  PrivateBooking: [
    'activity',
    'coach',
    'date',
    'address',
    'establishment',
    'establishment_practical_info',
    'ics_calendar_link',
  ],
  ConsumerPaymentPack: [
    'pass_price',
    'pass_name',
    'pass_starting_date',
    'pass_expiration',
    'pass_credit_left',
  ],
  BookingOption: [
    'activity',
    'coach',
    'date',
    'establishment',
    'establishment_practical_info',
    'address',
    'option_payment_url',
    'option_expiration_date',
  ],
  Company: [
    'android_app_URL',
    'ios_app_URL',
    'company_logo',
    'company',
    'login_url',
    'company_scheduleURL',
    'company_facebookURL',
    'company_instagramURL',
    'company_websiteURL',
    'company_info',
  ],
  RecurrentRule: [
    'activity',
    'coach',
    'date',
    'establishment_practical_info',
    'establishment',
    'address',
    'recurring_booking_fail_reason',
  ],
  Invoice: [
    'id',
    'invoice_price',
    'invoice_sum_up',
    'invoice_date',
    'invoice_download_link',
  ],
  Giftcard: [
    'activate_giftcard_url',
    'message_is_from',
    'message_is_for',
    'giftcard_message',
    'giftcard_value',
    'giftcard_name',
  ],
  EmailChange: [
    'new_email',
    'old_email',
    'manage_changing_email_link',
    'login_link',
  ],
};

export default FactoryBot;
