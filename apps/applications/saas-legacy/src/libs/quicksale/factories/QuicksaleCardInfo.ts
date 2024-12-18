// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { QuicksaleCardInfo } from '../types';
import { QuicksaleItemColor } from '../constants';

FactoryBot.define('QuicksaleCardInfo', {
  id: () => faker.string.uuid(),
  title: () => faker.lorem.words(3),
  subtitle: () => faker.lorem.words(2),
  price: () => faker.number.int(100),
  color: () => faker.helpers.arrayElement(Object.values(QuicksaleItemColor)),
  recurrence: () => (faker.number.int(10) > 5 ? 'tous les jours' : ''),
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
