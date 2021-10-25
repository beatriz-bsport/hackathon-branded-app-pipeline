import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('EmailTemplateDetail', {
  id: Math.floor(Math.random() * 1000),
  name: faker.lorem.words(5),
  company_id: undefined,
  design: {},
  html: '<div> i am html </div>',
});

export default FactoryBot;
