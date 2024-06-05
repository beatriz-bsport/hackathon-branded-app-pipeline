import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import { generateRandomName, generateRandomNames } from '#utils/factories';

import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import MenuItem from '#Fabrique/MenuItem';
// @ts-expect-error
import SelectorCss from './styles.css?raw';
import Selector, { SelectorProps } from '.';
import { SelectorSizeEnum } from './constants';
import type { SelectorSize } from './types';

const LABEL = faker.lorem.word();

const CAPTION_TEXT = generateRandomName(faker);

const ERROR_MESSAGE = faker.lorem.sentence(1);

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

const fabriqueSelectorVariationRegistry = [
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
    label: 'isRequired',
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
  'label' | 'captionText' | 'size' | 'isRequired' | 'isError' | 'errorMessage'
> => {
  const displayLabel = variationsSelected?.displayLabel?.value === 'true';
  const displayCaptionText =
    variationsSelected?.displayCaptionText?.value === 'true';
  const size = variationsSelected?.size?.value as SelectorSize;
  const isRequired = variationsSelected?.isRequired?.value === 'true';
  const isError = variationsSelected?.isError?.value === 'true';
  return {
    label: displayLabel && LABEL,
    captionText: displayCaptionText && CAPTION_TEXT,
    size,
    isRequired,
    isError,
    errorMessage: isError && ERROR_MESSAGE,
  };
};

export const FABRIQUE_SELECTOR_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.SELECTOR,
  css: SelectorCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueSelectorVariationRegistry,
};

export const FABRIQUE_SELECTOR_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation('widget');
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
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.selector', {
          component_name: t('widget.components.selector_input'),
        })}
      </Alert>
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
