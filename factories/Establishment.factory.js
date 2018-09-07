import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Establishment', {
  id: FactoryBot.sequence(),
  name: faker.company.companyName,
});
