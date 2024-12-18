import React from 'react';
import GenericCustomBooleanChip from './GenericCustomBooleanChip.component';
import { ComponentMeta } from '@storybook/react';

const CustomChipTemplate = (
  args: React.ComponentProps<typeof GenericCustomBooleanChip>,
) => <GenericCustomBooleanChip {...args} />;

export const NoBooleanChip = CustomChipTemplate.bind({});

export const YesBooleanChip = CustomChipTemplate.bind({});
YesBooleanChip.args = {
  isTrue: true,
};

export default {
  title: 'Components/Chip/GenericCustomBooleanChip',
  component: GenericCustomBooleanChip,
  argTypes: {
    isTrue: {
      description: 'Whether the Chip should display Yes instead of No.',
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This Chip renders a CustomChip with an icon and label Yes/No depending on a boolean value.',
      },
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof GenericCustomBooleanChip>;
