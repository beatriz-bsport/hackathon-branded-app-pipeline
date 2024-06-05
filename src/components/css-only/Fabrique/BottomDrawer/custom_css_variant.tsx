import React, { useCallback, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import Button from '#Fabrique/ButtonV2';
// @ts-expect-error
import BottomDrawerCss from './styles.css?raw';
import BottomDrawer, { Props as ButtonDrawerProps } from '.';

const DRAWER_CONTENT = faker.lorem.sentences(20);
const DIALOG_TITLE = faker.lorem.words(3);
const DIALOG_SUBTITLE = faker.lorem.words(6);

const bottomDrawerVariationRegistry = [
  {
    label: 'isExpanded',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<ButtonDrawerProps, 'children'> => {
  const isExpandedSelected = variationsSelected?.isExpanded?.value === 'true';
  return {
    isExpanded: isExpandedSelected,
  };
};

export const FABRIQUE_BOTTOM_DRAWER_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_BOTTOM_DRAWER,
    css: BottomDrawerCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: bottomDrawerVariationRegistry,
  };

export const FABRIQUE_BOTTOM_DRAWER_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const { t } = useTranslation('widget');
  const componentProps = usePropsFromVariation(variationsSelected);

  const toggleShowDrawer = useCallback(() => {
    setShowBottomDrawer((state) => !state);
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <Button
        color="primary"
        onClick={toggleShowDrawer}
        size="md"
        variant="contained"
      >
        {t('widget:widget.cssConfig.title.showBottomDrawer')}
      </Button>
      <BottomDrawer
        {...componentProps}
        blanketProps={{ isOpen: showBottomDrawer, onClick: toggleShowDrawer }}
        modalDialogProps={{
          title: DIALOG_TITLE,
          subtitle: DIALOG_SUBTITLE,
          onClose: toggleShowDrawer,
          onCancel: toggleShowDrawer,
          onConfirm: () => {},
        }}
      >
        {DRAWER_CONTENT}
      </BottomDrawer>
    </div>
  );
});
