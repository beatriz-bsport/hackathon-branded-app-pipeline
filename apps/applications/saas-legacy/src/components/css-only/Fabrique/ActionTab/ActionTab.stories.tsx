import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ActionTabStorybook } from '.';
import { fakerEN as faker } from '@faker-js/faker';

const BadgeStorybookTemplate: ComponentStory<typeof ActionTabStorybook> = (
  args,
) => <ActionTabStorybook {...args} />;

ActionTabStorybook.displayName = 'ActionTab';

const baseArgs = {
  value: faker.number.int(100),
  label: faker.lorem.word(8),
  isSelected: false,
  hasBadge: true,
};

export const Actiontabnobadge = BadgeStorybookTemplate.bind({});
Actiontabnobadge.args = { ...baseArgs, hasBadge: false };

export const Actiontabselected = BadgeStorybookTemplate.bind({});
Actiontabselected.args = { ...baseArgs, isSelected: true };

export const Actiontabbigvalue = BadgeStorybookTemplate.bind({});
Actiontabbigvalue.args = { ...baseArgs, value: faker.number.int() };

export const Actiontabbiglabel = BadgeStorybookTemplate.bind({});
Actiontabbiglabel.args = { ...baseArgs, label: faker.lorem.word(25) };

export default {
  title: 'Fabrique/ActionTab/Stories',
  component: ActionTabStorybook,
  argTypes: {
    label: {
      description: 'The text content to display',
      control: { type: 'text' },
      defaultValue: '',
    },
    isSelected: {
      description: 'Whether the tab is selected or not',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    hasBadge: {
      description: 'Whether the tab should display a badge or not',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    value: {
      description: 'Numeric content displayed inside the badge',
      control: { type: 'number' },
    },
    onClick: {
      description: 'The action to perform once the action tab has been clicked',
    },
  },
} as ComponentMeta<typeof ActionTabStorybook>;
