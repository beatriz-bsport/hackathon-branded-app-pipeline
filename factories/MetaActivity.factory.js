import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('MetaActivity', {
  name: 'Aquaponey',
  SCT: 1,
  description: 'Awesome sport',
  coach: 1,
  establishment: 1,
  default_price: 10,
  default_credits: 2,
  default_last_booking_minutes: 60,
  default_last_discard_minutes: 60,
  default_duration_minutes: 60,
  customer_enabled: false,
});
