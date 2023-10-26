import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CardStorybook, type CardProps } from '.';

const CardStoryBookTemplate: ComponentStory<typeof CardStorybook> = (
  args: CardProps,
) => <CardStorybook {...args} />;

CardStorybook.displayName = 'Card';

export const Divrest = CardStoryBookTemplate.bind({});

export const Divelevated = CardStoryBookTemplate.bind({});
Divelevated.args = {
  variant: 'elevated',
};

export const Buttonrest = CardStoryBookTemplate.bind({});
Buttonrest.args = {
  componentType: 'button',
};

export const Buttonelevated = CardStoryBookTemplate.bind({});
Buttonelevated.args = {
  componentType: 'button',
  variant: 'elevated',
};

export const Divelevatedsquare = CardStoryBookTemplate.bind({});
Divelevatedsquare.args = {
  variant: 'elevated',
  square: true,
};

export const Buttonrestsquare = CardStoryBookTemplate.bind({});
Buttonrestsquare.args = {
  componentType: 'button',
  square: true,
};

export const Buttonelevatedsquare = CardStoryBookTemplate.bind({});
Buttonelevatedsquare.args = {
  componentType: 'button',
  variant: 'elevated',
  square: true,
};

export default {
  title: 'Fabrique/Card/Stories',
  component: CardStorybook,
  argTypes: {
    children: {
      description: 'The card content',
      control: 'text',
      defaultValue:
        "When you're strange, Faces come out of the rain, When you're strange, No one remembers your name",
    },
    className: {
      description: 'Extend the styles applied to the component.',
    },
    componentType: {
      description:
        'The component used for the root node. Either a div or a BaseButton component.',
      control: 'radio',
      options: ['div', 'button'],
    },
    customRef: {
      description: 'A reference to a custom HTML `div` element.',
    },
    isRippleEnabled: {
      description:
        'Indicates whether the ripple effect is enabled (true) or disabled (false).',
      control: 'boolean',
      defaultValue: false,
    },
    onClick: {
      description: 'A callback function to be triggered when clicked.',
    },
    square: {
      description: 'If `true`, rounded corners are disabled.',
      control: 'boolean',
      defaultValue: false,
    },
    variant: {
      description: 'The variant to use.',
      control: 'radio',
      options: ['rest', 'elevated'],
    },
  },
} as ComponentMeta<typeof CardStorybook>;
