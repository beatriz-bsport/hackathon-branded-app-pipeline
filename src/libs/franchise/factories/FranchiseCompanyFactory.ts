import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('FranchiseCompany', {
  id: Math.floor(Math.random() * 10000),
  name: faker.company.companyName(),
  email: faker.internet.email().toLowerCase(),
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  websiteURL: `${faker.company.companyName()}.com`,
});

export default FactoryBot;
