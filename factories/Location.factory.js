import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('Location', {
  id: FactoryBot.sequence(),
  address: faker.location.street(),
  latitude: '41.3',
  longitude: '2.0932″',
});
