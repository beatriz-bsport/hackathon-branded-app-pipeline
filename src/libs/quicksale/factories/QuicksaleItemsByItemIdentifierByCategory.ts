// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import createQuicksaleCardInfo from './QuicksaleCardInfo';

FactoryBot.define('QuicksaleItemsByItemIdentifierByCategory', {
  [QuicksaleBasketItem.PaymentPackIdentifier]: () => ({
    hasCategories: true,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie carte de cours ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
  [QuicksaleBasketItem.PrivatePassIdentifier]: () => ({
    hasCategories: true,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie cartes de rdv ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
  [QuicksaleBasketItem.ShopItemIdentifier]: () => ({
    hasCategories: true,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie produits ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
  [QuicksaleBasketItem.PaymentComboIdentifier]: () => ({
    hasCategories: false,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie packs ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
  [QuicksaleBasketItem.SubscriptionIdentifier]: () => ({
    hasCategories: false,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie contrats ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
  [QuicksaleBasketItem.GiftcardIdentifier]: () => ({
    hasCategories: false,
    itemsByCategory: [
      ...Array(faker.helpers.multiple(faker.number.int)).keys(),
    ].map((index) => ({
      id: FactoryBot.sequence(),
      name: `Catégorie cartes cadeau ${index}`,
      items: createQuicksaleCardInfo(5),
    })),
  }),
});

export default FactoryBot;
