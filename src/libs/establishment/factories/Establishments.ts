import FactoryBot from 'ya-factorybot';
import faker from 'faker';

faker.locale = 'fr';
const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('Establishment', {
  id: Math.floor(Math.random() * 1000),
  title: faker.name.findName(),
  companies: [],
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  disabled: false,
  tzname: '',
  associatedestablishment_set: [],
  specific_info: '',
  location: {
    address: faker.address.streetAddress(),
    latitude: faker.address.longitude(),
    longitude: faker.address.latitude(),
  },
  easy_access: {
    id: Math.floor(Math.random() * 1000),
    lines: [`${Math.floor(Math.random() * 14)}`],
    name: faker.address.streetAddress(),
  },
});

export default FactoryBot;
