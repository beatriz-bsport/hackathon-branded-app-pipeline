import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Member', {
  id: FactoryBot.sequence(),
  firstname: faker.name.firstName,
  lastname: faker.name.lastName,
  email: (u) => `${u.firstname}.${u.lastname}@example.com`.toLowerCase(),
  gender: 'M',
  phone: faker.phone.phoneNumber(),
});
