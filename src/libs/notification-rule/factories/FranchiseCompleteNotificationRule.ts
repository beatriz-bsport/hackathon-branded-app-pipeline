import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('FranchiseCompleteNotificationRule', {
  id: Math.floor(Math.random() * 1000),
  title: faker.lorem.words(5),
  email_design: Math.floor(Math.random() * 1000),
  disabled: false,
  send_company: false,
  companies: [],
});

export default FactoryBot;
