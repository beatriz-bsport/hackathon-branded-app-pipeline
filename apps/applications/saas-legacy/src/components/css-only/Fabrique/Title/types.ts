import { TypographyVariantType } from '#Fabrique/Typography/types';
import { TitleSize } from './constants';

export type TitleVariantType =
  | `${TitleSize.LG}`
  | `${TitleSize.MD}`
  | `${TitleSize.SM}`
  | `${TitleSize.XS}`;

type ArrowClassNameType =
  | 'bs-fabrique-title__arrow--md'
  | 'bs-fabrique-title__arrow--sm';

export type TitleMapType = {
  arrowClassName: ArrowClassNameType;
  titleClassName: TypographyVariantType;
  subtitleClassName: TypographyVariantType;
};
