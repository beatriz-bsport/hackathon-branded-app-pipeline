// @ts-nocheck
import faker from 'faker';

import { Level } from './types';

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

const hexa_list = '0123456789ABCDEF';

function randomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    const number_decimal = random_int(16);
    color += hexa_list[number_decimal];
  }
  return color;
}

const default_levels: Partial<Level>[] = [
  {
    id: 1,
    name: 'Tous niveaux',
    color: '#ffffff',
    enabled: true,
    company: null,
  },
  {
    id: 2,
    name: 'Débutants',
    color: '#ffffff',
    enabled: true,
    company: null,
  },
  {
    id: 3,
    name: 'Intermédiaire',
    color: '#ffffff',
    enabled: true,
    company: null,
  },
  {
    id: 4,
    name: 'Confirmé',
    color: '#ffffff',
    enabled: true,
    company: null,
  },
  {
    id: 5,
    name: 'Inter/Avancé',
    color: '#ffffff',
    enabled: true,
    company: null,
  },
];

export function levelFactory(): Partial<Level> {
  return {
    id: random_int(1000),
    company: random_int(999),
    name: faker.random.words(2),
    color: randomColor(),
    enabled: true,
  };
}

export function levelListFactory(count: number): Partial<Level>[] {
  if (count > 5) {
    const levels = new Array(count - default_levels.length)
      .fill(0)
      .map(() => levelFactory());
    return [...levels, ...default_levels];
  }
  const levels = new Array(count).fill(0).map(() => levelFactory());
  return levels;
}
