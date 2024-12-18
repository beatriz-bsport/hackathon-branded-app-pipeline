import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import TextForm, { Props } from '.';
// @ts-expect-error
import TextFormCss from './styles.css?raw';

const HELPER_TEXT = faker.lorem.sentences(1);
const MAX_CHARACTERS_LENGTH = faker.number.int({ min: 100, max: 1000 });

const fabriqueTextFormVariationRegistry = [
  {
    label: 'isDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayCaptionText',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isError',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'displayLabel',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isDraggable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isRequired',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'displayPlaceholder',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'withMaxCharacters',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

export const FABRIQUE_TEXTFORM_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_TEXTFORM,
  css: TextFormCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueTextFormVariationRegistry,
};

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<Props, 'value' | 'onChange' | 'textFormId'> => {
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const isRequired = variationsSelected?.isRequired?.value === 'true';
  const displayPlaceholder =
    variationsSelected?.displayPlaceholder?.value === 'true';
  const isError = variationsSelected?.isError?.value === 'true';
  const isDraggable = variationsSelected?.isDraggable?.value === 'true';
  const withMaxCharacters =
    variationsSelected?.withMaxCharacters?.value === 'true';

  return {
    isDisabled,
    captionText: displayCaptionText && HELPER_TEXT,
    label: displayLabel && 'Label',
    isRequired,
    placeholder: displayPlaceholder && 'Placeholder',
    isError,
    isDraggable,
    maxCharacters: withMaxCharacters && MAX_CHARACTERS_LENGTH,
  };
};

export const FABRIQUE_TEXTFORM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const [value, setValue] = React.useState('');
  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(event.target.value);

  return (
    <div>
      <TextForm
        onChange={handleOnChange}
        textFormId="fabrique-text-form-preview"
        value={value}
        {...componentProps}
      />
    </div>
  );
});
