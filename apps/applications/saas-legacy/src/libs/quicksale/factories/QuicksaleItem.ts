// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import { QuicksaleItemColor } from '../constants';

FactoryBot.define('QuicksaleItem', {
  object_id: () => faker.number.int(10000),
  buyable_item_identifier: () =>
    faker.helpers.arrayElement(Object.values(QuicksaleBasketItem)),
  color: faker.helpers.arrayElement(Object.values(QuicksaleItemColor)),
});

export default FactoryBot;
