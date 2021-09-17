import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';
const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('Franchise', {
  id: Math.floor(Math.random() * 1000),
  name: faker.name.findName(),
  companies: [],
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
});

export default FactoryBot;
