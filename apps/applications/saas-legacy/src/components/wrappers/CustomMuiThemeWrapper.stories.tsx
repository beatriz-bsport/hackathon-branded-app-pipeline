import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CustomMuiThemeWrapper from './CustomMuiThemeWrapper.component';
import Button from '@material-ui/core/Button';
import { fakerEN as faker } from '@faker-js/faker';

export default {
  title: 'Components/Wrappers/CustomMuiThemeWrapper',
  component: CustomMuiThemeWrapper,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'This is a wrapper component to be able to customize the theme.',
    },
    layout: 'centered',
  },
  argTypes: {
    primary: {
      description: 'The primary color of the custom theme.',
    },
    secondary: {
      description: 'The secondary color of the custom theme.',
    },
  },
} as ComponentMeta<typeof CustomMuiThemeWrapper>;

const Template: ComponentStory<typeof CustomMuiThemeWrapper> = (
  args: React.ComponentProps<typeof CustomMuiThemeWrapper>,
) => (
  <CustomMuiThemeWrapper {...args}>
    <Button color="primary" variant="contained">
      Primary
    </Button>
    <Button color="secondary" variant="contained">
      Secondary
    </Button>
  </CustomMuiThemeWrapper>
);

export const DefaultTheme = Template.bind({});

export const CustomTheme = Template.bind({});
CustomTheme.args = {
  primary: faker.color.rgb(),
  secondary: faker.color.rgb(),
};
CustomTheme.argTypes = {
  primary: { control: 'color' },
  secondary: { control: 'color' },
};

export const AnotherCustomTheme = Template.bind({});
AnotherCustomTheme.argTypes = {
  primary: {
    control: 'radio',
    options: ['error', 'info', 'success', 'warning'],
    default: 'success',
  },
  secondary: {
    control: 'radio',
    options: ['error', 'info', 'success', 'warning'],
    default: 'warning',
  },
};
