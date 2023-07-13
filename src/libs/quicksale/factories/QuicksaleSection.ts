// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { QuicksaleSection } from '../types';
import { QuicksaleSectionColor } from '../constants';
import ItemFactoryBot from './QuicksaleItem';

const sectionIconChoices = [
  'VpnKey',
  'AccessTime',
  'ShoppingCart',
  'GroupWork',
  'CreditCard',
  'CardGiftcard',
];

FactoryBot.define('QuicksaleSection', {
  section_id: FactoryBot.sequence(),
  section_name: () => faker.lorem.words(3),
  section_icon: () => faker.helpers.arrayElement(sectionIconChoices),
  section_color: () =>
    faker.helpers.arrayElement(Object.values(QuicksaleSectionColor)),
  items: ItemFactoryBot.QuicksaleItem.create(
    2 + Math.floor(Math.random() * 10),
  ),
  disabled: false,
});

const createQuicksaleSection = (
  amount?: number,
  customName?: string,
): QuicksaleSection | Array<QuicksaleSection> => {
  const sectionList = FactoryBot.QuicksaleSection.create(amount ?? 1);
  if (amount && amount > 1)
    return sectionList.map((section: QuicksaleSection) => ({
      ...section,
      ...(customName ? { section_name: customName } : {}),
    }));

  return {
    ...sectionList,
    ...(customName ? { section_name: customName } : {}),
  };
};

export default createQuicksaleSection;
