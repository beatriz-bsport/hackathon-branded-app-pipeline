import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { faker } from '@faker-js/faker';

import BubbleCard from './BubbleCard.component';

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
    withUpwardPointingTail: {
      control: 'boolean',
      description: 'Indicates if the bubble is pointing upwards',
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
  args: React.ComponentProps<typeof BubbleCard> & { text?: string },
) => (
  <BubbleCard {...args}>
    <div>{args.text || 'text'}</div>
  </BubbleCard>
);

export const Basic = Template.bind({});
Basic.args = { customColor: 'white', withShadow: true };

export const Long = Template.bind({});
Long.args = {
  customColor: 'white',
  withShadow: false,
  text: faker.lorem.sentence(40),
};

export const PointingUpward = Template.bind({});
PointingUpward.args = {
  customColor: '#d1eaca',
  text: faker.lorem.sentence(40),
  withUpwardPointingTail: true,
};

const TemplateWithoutChildren: ComponentStory<typeof BubbleCard> = (
  args: React.ComponentProps<typeof BubbleCard>,
) => <BubbleCard {...args} />;

export const NoContent = TemplateWithoutChildren.bind({});
NoContent.args = { customColor: 'red' };
