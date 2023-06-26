import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import BubbleCard, { BubbleCardProps } from './BubbleCard.component';

export default {
  title: 'Components/Cards/BubbleCard',
  component: BubbleCard,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubbles used in cadence graph for forms',
    },
  },
  argTypes: {
    customColor: {
      control: 'color',
      description: 'Background color of the bubble',
    },
    withShadow: {
      control: 'boolean',
      description: 'Boolean adding shadow to the bubble',
    },
    width: {
      control: 'text',
      description: 'The width of the bubble (example: 80px)',
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
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof BubbleCard>;

const Template: ComponentStory<typeof BubbleCard> = (
  args: BubbleCardProps & { text?: string },
) => (
  <BubbleCard {...args}>
    <div>{args.text || 'text'}</div>
  </BubbleCard>
);

export const Primary = Template.bind({});
Primary.args = { customColor: 'white', withShadow: false };

export const Long = Template.bind({});
Long.args = {
  customColor: 'white',
  withShadow: false,
  text: faker.lorem.sentence(40),
};
