import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BigIconStorybook } from '.';
import { BigIconEnum } from './constants';

BigIconStorybook.displayName = 'BigIcon';

const BigIconStorybookTemplate: ComponentStory<typeof BigIconStorybook> = (
  args,
) => <BigIconStorybook {...args} />;

export const Bigicon = BigIconStorybookTemplate.bind({});

export default {
  title: 'Fabrique/BigIcon/Stories',
  component: BigIconStorybook,
  argTypes: {
    variant: {
      description: 'The variant of the big icon',
      control: { type: 'inline-radio' },
      options: [
        BigIconEnum.SUCCESS,
        BigIconEnum.WARNING,
        BigIconEnum.ERROR,
        BigIconEnum.INFO,
        BigIconEnum.GREY,
      ],
      defaultValue: BigIconEnum.SUCCESS,
    },
  },
} as ComponentMeta<typeof BigIconStorybook>;
