import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

const random_hex_color_code = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return `#${n.slice(0, 6)}`;
};

const iconNameList = ['AcUnit', 'AccessAlarm', 'Accessible', 'AddBox'];

FactoryBot.define('Tag', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  group: () => ({
    id: Math.floor(Math.random() * 1000),
    name: faker.random.word(),
    kind: Math.floor(Math.random() * 1000),
  }),
  color: () => random_hex_color_code(),
  icon: () => iconNameList[Math.floor(Math.random() * iconNameList.length)],
});

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
  User: ['firstname', 'lastname', 'unsubscribe_link'],
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
};

export default FactoryBot;
