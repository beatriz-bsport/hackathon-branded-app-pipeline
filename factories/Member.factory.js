import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('Member', {
  id: FactoryBot.sequence(),
  firstname: faker.person.firstName,
  lastname: faker.person.lastName,
  email: (u) => `${u.firstname}.${u.lastname}@example.com`.toLowerCase(),
  gender: 'M',
  phone: faker.phone.phoneNumber(),
});
