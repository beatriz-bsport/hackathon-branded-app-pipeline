import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { Contract } from '#libs/subscription/types';

faker.locale = 'fr';

FactoryBot.define('Contract', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
});

export const ContractStorybookFactory = (id?: number) => {
  const contract: Partial<Contract> = {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    recurrent_price: faker.finance.amount(5, 100),
    tax: '0.0000',
    company: Math.floor(Math.random() * 1000),
    manager_only: false,
    auto_renewal: true,
    flat_fee: 0,
    nb_interval: 12,
    disabled: false,
    interval: 'month',
    recurrence_basis: 0,
    contract_terms_pdf_link: null,
  };
  return contract;
};

export const ContractStorybookListFactory = (nb: number) => {
  const contractsIds = [...Array(nb).keys()];
  return contractsIds.map((id) => {
    return ContractStorybookFactory(id + 1);
  });
};

export default FactoryBot;
