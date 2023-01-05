import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { private_services_passes_factory } from '#libs/private-service/factory';
import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';
import { PaymentCombo } from '#libs/payment-combo/types';

faker.locale = 'fr';

FactoryBot.define('PaymentComboCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

FactoryBot.define('PaymentCombo', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
});

export const PaymentComboStorybookFactory = (id?: number) => {
  const paymentCombo: Partial<PaymentCombo> = {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    price: Math.floor(Math.random() * 100),
    tax: Math.floor(Math.random() * 100),
    payment_packs: PaymentPackStorybookListFactory(2),
    private_passes: private_services_passes_factory(2),
    shop_items: [],
  };
  return paymentCombo;
};

export const PaymentComboStorybookListFactory = (nb: number) => {
  const paymentPackIds = [...Array(nb).keys()];
  return paymentPackIds.map((id) => {
    return PaymentComboStorybookFactory(id + 1);
  });
};

export default FactoryBot;
