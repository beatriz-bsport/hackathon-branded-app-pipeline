// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('MetaActivity', {
  id: 1,
  name: faker.lorem.word,
  SCT: 1,
  description: faker.lorem.sentence(),
  coach: 1,
  establishment: 1,
  default_price: 10,
  default_credits: 2,
  default_last_booking_minutes: 60,
  default_last_discard_minutes: 60,
  default_duration_minutes: 60,
  customer_enabled: false,
});

export default FactoryBot;
