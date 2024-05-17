import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import ModalDialog, { Props as ModalDialogProps } from '.';
import { ModalDialogColorEnum, ModalDialogSizeEnum } from './constants';
import { ModalDialogColor, ModalDialogSize } from './types';
import { Star06 } from '#components/untitledui';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import BadgeCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const MODAL_DIALOG_TITLE = faker.lorem.words(6);
const MODAL_DIALOG_SUBTITLE = faker.lorem.words(3);
const MODAL_DIALOG_CONTENT = faker.lorem.sentences(3);

const fabriqueModalDialogVariationRegistry = [
  {
    label: 'color',
    choices: [
      {
        label: ModalDialogColorEnum.PRIMARY,
        value: ModalDialogColorEnum.PRIMARY,
      },
      {
        label: ModalDialogColorEnum.INFO,
        value: ModalDialogColorEnum.INFO,
      },
      {
        label: ModalDialogColorEnum.SUCCESS,
        value: ModalDialogColorEnum.SUCCESS,
      },
      {
        label: ModalDialogColorEnum.WARNING,
        value: ModalDialogColorEnum.WARNING,
      },
    ],
    default: {
      label: ModalDialogColorEnum.ERROR,
      value: ModalDialogColorEnum.ERROR,
    },
  },
  {
    label: 'size',
    choices: [
      {
        label: ModalDialogSizeEnum.XS,
        value: ModalDialogSizeEnum.XS,
      },
      {
        label: ModalDialogSizeEnum.MD,
        value: ModalDialogSizeEnum.MD,
      },
      {
        label: ModalDialogSizeEnum.LG,
        value: ModalDialogSizeEnum.LG,
      },
      {
        label: ModalDialogSizeEnum.XL,
        value: ModalDialogSizeEnum.XL,
      },
    ],
    default: {
      label: ModalDialogSizeEnum.LG,
      value: ModalDialogSizeEnum.LG,
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<ModalDialogProps, 'onCancel' | 'onClose' | 'onConfirm'> => {
  const colorSelected = variationsSelected?.color?.value as ModalDialogColor;
  const sizeSelected = variationsSelected?.size?.value as ModalDialogSize;

  return {
    leftIcon: colorSelected === 'primary' && <Star06 stroke="currentColor" />,
    title: MODAL_DIALOG_TITLE,
    subtitle: MODAL_DIALOG_SUBTITLE,
    children: MODAL_DIALOG_CONTENT,
    color: colorSelected,
    size: sizeSelected,
  };
};

export const FABRIQUE_MODAL_DIALOG_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.FABRIQUE_MODAL_DIALOG,
    css: BadgeCss,
    pages: [MarketplacePage.FABRIQUE],
    defaultState: {},
    variations: fabriqueModalDialogVariationRegistry,
  };

export const FABRIQUE_MODAL_DIALOG_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <ModalDialog
      {...componentProps}
      onCancel={() => {}}
      onClose={() => {}}
      onConfirm={() => {}}
    />
  );
});
