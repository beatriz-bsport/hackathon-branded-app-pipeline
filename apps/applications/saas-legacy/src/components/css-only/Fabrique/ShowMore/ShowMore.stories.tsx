import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ShowMoreForStorybook, type Props } from '.';

const CollaspeTemplate = (args: Props) => (
  <ShowMoreForStorybook {...args}>{args.children}</ShowMoreForStorybook>
);

export const AlertSuccess = CollaspeTemplate.bind({});
AlertSuccess.args = {
  children: faker.lorem.sentences(6),
};

export default {
  title: 'Fabrique/ShowMore',
  component: ShowMoreForStorybook,
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
