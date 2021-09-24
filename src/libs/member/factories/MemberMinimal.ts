import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('MemberMinimal', {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email().toLowerCase(),
  phone: faker.phone.phoneNumber(),
  id: Math.floor(Math.random() * 100000),
  credit_account_balance: `${faker.finance.amount()}`,
  consumer: Math.floor(Math.random() * 100000),
  date_joined: faker.date.past().toString(),
});

export default FactoryBot;
