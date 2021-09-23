import React from 'react';
import FranchiseThemeForm, { OwnProps } from './FranchiseThemeForm.components';
import FactoryBot from '../factories/Franchise';
import chroma from 'chroma-js';

const CustomTemplate = (args: OwnProps) => <FranchiseThemeForm {...args} />;

export const CompleteDefaultState = CustomTemplate.bind({});

// @ts-ignore
const franchise = FactoryBot.Franchise.createOne();

const RGBtoHex = (rgb: [number, number, number]) =>
  chroma(rgb[0], rgb[1], rgb[2]).hex();

CompleteDefaultState.args = {
  id: franchise.id,
  cover: franchise.cover,
  primaryColor: RGBtoHex(franchise.primaryRGB),
  secondaryColor: RGBtoHex(franchise.secondaryRGB),
  submitIsDisabled: false,
  handleCoverChange: () => {},
  handleChange: () => () => {},
  onSubmit: () => {},
};

export default {
  title: 'Franchise/Settings/Theme',
  component: FranchiseThemeForm,
  parameters: {
    docs: {
      page: null,
    },
  },
};
