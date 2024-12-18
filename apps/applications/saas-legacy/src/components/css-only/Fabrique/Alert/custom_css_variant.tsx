import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { Star06 } from '#src/components/untitledui';
import Alert, { Props as AlertProps } from '.';
import { AlertVariantEnum, AlertColorEnum } from './constants';
import { AlertVariant, AlertColor } from './types';
// @ts-expect-error
import AlertCss from './styles.css?raw';

const ALERT_TITLE = faker.lorem.words(5);
const ALERT_CONTENT = faker.lorem.sentences(3);
const ALERT_ACTION_TEXT = faker.lorem.word(8);

const fabriqueAlertVariationRegistry = [
  {
    label: 'color',
    choices: [
      { label: AlertColorEnum.LIGHT, value: AlertColorEnum.LIGHT },
      { label: AlertColorEnum.GREY, value: AlertColorEnum.GREY },
      { label: AlertColorEnum.INFO, value: AlertColorEnum.INFO },
      { label: AlertColorEnum.SUCCESS, value: AlertColorEnum.SUCCESS },
      { label: AlertColorEnum.WARNING, value: AlertColorEnum.WARNING },
      { label: AlertColorEnum.ERROR, value: AlertColorEnum.ERROR },
    ],
    default: { label: AlertColorEnum.LIGHT, value: AlertColorEnum.LIGHT },
  },
  {
    label: 'variant',
    choices: [
      { label: AlertVariantEnum.STRONG, value: AlertVariantEnum.STRONG },
      { label: AlertVariantEnum.WEAK, value: AlertVariantEnum.WEAK },
      { label: AlertVariantEnum.OUTLINED, value: AlertVariantEnum.OUTLINED },
      { label: AlertVariantEnum.TEXT, value: AlertVariantEnum.TEXT },
    ],
    default: { label: AlertVariantEnum.TEXT, value: AlertVariantEnum.TEXT },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): AlertProps => {
  const colorSelected = variationsSelected?.color?.value as AlertColor;
  const variantSelected = variationsSelected?.variant?.value as AlertVariant;

  return {
    color: colorSelected,
    variant: variantSelected,
    leftIcon: ['light', 'grey'].includes(colorSelected) && (
      <Star06 stroke="currentColor" />
    ),
    title: ALERT_TITLE,
    children: ALERT_CONTENT,
    actionText: ALERT_ACTION_TEXT,
    onActionClick: () => {},
    onClose: () => {},
  };
};

export const FABRIQUE_ALERT_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_ALERT,
  css: AlertCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueAlertVariationRegistry,
};

export const FABRIQUE_ALERT_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <Alert {...componentProps} />
    </div>
  );
});
