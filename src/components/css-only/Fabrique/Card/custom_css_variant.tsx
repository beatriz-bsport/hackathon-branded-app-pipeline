import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import Card, { type CardProps } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import CardCss from './styles.css?raw';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const CARD_CHILDREN = faker.lorem.sentence(3);

const fabriqueCardVariationRegistry = [
  {
    label: 'componentType',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
  {
    label: 'cardVariant',
    choices: [
      {
        label: 'rest',
        value: 'rest',
      },
      {
        label: 'elevated',
        value: 'elevated',
      },
    ],
    default: { label: 'rest', value: 'rest' },
  },
  {
    label: 'isRippleEnabled',
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
    label: 'square',
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
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<CardProps, 'children'> => {
  const componentType =
    variationsSelected?.componentType?.value === 'true' ? 'button' : 'div';
  const variant =
    variationsSelected?.cardVariant?.value === 'rest' ? 'rest' : 'elevated';
  const isRippleEnabled = variationsSelected?.isRippleEnabled?.value === 'true';
  const square = variationsSelected?.square?.value === 'true';
  return {
    componentType,
    variant,
    isRippleEnabled,
    square,
  };
};

export const FABRIQUE_CARD_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_CARD,
  css: CardCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: fabriqueCardVariationRegistry,
};

export const FABRIQUE_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <Card {...componentProps}>{CARD_CHILDREN}</Card>;
});
