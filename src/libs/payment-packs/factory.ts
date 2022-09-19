import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { FranchiseCompanyListFactory } from '#libs/franchise/factories/FranchiseCompanyFactory';

faker.locale = 'fr';

FactoryBot.define('PaymentPackCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

FactoryBot.define('PaymentPack', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
});

const PaymentPackTemplateFactory = (id: number, manager_only?: boolean) => {
  return {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    price: Math.floor(Math.random() * 100).toString(),
    credits: Math.floor(Math.random() * 30),
    unlimited: Math.random() < 0.5,
    companies: FranchiseCompanyListFactory(Math.floor(Math.random() * 10)),
    manager_only,
  };
};

export const PaymentPackTemplateListFactory = (
  nb: number,
  manager_only?: boolean,
) => {
  const PPids = [...Array(nb).keys()];
  return PPids.map((id) => {
    return PaymentPackTemplateFactory(id + 1, !!manager_only);
  });
};

export default FactoryBot;
