import FactoryBot from 'ya-factorybot';
import faker from 'faker';

import SPORTS from '@bsport/common/lib/master-data/sports';

faker.locale = 'fr';

FactoryBot.define('SCT', {
  id: FactoryBot.sequence(),
  name: faker.lorem.word,
  SCS: () => SPORTS[Math.floor(Math.random() * SPORTS.length)],
});
