import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { TypographyVariant, TypographyTextAlign } from './constants';
import type { TypographyVariantType, TypographyTextAlignType } from './types';

import './styles.css';

type Props = {
  variant: TypographyVariantType;
  align?: TypographyTextAlignType;
  className?: string;
  children: React.ReactNode;
};

const TypographyVariantComponentMap = {
  [TypographyVariant.DISPLAY_LG]: 'h1',
  [TypographyVariant.DISPLAY_MD]: 'h2',
  [TypographyVariant.DISPLAY_SM]: 'h3',
  [TypographyVariant.TITLE_LG]: 'h4',
  [TypographyVariant.TITLE_MD]: 'h5',
  [TypographyVariant.TITLE_SM]: 'h6',
  [TypographyVariant.BODY_LG]: 'p',
  [TypographyVariant.BODY_MD]: 'p',
  [TypographyVariant.BODY_SM]: 'p',
  [TypographyVariant.BODY_XS]: 'p',
  [TypographyVariant.BODY_2XS]: 'p',
} as Record<TypographyVariantType, React.ElementType>;

const TypographyClassNameMap = {
  [TypographyVariant.DISPLAY_LG]: 'bs-typography-display-lg',
  [TypographyVariant.DISPLAY_MD]: 'bs-typography-display-md',
  [TypographyVariant.DISPLAY_SM]: 'bs-typography-display-sm',
  [TypographyVariant.TITLE_LG]: 'bs-typography-title-lg',
  [TypographyVariant.TITLE_MD]: 'bs-typography-title-md',
  [TypographyVariant.TITLE_SM]: 'bs-typography-title-sm',
  [TypographyVariant.BODY_LG]: 'bs-typography-body-lg',
  [TypographyVariant.BODY_MD]: 'bs-typography-body-md',
  [TypographyVariant.BODY_SM]: 'bs-typography-body-sm',
  [TypographyVariant.BODY_XS]: 'bs-typography-body-xs',
  [TypographyVariant.BODY_2XS]: 'bs-typography-body-2xs',
};

const TypographyTextAlignClassNameMap = {
  [TypographyTextAlign.INHERIT]: 'bs-typography-text-align-inherit',
  [TypographyTextAlign.LEFT]: 'bs-typography-text-align-left',
  [TypographyTextAlign.CENTER]: 'bs-typography-text-align-center',
  [TypographyTextAlign.RIGHT]: 'bs-typography-text-align-right',
  [TypographyTextAlign.JUSTIFY]: 'bs-typography-text-align-justify',
};

export const Typography: React.FC<Props> = ({
  variant = TypographyVariant.BODY_MD,
  className,
  align = TypographyTextAlign.INHERIT,
  children,
}) => {
  const Component =
    TypographyVariantComponentMap[variant] ?? ('p' as React.ElementType);

  const ComponentClassName = TypographyClassNameMap[variant];

  const TextAlignClassName = TypographyTextAlignClassNameMap[align];

  return (
    <Component
      className={classNames(ComponentClassName, TextAlignClassName, className)}
    >
      {children}
    </Component>
  );
};

export const TypographyStorybook = marketplaceCssHoc()(Typography);

export default React.memo(Typography);
