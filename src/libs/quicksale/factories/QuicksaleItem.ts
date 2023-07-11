// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import { faker } from '@faker-js/faker';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import { QuicksaleItemColor } from '../constants';

faker.locale = 'fr';

FactoryBot.define('QuicksaleItem', {
  object_id: () => faker.random.number(10000),
  buyable_item_identifier: () =>
    faker.random.arrayElement(Object.values(QuicksaleBasketItem)),
  color: faker.random.arrayElement(Object.values(QuicksaleItemColor)),
});

export default FactoryBot;
