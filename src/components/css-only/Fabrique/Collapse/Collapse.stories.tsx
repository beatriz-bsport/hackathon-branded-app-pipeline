import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CollapseForStorybook, type Props } from '.';

const CollaspeTemplate = (args: Props) => (
  // @ts-expect-error
  <CollapseForStorybook {...args}>{args.children}</CollapseForStorybook>
);

export const AlertSuccess = CollaspeTemplate.bind({});
AlertSuccess.args = {
  children: faker.lorem.sentences(6),
};

export default {
  title: 'TheFrabique/Collapse',
  component: CollapseForStorybook,
  argTypes: {
    isExpanded: {
      control: {
        type: 'boolean',
        description: 'Open or what',
      },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
