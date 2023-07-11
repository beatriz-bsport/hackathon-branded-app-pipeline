// @ts-nocheck

import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('FranchiseTheme', {
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
});

export default FactoryBot;
