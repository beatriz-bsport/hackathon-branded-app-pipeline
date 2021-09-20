import React from 'react';
import FranchiseMemberDetailsCard, { OwnProps } from './FranchiseMemberDetailsCard.components';
import FactoryBot from '../factories/FranchiseUserFactory';

const CustomTemplate = (args: OwnProps) => (
    <FranchiseMemberDetailsCard {...args} />
);

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const user = FactoryBot.FranchiseUser.createOne();

CompleteDefaultState.args = {
  user,
};

export default {
    title: 'Franchise/Member/Details',
    component: FranchiseMemberDetailsCard,
    parameters: {
        docs: {
            page: null
        }
    },
};