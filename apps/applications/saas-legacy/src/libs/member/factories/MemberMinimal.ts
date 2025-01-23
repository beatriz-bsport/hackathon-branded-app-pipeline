// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { tagListFactory } from '#src/libs/tag/factory';

FactoryBot.define('MemberMinimal', {
  accept_email: faker.datatype.boolean(),
  archived: faker.datatype.boolean(),
  birthday: faker.date.birthdate(),
  consumer: () => Math.floor(Math.random() * 100000),
  credit_account_balance: () => `${faker.finance.amount()}`,
  date_joined: () => faker.date.past().toString(),
  email: () => faker.internet.email().toLowerCase(),
  first_name: faker.person.firstName(),
  id: FactoryBot.sequence(),
  last_name: faker.person.lastName(),
  name: faker.person.fullName(),
  phone: () => faker.phone.number(),
  photo: () => faker.image.avatar(),
  tags: tagListFactory(faker.number.int({ min: 1, max: 5 })),
  total_unpaid_amount: () => `${faker.finance.amount()}`,
});

export default FactoryBot;
