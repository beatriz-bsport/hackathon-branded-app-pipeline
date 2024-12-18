import React from 'react';

import { ComponentStory, ComponentMeta, Meta } from '@storybook/react';
import { TabStorybook } from '.';
import { fakerEN as faker } from '@faker-js/faker';
import { TabColorEnum } from './constants';

const TabStorybookTemplate: ComponentStory<typeof TabStorybook> = (args) => (
  <TabStorybook {...args} />
);

TabStorybook.displayName = 'Tab';

const baseArgs = {
  children: faker.lorem.word(8),
  isSelected: false,
};

export const Tabrest = TabStorybookTemplate.bind({});
Tabrest.args = baseArgs;

export const Tabselectedgrey = TabStorybookTemplate.bind({});
Tabselectedgrey.args = { ...baseArgs, isSelected: true, color: 'grey' };

export const Tabselectedmain = TabStorybookTemplate.bind({});
Tabselectedmain.args = { ...baseArgs, isSelected: true, color: 'main' };

export const Tabwithselect = TabStorybookTemplate.bind({});
Tabwithselect.args = { ...baseArgs, hasSelect: true };

export default {
  title: 'Fabrique/Tab/Stories',
  component: TabStorybook,
  argTypes: {
    color: {
      description: 'The color variant for the tab',
      control: { type: 'inline-radio' },
      options: [TabColorEnum.GREY, TabColorEnum.MAIN],
    },
    isSelected: {
      description: 'Whether the tab is selected or not',
      control: { type: 'boolean' },
    },
    hasSelect: {
      description:
        'Whether the tab can function as a dropdown, allowing users to select from multiple options inside a menu component',
      control: { type: 'boolean' },
    },
    children: {
      description: 'The text element to display within the tab',
      control: { type: 'text' },
    },
  },
} as ComponentMeta<typeof TabStorybook>;
