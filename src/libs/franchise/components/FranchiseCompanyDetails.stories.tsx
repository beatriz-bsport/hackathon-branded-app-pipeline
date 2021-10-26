import React from 'react';
import FranchiseCompanyDetails, {
  OwnProps,
} from './FranchiseCompanyDetails.components';
import FactoryBot from '../factories/FranchiseCompanyFactory';
import FactoryBotMember from '../../member/factories/MemberMinimal';
import FactoryBotEstablishment from '../../establishment/factories/Establishments';
import faker from 'faker';

const CompleteDefaultState = (args: OwnProps) => (
  <FranchiseCompanyDetails {...args} />
);

export const EmptyState = CompleteDefaultState.bind({});

// @ts-ignore
const company = FactoryBot.FranchiseCompany.createOne();
const members = FactoryBotMember.MemberMinimal.create(5);
const establishment = FactoryBotEstablishment.Establishment.create(10);

EmptyState.args = {
  companyId: null,
  companyName: '',
  members: [],
  memberCounts: 0,
  page: 1,
  establishmentsByLocation: {},
  handleChangePage: () => {},
  goToCompany: () => {},
  goToUser: () => () => {},
};

const CustomTemplateState = (args: OwnProps) => (
  <FranchiseCompanyDetails {...args} />
);

export const CustomTemplate = CustomTemplateState.bind({});

CustomTemplate.args = {
  companyId: company.id,
  companyName: company.name,
  members: members,
  memberCounts: 10,
  page: 1,
  establishmentsByLocation: {
    [faker.address.streetAddress()]: establishment.slice(0, 5),
    [faker.address.streetAddress()]: establishment.slice(5),
  },
  handleChangePage: () => {},
  goToCompany: () => {},
  goToUser: () => () => {},
};

export default {
  title: 'Library/Franchise/Company Details',
  component: FranchiseCompanyDetails,
  parameters: {
    docs: {
      page: null,
    },
  },
};
