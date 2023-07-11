// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import { fakerFR as faker } from '@faker-js/faker';

const getRandomInt = () => Math.floor(Math.random() * 244);

// @ts-ignore
FactoryBot.define('Establishment', {
  id: FactoryBot.sequence(),
  title: () => faker.location.city(),
  companies: () => [],
  cover: () => faker.image.avatar(),
  primaryRGB: () => [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: () => [getRandomInt(), getRandomInt(), getRandomInt()],
  disabled: () => false,
  tzname: () => '',
  associatedestablishment_set: () => [],
  specific_info: () => '',
  location: () => ({
    address: faker.location.streetAddress(),
    latitude: faker.location.longitude(),
    longitude: faker.location.latitude(),
  }),
  easy_access: () => ({
    id: Math.floor(Math.random() * 1000),
    lines: [`${Math.floor(Math.random() * 14)}`],
    name: faker.location.streetAddress(),
  }),
});

export default FactoryBot;
