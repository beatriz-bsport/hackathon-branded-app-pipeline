import React from 'react';
import FranchiseCompanySearchList from './FranchiseCompanySearchList.components';
import { FranchiseCompanyListFactory } from '#libs/franchise/factories/FranchiseCompanyFactory';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

const Template: ComponentStory<typeof FranchiseCompanySearchList> = (
  args: React.ComponentProps<typeof FranchiseCompanySearchList>,
) => <FranchiseCompanySearchList {...args} />;

const companies = FranchiseCompanyListFactory(5);

export const CompleteDefaultState = Template.bind({});
CompleteDefaultState.args = {
  companies,
  selectedCompanyId: undefined,
  handleCompanySelected: () => {},
};

export default {
  title: 'Library/Franchise/CompanySearchList',
  component: FranchiseCompanySearchList,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
    description: {
      component: 'This component is a company selector with a search bar.',
    },
  },
  argTypes: {
    asManager: {
      description: 'Indicates whether the user is a manager or not.',
      control: 'boolean',
      defaultValue: false,
    },
    companies: {
      description: 'An array of FranchiseCompany objects.',
      control: 'array',
      defaultValue: [],
    },
    companyGroupList: {
      description: 'An array of CompanyGroup objects.',
      control: 'array',
      defaultValue: [],
    },
    isRedirectLoading: {
      description: 'Indicates whether a redirect action is in progress.',
      control: 'boolean',
      defaultValue: false,
    },
    restrictedFranchisees: {
      description: 'Indicates whether franchisees are restricted.',
      control: 'boolean',
      defaultValue: false,
    },
    selectedCompanyId: {
      description: 'The ID of the selected company.',
      control: 'number',
    },
    createOrUpdateCompanyGroup: {
      description: 'A function to create or update a CompanyGroup.',
      action: 'createOrUpdateCompanyGroup',
    },
    handleCompanySelected: {
      description: 'A function to handle when a company is selected.',
      action: 'handleCompanySelected',
    },
  },
} as ComponentMeta<typeof FranchiseCompanySearchList>;
