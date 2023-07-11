// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

// @ts-ignore
FactoryBot.define('MemberMinimal', {
  id: FactoryBot.sequence(),
  name: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: () => faker.internet.email().toLowerCase(),
  phone: () => faker.phone.phoneNumber(),
  credit_account_balance: () => `${faker.finance.amount()}`,
  total_unpaid_amount: () => `${faker.finance.amount()}`,
  consumer: () => Math.floor(Math.random() * 100000),
  date_joined: () => faker.date.past().toString(),
});

export default FactoryBot;
