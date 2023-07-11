import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('Location', {
  id: FactoryBot.sequence(),
  address: faker.address.streetAddress,
  latitude: '41.3',
  longitude: '2.0932″',
});
