import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Location', {
  id: FactoryBot.sequence(),
  address: faker.address.streetAddress,
});
