import React from 'react';
import CustomChip, { CustomChipProps } from './CustomChip.component';
import { ComponentMeta } from '@storybook/react';

const CustomChipTemplate = (args: CustomChipProps) => <CustomChip {...args} />;

export const DefaultCustomChip = CustomChipTemplate.bind({});
DefaultCustomChip.args = {
  displayedValue: 'Success',
  mainColor: '#388e3c',
  icon: 'CheckCircle',
  iconColor: '#4caf50',
};

export const NoIconCustomChip = CustomChipTemplate.bind({});
NoIconCustomChip.args = {
  displayedValue: '50',
  mainColor: '#d32f2f',
  icon: null,
  iconColor: null,
};

export const GreyCustomChip = CustomChipTemplate.bind({});
GreyCustomChip.args = {
  displayedValue: 'No',
  mainColor: null,
  icon: 'Cancel',
  iconColor: null,
};

export const TooltipChip = CustomChipTemplate.bind({});
TooltipChip.args = {
  displayedValue: 'Tooltip here',
  mainColor: '#388e3c',
  icon: 'CheckCircle',
  toolTip: true,
  toolTipValue: 'This is the tooltip displayed value',
};

export const BackgroundHoverChip = CustomChipTemplate.bind({});
BackgroundHoverChip.args = {
  displayedValue: 'Hover to display background',
  mainColor: '#388e3c',
  icon: 'CheckCircle',
  withBackgroundOnHover: true,
};

export default {
  title: 'Components/Chip/CustomChip',
  component: CustomChip,
  argTypes: {
    displayedValue: {
      description: 'The value that will be displayed in the chip.',
    },
    mainColor: {
      description:
        'The main color of the chip. It will be the text color, and will be used to compute the background color (same shade as the text color but lighter). If the color is null, the chip will be grey.',
    },
    icon: {
      description:
        'The name of the icon to display in the chip. If the icon is null, there will be no icon.',
    },
    iconColor: {
      description:
        'The color of the icon. If the icon color is null while the icon is not null, the icon will be the same color as the text.',
    },
    chipClass: {
      description: '(Optional) A class to apply to the chip.',
    },
    maxWidth: {
      description:
        '(Optional) A string precising the maximum width of the chip.',
    },
    withBackground: {
      description:
        "(Optional) A boolean true if the chip has a background and false if it hasn't.",
    },
    blackText: {
      description:
        "(Optional) A boolean true if the color of the text is black and false if it's not.",
    },
    toolTip: {
      description:
        "(Optional) A boolean true if the chip has a tooltip displaying the text of the chip and false if it hasn't.",
    },
    toolTipValue: {
      description:
        "(Optional) A string containing the text to display the chip's tooltip.",
    },
    withBackgroundOnHover: {
      description:
        '(Optional) A boolean true if the background should only be displayed on mouse over.',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          "This component is an abstract custom chip. It's a monochrome chip, with a light background color the same shade as its text color, and with the possibility to add an icon.",
      },
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
} as ComponentMeta<typeof CustomChip>;
