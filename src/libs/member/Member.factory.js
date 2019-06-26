import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

FactoryBot.define('Member', {
  first_name: faker.name.firstName,
  last_name: faker.name.lastName,
  email: faker.internet.email().toLowerCase(),
  gender: 'M',
  membership_id: faker.random.number(),
  phone: { phone_number: faker.phone.phoneNumber() },
  address: {
    address_line_1: faker.address.streetAddress(),
    address_line_2: faker.address.streetName(),
    city: faker.address.city(),
    zipcode: faker.address.zipCode(),
    country: faker.address.country(),
  },
  birthday: faker.date.past(),
  date_joined: faker.date.recent(),
});

export default FactoryBot;
