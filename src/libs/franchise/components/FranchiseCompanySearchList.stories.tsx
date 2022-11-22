import React from 'react';
import FranchiseCompanySearchList, { OwnProps } from './FranchiseCompanySearchList.components';
import { FranchiseCompanyListFactory } from '../factories/FranchiseCompanyFactory';

const CustomTemplate = (args: OwnProps) => (
    <FranchiseCompanySearchList {...args} />
);

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const companies = FranchiseCompanyListFactory(5)

CompleteDefaultState.args = {
    companies,
    selectedCompanyId: undefined,
    handleCompanySelected: () => {},
};

export default {
    title: 'Library/Franchise/Company List',
    component: FranchiseCompanySearchList,
    parameters: {
        docs: {
            page: null
        }
    },
};
