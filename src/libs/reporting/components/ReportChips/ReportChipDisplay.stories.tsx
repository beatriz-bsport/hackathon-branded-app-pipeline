import React from 'react';
import ReportChipDisplay, { Props } from './ReportChipDisplay.component';

const ReportChipDisplayTemplate = (args: Props) => (
  <ReportChipDisplay {...args} />
);

export const DefaultReportChip = ReportChipDisplayTemplate.bind({});

DefaultReportChip.args = {
  value: 'Success',
  mainColor: '#388e3c',
  icon: 'CheckCircle',
  iconColor: '#4caf50',
};

export const NoIconReportChip = ReportChipDisplayTemplate.bind({});

NoIconReportChip.args = {
  value: '50',
  mainColor: '#d32f2f',
  icon: null,
  iconColor: null,
};

export const GreyReportChip = ReportChipDisplayTemplate.bind({});

GreyReportChip.args = {
  value: 'No',
  mainColor: null,
  icon: 'Cancel',
  iconColor: null,
};

export default {
  title: 'Library/Reporting/ReportChipDisplay',
  component: ReportChipDisplay,
  argTypes: {
    value: {
      description: 'The value that will be displayed in the chip.',
    },
    mainColor: {
      description:
        'The main color of the chip. It is the text color, which is used to compute the backgroundColor. If the color is null, the chip will be grey.',
    },
    icon: {
      description:
        'The name of the icon to display in the chip. If the icon is null, there will be no icon.',
    },
    iconColor: {
      description:
        'The color of the icon. If the icon color is null while the icon is not null, the icon will be the same color as the text.',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          "The Report Chip component is a custom chip used for the reports. It's only used for display : there are other components that manage the matching between the value of the chip and what color it should be.",
      },
    },
  },
};
