import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import type { CompanyTheme } from '#libs/theme/types';
import ListItem from '#Fabrique/ListItem';
import { ListItemTypeEnum } from '#Fabrique/ListItem/constants';
import type { ListItemType } from '#Fabrique/ListItem/types';
import { ArrowBlockLeft } from '#components/untitledui';
import List from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ListCSS from './styles.css?raw';

type NumberKey = '1' | '2' | '3' | '4' | '5';
const numbersDict: Record<NumberKey, boolean> = {
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
};

const numbersArray = ['1', '2', '3', '4', '5'];

const fabriqueListVariationRegistry = [
  {
    label: 'withListTitle',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'inputType',
    choices: [
      { label: ListItemTypeEnum.CHECKBOX, value: ListItemTypeEnum.CHECKBOX },
      { label: ListItemTypeEnum.RADIO, value: ListItemTypeEnum.RADIO },
      { label: ListItemTypeEnum.TEXT, value: ListItemTypeEnum.TEXT },
    ],
    default: { label: ListItemTypeEnum.TEXT, value: ListItemTypeEnum.TEXT },
  },
];

export const FABRIQUE_LIST_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_LIST,
  css: ListCSS,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueListVariationRegistry,
};

export const FABRIQUE_LIST_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const withListTitle = variationsSelected?.withListTitle?.value === 'true';
  const type = variationsSelected?.inputType?.value as ListItemType;
  const [numbersCheckboxSelected, setNumbersCheckboxSelected] =
    React.useState(numbersDict);
  const [numberRadioSelected, setNumberRadioSelected] = React.useState('1');

  const handleChange = React.useCallback(
    (number: NumberKey) => () => {
      if (type === ListItemTypeEnum.CHECKBOX) {
        setNumbersCheckboxSelected((prevState) => ({
          ...prevState,
          [number]: !prevState[number],
        }));
      }
      if (type === ListItemTypeEnum.RADIO) {
        setNumberRadioSelected(number);
      }
    },
    [type],
  );

  return (
    <List listTitle={withListTitle && 'List title'}>
      {numbersArray.map((number: NumberKey) => (
        <ListItem
          key={number}
          captionText={`I'm number ${number}`}
          icon={<ArrowBlockLeft />}
          isSelected={
            type === ListItemTypeEnum.CHECKBOX
              ? numbersCheckboxSelected[number]
              : numberRadioSelected === number
          }
          label={number}
          onClick={handleChange(number)}
          type={type}
        />
      ))}
    </List>
  );
});
