// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import { faker } from '@faker-js/faker';
import { QuicksaleCardInfo } from '../types';
import { QuicksaleItemColor } from '../constants';

faker.locale = 'fr';

FactoryBot.define('QuicksaleCardInfo', {
  id: () => faker.random.uuid(),
  title: () => faker.random.words(3),
  subtitle: () => faker.random.words(2),
  price: () => faker.random.number(100),
  color: () => faker.random.arrayElement(Object.values(QuicksaleItemColor)),
  recurrence: () => (faker.random.number(10) > 5 ? 'tous les jours' : ''),
});

const createQuicksaleCardInfo = (
  amount?: number,
  customTitle?: string,
): QuicksaleCardInfo | Array<QuicksaleCardInfo> => {
  const cardInfoList = FactoryBot.QuicksaleCardInfo.create(amount ?? 1);
  if (amount && amount > 1)
    return cardInfoList.map((cardInfo: QuicksaleCardInfo) => ({
      ...cardInfo,
      ...(customTitle ? { title: customTitle } : {}),
    }));

  return {
    ...cardInfoList,
    ...(customTitle ? { title: customTitle } : {}),
  };
};

export default createQuicksaleCardInfo;
