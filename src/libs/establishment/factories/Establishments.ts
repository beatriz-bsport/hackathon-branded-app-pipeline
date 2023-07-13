// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { Company } from '#libs/company/types';

const getRandomInt = () => Math.floor(Math.random() * 244);

FactoryBot.define('Establishment', {
  id: FactoryBot.sequence(),
  title: () => faker.location.city(),
  companies: () => [] as Company[],
  cover: () => faker.image.avatar(),
  primaryRGB: () => [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: () => [getRandomInt(), getRandomInt(), getRandomInt()],
  disabled: () => false,
  tzname: () => '',
  associatedestablishment_set: () => [] as number[],
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
