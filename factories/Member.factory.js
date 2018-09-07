import FactoryBot from 'factory-bot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Member', {
  firstname: faker.name.firstName,
  lastname: faker.name.lastName,
  email: (u) => `${u.firstname}.${u.lastname}@example.com`.toLowerCase(),
  gender: 'M',
  phone: faker.phone.phoneNumber(),
});
