import FactoryBot from 'ya-factorybot';
import { faker } from '@faker-js/faker';

faker.locale = 'fr';

FactoryBot.define('Location', {
  id: FactoryBot.sequence(),
  address: faker.address.streetAddress,
  latitude: '41.3',
  longitude: '2.0932″',
});
