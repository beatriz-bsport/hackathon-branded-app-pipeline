import React from 'react';
import FranchiseMemberDetailsCard, {
  Props,
} from './FranchiseMemberDetailsCard.components';
import FactoryBot from '../factories/FranchiseUserFactory';

const CustomTemplate = (args: Props) => (
  <FranchiseMemberDetailsCard {...args} />
);

export const CompleteDefaultState = CustomTemplate.bind({});

const user = FactoryBot.FranchiseUser.createOne();

CompleteDefaultState.args = {
  user,
};

export default {
  title: 'Library/Franchise/Member Details',
  component: FranchiseMemberDetailsCard,
  parameters: {
    docs: {
      page: null,
    },
  },
};
