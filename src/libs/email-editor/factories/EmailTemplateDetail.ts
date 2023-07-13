// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

FactoryBot.define('EmailTemplateDetail', {
  id: Math.floor(Math.random() * 1000),
  name: faker.lorem.words(5),
  company_id: undefined,
  design: {},
  html: `<div> ${faker.lorem.paragraph()} </div>`,
});

export default FactoryBot;
