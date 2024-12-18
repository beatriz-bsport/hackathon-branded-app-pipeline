import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import Chip from '..';

import { Props } from '..';

import './stories.styles.css';

export default {
  title: 'Components/CssOnly/Chip',
  component: Chip,
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof Chip>;

const ChipTemplate: ComponentStory<typeof Chip> = (args: Props) => (
  <Chip {...args} />
);

export const Primary = ChipTemplate.bind({});
Primary.args = {
  label: 'Primary',
  icon: <CheckCircleOutlineOutlinedIcon fontSize="small" />,
  classes: { 'bs-chip': 'bs-chip', 'bs-chip-primary': 'bs-chip-primary' },
};

export const PrimaryWithoutLabel = ChipTemplate.bind({});
PrimaryWithoutLabel.args = {
  icon: <CheckCircleOutlineOutlinedIcon fontSize="small" />,
  classes: { 'bs-chip': 'bs-chip', 'bs-chip-primary': 'bs-chip-primary' },
};

export const PrimaryWithoutIcon = ChipTemplate.bind({});
PrimaryWithoutIcon.args = {
  label: 'Primary',
  classes: { 'bs-chip': 'bs-chip', 'bs-chip-primary': 'bs-chip-primary' },
};

export const Info = ChipTemplate.bind({});
Info.args = {
  label: 'Info',
  icon: <InfoOutlinedIcon fontSize="small" />,
  classes: { 'bs-chip': 'bs-chip', 'bs-chip-info': 'bs-chip-info' },
};

export const Error = ChipTemplate.bind({});
Error.args = {
  label: 'Error',
  icon: <CancelOutlinedIcon fontSize="small" />,
  classes: { 'bs-chip': 'bs-chip', 'bs-chip-error': 'bs-chip-error' },
};
