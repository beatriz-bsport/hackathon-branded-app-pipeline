// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import FactoryBotPaymentPack from '#libs/payment-packs/factory';
import { Contract } from '#libs/subscription/types';

const intervals = ['month', 'week', 'day', 'year'];

const fakePaymentPack = FactoryBotPaymentPack.PaymentPack.create();

FactoryBot.define('Contract', {
  id: FactoryBot.sequence(),
  name: () => faker.lorem.word(),
  flat_fee: Math.floor(Math.random() * 20),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  planned_invoices: Array.from({ length: Math.floor(Math.random() * 12) }, () =>
    Math.floor(Math.random() * 12),
  ),
  recurrent_price: Math.floor(Math.random() * 100),
  interval: intervals[Math.floor(Math.random() * intervals.length)],
  auto_renewal: Math.random() < 0.5,
  nb_interval: Math.floor(Math.random() * 10),
  contract:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  payment_pack: fakePaymentPack,
});

export const ContractStorybookFactory = (id?: number) => {
  const contract: Partial<Contract> = {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    recurrent_price: parseFloat(faker.finance.amount(5, 100)),
    tax: '0.0000',
    company: Math.floor(Math.random() * 1000),
    manager_only: false,
    auto_renewal: true,
    flat_fee: '0',
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

FactoryBot.define('Subscription', {
  id: FactoryBot.sequence(),
  name: () => faker.lorem.word(),
  flat_fee: Math.floor(Math.random() * 20),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  planned_invoices: Array.from({ length: Math.floor(Math.random() * 12) }, () =>
    Math.floor(Math.random() * 12),
  ),
  recurrent_price: Math.floor(Math.random() * 100),
  interval: intervals[Math.floor(Math.random() * intervals.length)],
  auto_renewal: Math.random() < 0.5,
  nb_interval: Math.floor(Math.random() * 10),
  legal_contract:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

export default FactoryBot;
