import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('SCS', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
});
