import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import QuicksaleAppBar from './QuicksaleAppBar.component';

const actionData = {
  onSignOut: action('onSignOut'),
};

export default {
  title: 'Components/Quicksale/QuicksaleAppBar',
  component: QuicksaleAppBar,
  argTypes: {
    onSignOut: actionData.onSignOut,
  },
} as ComponentMeta<typeof QuicksaleAppBar>;

const Template: ComponentStory<typeof QuicksaleAppBar> = (args) => (
  <QuicksaleAppBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  theme: {
    cover: 'https://picsum.photos/40/40',
    company_name: 'Bsport',
  },
  staffFullName: 'Quicksale staff',
};
