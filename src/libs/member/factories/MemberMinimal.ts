// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

FactoryBot.define('MemberMinimal', {
  id: FactoryBot.sequence(),
  name: () => `${faker.person.firstName()} ${faker.person.lastName()}`,
  email: () => faker.internet.email().toLowerCase(),
  phone: () => faker.phone.number(),
  credit_account_balance: () => `${faker.finance.amount()}`,
  total_unpaid_amount: () => `${faker.finance.amount()}`,
  consumer: () => Math.floor(Math.random() * 100000),
  date_joined: () => faker.date.past().toString(),
});

export default FactoryBot;
