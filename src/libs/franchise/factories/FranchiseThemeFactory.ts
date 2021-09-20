import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';
const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('FranchiseTheme', {
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
});

export default FactoryBot;
