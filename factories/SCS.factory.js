import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('SCS', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
});
