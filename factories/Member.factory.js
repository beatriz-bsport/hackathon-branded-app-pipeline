import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('Member', {
  id: FactoryBot.sequence(),
  firstname: faker.name.firstName,
  lastname: faker.name.lastName,
  email: (u) => `${u.firstname}.${u.lastname}@example.com`.toLowerCase(),
  gender: 'M',
  phone: faker.phone.phoneNumber(),
});
