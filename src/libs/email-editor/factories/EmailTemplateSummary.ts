import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('EmailTemplateSummary', {
  id: Math.floor(Math.random() * 1000),
  date_created: faker.date.past().toString(),
  date_modified: faker.date.past().toString(),
  subject: faker.lorem.words(8),
  title: faker.lorem.words(5),
  company_id: undefined,
  ordering_in_category: Math.floor(Math.random() * 1000),
});

export default FactoryBot;
