// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { private_services_passes_factory } from '#libs/private-service/factory';
import {
  paymentPackFactory,
  paymentPackListFactory,
} from '#libs/payment-packs/factory';

import { PaymentCombo, PaymentComboItem } from '#libs/payment-combo/types';

FactoryBot.define('PaymentComboCategory', {
  id: FactoryBot.sequence(),
  name: () => faker.lorem.word(),
  company_id: 1,
  category_ordering: () => Math.floor(Math.random() * 10),
});

const paymentComboItemListFactory = (
  numberOfElements: number,
): PaymentComboItem[] => {
  const paymentComboItemsIds: number[] = [...Array(numberOfElements).keys()];
  return paymentComboItemsIds.map((id) => {
    return {
      id: id + 1,
      price: Math.floor(Math.random() * 100),
      name: faker.lorem.word(),
      quantity: Math.floor(Math.random() * 10),
      tax: 'VAT',
      data: paymentPackFactory(),
    };
  });
};

export const PaymentComboStorybookFactory = (id?: number) => {
  const paymentCombo: Partial<PaymentCombo> = {
    id: id || Math.floor(Math.random() * 1000),
    name: faker.hacker.phrase(),
    price: Math.floor(Math.random() * 100),
    tax: Math.floor(Math.random() * 100),
    // @ts-expect-error
    payment_packs: paymentPackListFactory(2),
    // @ts-expect-error
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
  name: () => faker.lorem.word(),
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
  barcode: faker.lorem.word(),
  available_payment_method_identifier: [1, 2, 3],
  new_member_only: Math.random() < 0.5,
});

export default FactoryBot;
