// @ts-expect-errors
import FactoryBot from 'ya-factorybot';

import { fakerFR as faker } from '@faker-js/faker';

const getRandomInt = () => Math.floor(Math.random() * 244);

FactoryBot.define('Franchise', {
  id: Math.floor(Math.random() * 1000),
  name: faker.company.name(),
  companies: [],
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
});

export default FactoryBot;
