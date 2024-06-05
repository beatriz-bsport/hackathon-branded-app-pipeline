import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import Selector, { SelectorProps } from '#Fabrique/Selector';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import { generateRandomName, generateRandomNames } from '#utils/factories';

import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import MenuItem from '#Fabrique/MenuItem';
import { Star06 } from '#components/untitledui';
import { SelectorSizeEnum } from '../constants';
import type { SelectorSize } from '../types';
// @ts-expect-error
import SelectorCss from './selector-input-styles.css?raw';

const PLACEHOLDER = generateRandomName(faker);

const ERROR_MESSAGE = faker.lorem.sentence(1);

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

const fabriqueSelectorInputVariationRegistry = [
  {
    label: 'displayPlaceholder',
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
    label: 'displayIcon',
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
    label: 'isError',
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
    label: 'size',
    choices: [
      {
        label: SelectorSizeEnum.LG,
        value: SelectorSizeEnum.LG,
      },
      {
        label: SelectorSizeEnum.SM,
        value: SelectorSizeEnum.SM,
      },
    ],
    default: { label: SelectorSizeEnum.SM, value: SelectorSizeEnum.SM },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Pick<
  SelectorProps,
  | 'placeholder'
  | 'isDisabled'
  | 'isError'
  | 'size'
  | 'leftIcon'
  | 'errorMessage'
> => {
  const displayPlaceholder =
    variationsSelected?.displayPlaceholder?.value === 'true';
  const displayIcon = variationsSelected?.displayIcon?.value === 'true';
  const size = variationsSelected?.size?.value as SelectorSize;
  const isError = variationsSelected?.isError?.value === 'true';
  const isDisabled = variationsSelected?.isDisabled?.value === 'true';
  return {
    placeholder: displayPlaceholder && PLACEHOLDER,
    leftIcon: displayIcon && <Star06 stroke="currentColor" />,
    size,
    isDisabled,
    isError,
    errorMessage: isError && ERROR_MESSAGE,
  };
};

export const FABRIQUE_SELECTOR_INPUT_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.SELECTOR_INPUT,
    css: SelectorCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueSelectorInputVariationRegistry,
  };

export const FABRIQUE_SELECTOR_INPUT_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  const [itemSelected, setItemSelected] = React.useState<{
    id: number;
    label: string;
  }>(null);

  const [closeOnSelect, setCloseOnSelect] = React.useState(false);

  const handleClick = (id: number) => () => {
    const selectedItem = menuItemData.find((menuItem) => menuItem.id === id);
    setItemSelected(selectedItem);
    setCloseOnSelect(true);
  };

  const handleClear = () => {
    setItemSelected(null);
  };

  const getSelectedItemLabel = (item: { label: string; id: number }) => {
    return item?.label;
  };

  const getSelectedItemValue = (item: { label: string; id: number }) => {
    return item?.id;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Selector
        closeOnSelect={closeOnSelect}
        getSelectedItemLabel={getSelectedItemLabel}
        getSelectedItemValue={getSelectedItemValue}
        id="bs-fabrique-selector-custom-css"
        onClear={handleClear}
        selectedItems={itemSelected}
        setCloseOnSelect={setCloseOnSelect}
        {...componentProps}
      >
        {menuItemData.map((menuItem) => (
          <MenuItem
            key={menuItem.id}
            label={menuItem.label}
            onClick={handleClick(menuItem.id)}
            selected={itemSelected?.id === menuItem.id}
          />
        ))}
      </Selector>
    </div>
  );
});
