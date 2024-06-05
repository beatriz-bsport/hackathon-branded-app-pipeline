import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import Checkbox, { CheckboxProps, CheckboxSize } from '.';
import { CheckboxSizeEnum } from './constants';
// @ts-expect-error
import CheckboxCss from './styles.css?raw';

const fabriqueCheckboxVariationRegistry = [
  {
    label: 'isDisabled',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isInversed',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayLabel',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayCaptionText',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isMultiple',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'size',
    choices: [
      {
        label: CheckboxSizeEnum.SM,
        value: CheckboxSizeEnum.SM,
      },
      {
        label: CheckboxSizeEnum.LG,
        value: CheckboxSizeEnum.LG,
      },
    ],
    default: { label: CheckboxSizeEnum.SM, value: CheckboxSizeEnum.SM },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<CheckboxProps, 'isChecked'> => {
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const isInversed = variationsSelected?.isInversed?.value === 'true';
  const size = variationsSelected?.size?.value as CheckboxSize;
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const multiple = variationsSelected?.isMultiple?.value === 'true';
  return {
    captionText: displayCaptionText && 'captionText',
    isDisabled,
    isInversed,
    label: displayLabel && 'Label',
    size,
    multiple,
    id: 'radio-checkbox-preview-id',
  };
};

export const FABRIQUE_CHECKBOX_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_CHECKBOX,
  css: CheckboxCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueCheckboxVariationRegistry,
};

export const FABRIQUE_CHECKBOX_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { multiple, ...componentProps } =
    usePropsFromVariation(variationsSelected);
  const [checked, setChecked] = React.useState(false);
  const handleOnClick = () => {
    setChecked((prevState) => !prevState);
  };

  return (
    <Checkbox
      {...componentProps}
      isChecked={!multiple && checked}
      multiple={multiple && checked}
      onClick={handleOnClick}
    />
  );
});
