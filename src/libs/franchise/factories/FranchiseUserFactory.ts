import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('FranchiseUser', {
  companies: [],
  companiesMember: {},
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  gender: 'M',
  membership_id: faker.random.number(),
  phone: faker.phone.phoneNumber(),
  address: {
    address_line_1: faker.address.streetAddress(),
    address_line_2: faker.address.streetName(),
    city: faker.address.city(),
    zipcode: faker.address.zipCode(),
    country: faker.address.country(),
  },
  birthday: faker.date.past(),
  photo: faker.image.avatar(),
  id: Math.floor(Math.random() * 100000),
  vaccination_status: true,
});

export default FactoryBot;
