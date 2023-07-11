import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('Establishment', {
  id: FactoryBot.sequence(),
  title: faker.company.companyName,
  specific_info: () => faker.lorem.words(5),
  location: FactoryBot.hasOne('Location'),
});
