import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('Coach', {
  id: FactoryBot.sequence(),
  name: () => faker.person.findName(),
  photo: () => faker.image.avatar(),
});
