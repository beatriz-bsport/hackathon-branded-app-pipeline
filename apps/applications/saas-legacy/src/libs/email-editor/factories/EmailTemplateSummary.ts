// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { EmailTemplateSummary } from '../types';

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

  return EMAIL_IDS.map((_id: number) => ({
    id: _id,
    date_created: faker.date.past().toString(),
    date_modified: faker.date.past().toString(),
    subject: faker.lorem.words(8),
    title: faker.lorem.words(5),
    company_id,
    ordering_in_category: Math.floor(Math.random() * 1000),
    available: true,
    category: null as number,
    is_default_bsport_template: false,
    available_for_companies: [] as number[],
  }));
};
export default FactoryBot;
