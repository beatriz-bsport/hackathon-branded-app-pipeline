import React from 'react';
import { establishment_factory } from '../factory';
import {
  EstablishmentSelectorControlled,
  OwnProps,
} from './EstablishmentSelector.component';

const commonArgs = {
  establishments: establishment_factory(6),
  isClearable: true,
  isLoading: false,
  isOptionDisabled: true,
  noMulti: true,
  closeMenuOnSelect: true,
  isRequired: true,
};

const CustomTemplate = (args: OwnProps) => (
  <EstablishmentSelectorControlled {...args} />
);
export const CompulsorySelector = CustomTemplate.bind({});

CompulsorySelector.args = {
  ...commonArgs,
  requiredValueIsMissing: false,
};

export const CompulsorySelectorWithoutSelectedValue = CustomTemplate.bind({});

CompulsorySelectorWithoutSelectedValue.args = {
  ...commonArgs,
  requiredValueIsMissing: true,
};

export default {
  title: 'Library/Establishment/Selector',
  component: EstablishmentSelectorControlled,
  parameters: {
    docs: {
      page: null,
    },
  },
};
