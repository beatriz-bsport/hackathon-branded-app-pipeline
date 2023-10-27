import { fakerEN as faker } from '@faker-js/faker';
import type { SmartList } from './types';

function generateMemberIdsBatch(length?: number): number[] {
  const intTab: number[] = [];
  for (let i = 0; i < Math.max(length, 300); i += 1) {
    intTab.push(i);
  }

  const res: number[] = [];
  for (let i = 0; i < length; i += 1) {
    res.push(faker.helpers.arrayElement(intTab));
  }

  return res;
}

export function smartlistFactory(
  id?: number,
  companyId?: number,
  randomName?: boolean,
  numberOfMembers?: number,
): Partial<SmartList> {
  const smartlistId = id || faker.number.int(99);

  return {
    id: smartlistId,
    company: companyId || faker.number.int(300),
    name: randomName ? faker.lorem.words(2) : `Smartlist n°${smartlistId}`,
    description: faker.hacker.phrase(),
    members: generateMemberIdsBatch(numberOfMembers || 3),
    member_base: 0,
  };
}

export function smartlistBatchFactory(length: number): Partial<SmartList>[] {
  const companyId = faker.number.int(100);
  const res: Partial<SmartList>[] = [];

  for (let i = 0; i < length; i += 1) {
    res.push(smartlistFactory(i, companyId));
  }

  return res;
}
