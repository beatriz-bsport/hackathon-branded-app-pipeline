// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { QuicksaleSection } from '../types';
import { QuicksaleSectionColor } from '../constants';
import ItemFactoryBot from './QuicksaleItem';

faker.locale = 'fr';

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
  section_name: () => faker.random.words(3),
  section_icon: () => faker.random.arrayElement(sectionIconChoices),
  section_color: () =>
    faker.random.arrayElement(Object.values(QuicksaleSectionColor)),
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
