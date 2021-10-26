import faker from 'faker';
import React from 'react';
import FuzzySearch, { OwnProps } from './FuzzySearch.component';
import FactoryBotUser from '../../libs/franchise/factories/FranchiseUserFactory';
import { Avatar, ListItem } from '@material-ui/core';
import HighlightedText from '../HighlightedText/HighlightedText.component';

const CustomTemplate = (args: OwnProps) => <FuzzySearch {...args} />;

export const NoMatchState = CustomTemplate.bind({});

const users = FactoryBotUser.FranchiseUser.create(10);

NoMatchState.args = {
  items: users,
  placeholder: `Search user, type ${users[0].name}`,
  searchFields: ['name'],
  itemRenderer: (item, search) => (
    <ListItem key={item.id} button divider>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar alt={item.name} src={item.cover} style={{ marginRight: 25 }} />
        <HighlightedText text={item.name} highlight={search} />
        (Customizable render by providing the right itemRenderer function)
      </div>
    </ListItem>
  ),
};

export default {
  title: 'Components/Commons/FuzzySearch',
  component: FuzzySearch,
  parameters: {
    docs: {
      page: null,
    },
  },
};
