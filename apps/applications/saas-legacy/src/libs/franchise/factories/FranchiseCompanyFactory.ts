// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import { FranchiseCompany } from '../types';

const getRandomInt = () => Math.floor(Math.random() * 244);

FactoryBot.define('FranchiseCompany', {
  id: Math.floor(Math.random() * 10000),
  name: faker.company.name(),
  email: faker.internet.email().toLowerCase(),
  cover: faker.image.avatar(),
  primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
  websiteURL: faker.internet.domainName(),
});

export const FranchiseCompanyListFactory = (
  nbCompanies: number,
): Array<FranchiseCompany> => {
  const COMPANY_IDS: Array<number> = [...Array(nbCompanies).keys()];
  return COMPANY_IDS.map((id) => {
    return {
      id: id + 1,
      name: faker.company.name(),
      email: faker.internet.email().toLowerCase(),
      cover: faker.image.avatar(),
      primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
      secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
      websiteURL: faker.internet.domainName(),
      isAllowed: Math.random() < 0.5,
      company_group: getRandomInt(),
    };
  });
};

export default FactoryBot;
