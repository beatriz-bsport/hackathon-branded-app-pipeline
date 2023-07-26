import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SelectMenuButton, {
  SelectMenuButtonProps,
} from './SelectMenuButton.component';

export default {
  title: 'Components/Buttons/SelectMenuButton',
  component: SelectMenuButton,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Selector menu button made for cadence usage',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof SelectMenuButton>;

const actions = [
  {
    label: 'Action 1',
    icon: 'Delete',
    onClick: () => {},
    customColor: 'rgba(144, 59, 229, 1)',
  },
  {
    label: 'Action 2',
    icon: 'Add',
    onClick: () => {},
    customColor: 'rgba(144, 59, 229, 1)',
  },
];

const Template: ComponentStory<typeof SelectMenuButton> = (
  args: SelectMenuButtonProps,
) => <SelectMenuButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: '+ add',
  actionList: actions,
  customColor: 'rgba(144, 59, 229, 1)',
};
