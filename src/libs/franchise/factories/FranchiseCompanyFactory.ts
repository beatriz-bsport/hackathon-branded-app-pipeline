// @ts-nocheck
import FactoryBot from 'ya-factorybot';
import faker from 'faker';
import { FranchiseCompany } from '../types';

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

export const FranchiseCompanyListFactory = (
  nbCompanies: number,
): Array<FranchiseCompany> => {
  const COMPANY_IDS: Array<number> = [...Array(nbCompanies).keys()];
  return COMPANY_IDS.map((id) => {
    return {
      id: id + 1,
      name: faker.company.companyName(),
      email: faker.internet.email().toLowerCase(),
      cover: faker.image.avatar(),
      primaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
      secondaryRGB: [getRandomInt(), getRandomInt(), getRandomInt()],
      websiteURL: `${faker.company.companyName()}.com`,
      isAllowed: Math.random() < 0.5,
      company_group: getRandomInt(),
    };
  });
};

export default FactoryBot;
