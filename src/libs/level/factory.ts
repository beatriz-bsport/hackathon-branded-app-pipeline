import { faker } from '@faker-js/faker';
import { Level } from './types';

export const levelFactory = (id: number = 42): Level => ({
  id,
  name: faker.lorem.word(),
  color: faker.internet.color(),
  company: -1,
  enabled: true,
});

export const levelsListWithDefault: Partial<Level>[] | Level[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  levelFactory(6),
  levelFactory(7),
];
