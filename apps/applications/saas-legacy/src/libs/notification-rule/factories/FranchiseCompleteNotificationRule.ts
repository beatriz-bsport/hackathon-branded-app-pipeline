// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('FranchiseCompleteNotificationRule', {
  id: Math.floor(Math.random() * 1000),
  title: faker.lorem.words(5),
  email_design: Math.floor(Math.random() * 1000),
  disabled: false,
  send_company: false,
  companies: [],
});

export default FactoryBot;
