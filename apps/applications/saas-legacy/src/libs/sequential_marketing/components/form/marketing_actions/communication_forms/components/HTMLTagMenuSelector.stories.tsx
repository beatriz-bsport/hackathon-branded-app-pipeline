import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HTMLTagMenuSelector, { Props } from './HTMLTagMenuSelector.component';

export default {
  title: 'Components/Cadences/Communication/TagMenuSelector',
  component: HTMLTagMenuSelector,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Selector menu for tags used in communications.',
    },
  },
  argTypes: {
    withMaxWidth: { control: 'boolean' },
    onBaliseItemClick: {
      action: 'baliseItemClicked',
      description: 'Action when click on tag item',
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
} as ComponentMeta<typeof HTMLTagMenuSelector>;

const Template: ComponentStory<typeof HTMLTagMenuSelector> = (args: Props) => (
  <HTMLTagMenuSelector {...args} />
);

const fakeTagCategories = {
  User: ['1', '2'],
  Company: ['3', '4', '5'],
};

export const Primary = Template.bind({});
Primary.args = {
  tagCategories: fakeTagCategories,
};
