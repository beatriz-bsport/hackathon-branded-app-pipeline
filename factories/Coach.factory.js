import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('Coach', {
  id: FactoryBot.sequence(),
  name: () => faker.name.findName(),
  photo: () => faker.image.avatar(),
});
