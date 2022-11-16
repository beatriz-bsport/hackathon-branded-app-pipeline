import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { EmailTemplateSummary } from '../types';

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

export const companyEmailListFactory = (
  company_id: number,
  batch_size: number,
): EmailTemplateSummary[] => {
  const EMAIL_IDS: Array<number> = [...Array(batch_size).keys()];

  const jaja = EMAIL_IDS.map((_id: number) => ({
    id: _id,
    date_created: faker.date.past().toString(),
    date_modified: faker.date.past().toString(),
    subject: faker.lorem.words(8),
    title: faker.lorem.words(5),
    company_id,
    ordering_in_category: Math.floor(Math.random() * 1000),
    available: true,
    category: null,
    is_default_bsport_template: false,
  }));
  return jaja;
};
export default FactoryBot;
