import FactoryBot from 'ya-factorybot';
import faker from 'faker';

import { private_services_passes_factory } from '#libs/private-service/factory';
import FactoryBotPaymentPack, {
  PaymentPackStorybookListFactory,
} from '#libs/payment-packs/factory';

import { PaymentCombo, PaymentComboItem } from '#libs/payment-combo/types';

faker.locale = 'fr';

FactoryBot.define('PaymentComboCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

faker.locale = 'fr';

const paymentComboItemListFactory = (
  numberOfElements: number,
): PaymentComboItem[] => {
  const paymentComboItemsIds: number[] = [...Array(numberOfElements).keys()];
  return paymentComboItemsIds.map((id) => {
    return {
      id: id + 1,
      price: Math.floor(Math.random() * 100),
      name: faker.random.word(),
      quantity: Math.floor(Math.random() * 10),
      tax: 'VAT',
      data: FactoryBotPaymentPack.PaymentPack.create(),
    };
  });
};

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
FactoryBot.define('PaymentCombo', {
  id: FactoryBot.sequence(),
  name: () => faker.random.word(),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed nisi at sapien fringilla lobortis. Quisque rhoncus accumsan vulputate. Praesent ultricies neque lacus. Duis non iaculis ex. Nullam in ante id turpis lobortis ullamcorper vel eu sapien. Nullam varius urna at dapibus aliquam. Donec elit ex, scelerisque non pretium non, iaculis et justo.',
  price: Math.floor(Math.random() * 100),
  use_payment_combo_tax_on_items: Math.random() < 0.5,
  tax: Math.floor(Math.random() * 40),
  tax_calculation: Math.floor(Math.random() * 40),
  available: Math.random() < 0.5,
  manager_only: Math.random() < 0.5,
  date_created: faker.date.recent(),
  payment_packs: paymentComboItemListFactory(Math.floor(Math.random() * 3)),
  shop_items: paymentComboItemListFactory(Math.floor(Math.random() * 3)),
  private_passes: paymentComboItemListFactory(Math.floor(Math.random() * 3)),
  max_purchase_per_member: Math.floor(Math.random() * 5),
  barcode: faker.random.word(),
  available_payment_method_identifier: [1, 2, 3],
  new_member_only: Math.random() < 0.5,
});

export default FactoryBot;
