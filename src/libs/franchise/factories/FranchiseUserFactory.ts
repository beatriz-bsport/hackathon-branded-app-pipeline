// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';
import { FranchiseUser } from '../types';

FactoryBot.define('FranchiseUser', {
  companies: [],
  companiesMember: {},
  name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  gender: 'M',
  membership_id: faker.number.int(),
  phone: faker.phone.number(),
  address: {
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.street(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    country: faker.location.country(),
  },
  birthday: faker.date.past(),
  photo: faker.image.avatar(),
  id: Math.floor(Math.random() * 100000),
  vaccination_status: true,
});

export const FranchiseUserFactory = (nbUsers: number): Array<FranchiseUser> => {
  const USER_IDS: Array<number> = [...Array(nbUsers).keys()];
  // @ts-expect-error
  return USER_IDS.map((id) => {
    return {
      id: id + 1,
      companies: [],
      companiesMember: {},
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase(),
      gender: 'M',
      membership_id: faker.number.int(),
      phone: faker.phone.number(),
      address: {
        address_line_1: faker.location.streetAddress(),
        address_line_2: faker.location.street(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        state: faker.location.state(),
        country: faker.location.country(),
      },
      birthday: faker.date.past(),
      photo: faker.image.avatar(),
      vaccination_status: true,
    };
  });
};

export default FactoryBot;
