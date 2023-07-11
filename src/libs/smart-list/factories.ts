// @ts-expect-error
import { faker } from '@faker-js/faker';
import { generateRandomInt } from '../../utils/factories';
import { SmartList } from './types';

faker.locale = 'en';

function generateMemberIdsBatch(length?: number): number[] {
  const intTab: number[] = [];
  for (let i = 0; i < Math.max(length, 300); i += 1) {
    intTab.push(i);
  }

  const res: number[] = [];
  for (let i = 0; i < length; i += 1) {
    res.push(intTab[generateRandomInt(intTab.length - 1)]);
  }

  return res;
}

export function smartlistFactory(
  id?: number,
  companyId?: number,
  randomName?: boolean,
  numberOfMembers?: number,
): Partial<SmartList> {
  const smartlistId = id || generateRandomInt(99);

  return {
    id: smartlistId,
    company: companyId || generateRandomInt(300),
    name: randomName ? faker.random.words(2) : `Smartlist n°${smartlistId}`,
    description: faker.hacker.phrase(),
    members: generateMemberIdsBatch(numberOfMembers || 3),
    member_base: 0,
  };
}

export function smartlistBatchFactory(length: number): Partial<SmartList>[] {
  const companyId = generateRandomInt(100);
  const res: Partial<SmartList>[] = [];

  for (let i = 0; i < length; i += 1) {
    res.push(smartlistFactory(i, companyId));
  }

  return res;
}
