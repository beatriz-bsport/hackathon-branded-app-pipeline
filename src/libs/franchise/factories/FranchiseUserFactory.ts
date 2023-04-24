// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { FranchiseUser } from '../types';

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
    state: faker.address.state(),
    country: faker.address.country(),
  },
  birthday: faker.date.past(),
  photo: faker.image.avatar(),
  id: Math.floor(Math.random() * 100000),
  vaccination_status: true,
});

export const FranchiseUserFactory = (nbUsers: number): Array<FranchiseUser> => {
  const USER_IDS: Array<number> = [...Array(nbUsers).keys()];
  return USER_IDS.map((id) => {
    return {
      id: id + 1,
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
        state: faker.address.state(),
        country: faker.address.country(),
      },
      birthday: faker.date.past(),
      photo: faker.image.avatar(),
      vaccination_status: true,
    };
  });
};

export default FactoryBot;
