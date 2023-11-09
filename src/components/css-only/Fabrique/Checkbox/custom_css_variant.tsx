import React from 'react';
import Checkbox, { CheckboxProps, CheckboxSize } from '.';
import { CheckboxSizeEnum } from './constants';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import CheckboxCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const fabriqueCheckboxVariationRegistry = [
  {
    label: 'isChecked',
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
): CheckboxProps => {
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const isInversed = variationsSelected?.isInversed?.value === 'true';
  const isChecked = variationsSelected?.isChecked?.value === 'true';
  const size = variationsSelected?.size?.value as CheckboxSize;
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const multiple = variationsSelected?.isMultiple?.value === 'true';
  return {
    captionText: displayCaptionText && 'captionText',
    isDisabled,
    isChecked,
    isInversed,
    label: displayLabel && 'Label',
    size,
    multiple,
    id: 'radio-button-preview-id',
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
  // TODO : Had a react state here to handle the select state, it's better for user
  const componentProps = usePropsFromVariation(variationsSelected);
  return <Checkbox {...componentProps} />;
});
