import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('Member', {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  gender: 'M',
  membership_id: faker.random.number(),
  phone: { phone_number: faker.phone.phoneNumber() },
  address: {
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.streetName(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    country: faker.location.country(),
  },
  birthday: faker.date.past(),
  date_joined: faker.date.recent(),
});

export default FactoryBot;
