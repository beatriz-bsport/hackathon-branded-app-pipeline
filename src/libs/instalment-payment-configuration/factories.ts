import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { MONTHLY } from './constants';

faker.locale = 'fr';

FactoryBot.define('InstalmentPayment', {
  id: FactoryBot.sequence(),
  company: 1,
  name: () => faker.random.word(),
  recurrency: MONTHLY,
  frequency: 12,
  number_of_billing: 3,
  fee: 50,
  minimum_amount: 10,
  is_only_available_when_all_items_are_compatible: false,
  payment_pack_list: [],
  is_available_on_all_payment_pack: false,
  private_pass_list: [],
  is_available_on_all_private_pass: false,
  payment_combo_list: [],
  is_available_on_all_payment_combo: false,
  giftcard_list: [],
  is_available_on_all_giftcard: false,
  shop_item_list: [],
  is_available_on_all_shop_item: false,
});

export default FactoryBot;
