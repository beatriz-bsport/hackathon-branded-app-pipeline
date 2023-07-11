import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';
import SPORTS from '@bsport/common/lib/master-data/sports';

FactoryBot.define('SCT', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
  SCS: () => SPORTS[Math.floor(Math.random() * SPORTS.length)],
});
