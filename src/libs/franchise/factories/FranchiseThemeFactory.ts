import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';

// @ts-ignore
FactoryBot.define('FranchiseTheme', {
  cover: faker.image.avatar(),
  primaryRGB: faker.internet.color(),
  secondaryRGB: faker.internet.color(),
});

export default FactoryBot;
