// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';

const getRandomInt = () => Math.floor(Math.random() * 244);

FactoryBot.define('FranchiseTheme', {
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
});

export default FactoryBot;
