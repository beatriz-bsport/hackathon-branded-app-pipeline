import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('SCS', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
});
