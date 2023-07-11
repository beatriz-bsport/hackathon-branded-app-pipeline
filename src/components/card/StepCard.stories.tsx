import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Typography from '@material-ui/core/Typography';
import StepCard, { StepCardProps } from './StepCard.component';
// @ts-expect-error
import { faker } from '@faker-js/faker';
faker.locale = 'en';

export default {
  title: 'Components/Cards/StepCard',
  component: StepCard,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof StepCard>;

const StepCardTemplate: ComponentStory<typeof StepCard> = (
  args: StepCardProps,
) => <StepCard {...args} />;

export const CustomizedStepCard = StepCardTemplate.bind({});
CustomizedStepCard.args = {
  header: <Typography variant="subtitle1">Title</Typography>,
  content: <div>Content</div>,
  color: 'rgba(144, 190, 109, 0.25)',
  selectedColor: 'rgba(144, 190, 109, 1)',
  isSelected: false,
  isDivided: false,
  disabled: false,
  withShadow: false,
};

export const BlankStepCard = StepCardTemplate.bind({});
BlankStepCard.args = {
  header: <Typography variant="subtitle2">Title</Typography>,
  content: <div>Content</div>,
  disabled: false,
};

export const BlankStepCardWithShadow = StepCardTemplate.bind({});
BlankStepCardWithShadow.args = {
  header: <Typography variant="subtitle2">Title</Typography>,
  content: <div>Content</div>,
  withShadow: true,
  disabled: false,
};

export const LargeStepCard = StepCardTemplate.bind({});
LargeStepCard.args = {
  header: <Typography variant="subtitle2">{faker.lorem.words(2)}</Typography>,
  content: (
    <div>
      {faker.hacker.phrase()}
      {faker.hacker.phrase()}
      {faker.hacker.phrase()}
    </div>
  ),
  isDivided: false,
  withShadow: true,
  disabled: false,
};
