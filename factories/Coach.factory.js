import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Coach', {
  id: FactoryBot.sequence(),
  name: () => faker.name.findName(),
  photo: () => faker.image.avatar(),
});
