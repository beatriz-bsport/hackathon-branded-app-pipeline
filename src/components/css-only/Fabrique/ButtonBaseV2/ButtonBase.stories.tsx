import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import { ButtonBaseStorybook } from '.';

const ButtonBaseStorybookTemplate: ComponentStory<
  typeof ButtonBaseStorybook
> = (args) => (
  <ButtonBaseStorybook {...args}>
    The quick brown fox jumps over the lazy dog
  </ButtonBaseStorybook>
);

ButtonBaseStorybook.displayName = 'ButtonBase';

export const Demonbuttonbase = ButtonBaseStorybookTemplate.bind({});
Demonbuttonbase.args = {
  isDisabled: false,
  isRippleEnabled: false,
};

export const Demobuttonhrefbase = ButtonBaseStorybookTemplate.bind({});
Demobuttonhrefbase.args = {
  isDisabled: false,
  isRippleEnabled: false,
  href: faker.internet.url(),
};

export default {
  title: 'Fabrique/ButtonBase/Stories',
  component: ButtonBaseStorybook,
  argTypes: {
    children: {
      description: 'The button content',
      control: 'text',
    },
    href: {
      description: 'Link when ButtonBase is used to open one.',
      control: 'text',
    },
    isRippleEnabled: {
      description:
        'Active the ripple effect for user interactive feeback (can be use for collapse section title for example',
      control: { type: 'boolean' },
    },
    isDisabled: {
      description: 'Whether or not the button is active',
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof ButtonBaseStorybook>;
