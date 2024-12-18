import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { DisableInputComponent } from '.';
import type { DisableInputProps } from '.';

export default {
  title: 'components/Smartlists/filters/DisableInput',
  component: DisableInputComponent,
  argTypes: {
    filterData: {
      description: 'The filter object values stored in database',
    },
    keys: {
      description: 'Mapper between the filterData keys and the input fields',
    },
    onChange: {
      description:
        'The function used to update the filterData with the backend',
    },
    forceDisable: {
      description:
        'If true, the children will be disabled regardless of the switch state',
    },
  },
} as ComponentMeta<typeof DisableInputComponent>;

const Template: Story<DisableInputProps> = (args) => (
  <DisableInputComponent {...args} />
);

export const Disabled = Template.bind({});
Disabled.args = {
  filterData: { activeKey: true },
  keys: { activeKey: 'activeKey' },
  onChange: (dict: any) => console.log(dict),
  forceDisable: true,
  children: <div>Child Component</div>,
};

export const NotDisabled = Template.bind({});
NotDisabled.args = {
  filterData: { activeKey: false },
  keys: { activeKey: 'activeKey' },
  onChange: (dict: any) => console.log(dict),
  forceDisable: false,
  children: <div>Child Component</div>,
};
