import {
  TypographyTextAlign,
  TypographyVariantRoot,
  TypographySize,
  TypographyColor,
} from './constants';

export type TypographyTextAlignType =
  | `${TypographyTextAlign.INHERIT}`
  | `${TypographyTextAlign.LEFT}`
  | `${TypographyTextAlign.CENTER}`
  | `${TypographyTextAlign.RIGHT}`
  | `${TypographyTextAlign.JUSTIFY}`;

export type TypographyVariantType =
  | `${TypographyVariantRoot.DISPLAY}-${TypographySize.LG}`
  | `${TypographyVariantRoot.DISPLAY}-${TypographySize.MD}`
  | `${TypographyVariantRoot.DISPLAY}-${TypographySize.SM}`
  | `${TypographyVariantRoot.TITLE}-${TypographySize.LG}`
  | `${TypographyVariantRoot.TITLE}-${TypographySize.MD}`
  | `${TypographyVariantRoot.TITLE}-${TypographySize.SM}`
  | `${TypographyVariantRoot.BODY}-${TypographySize.LG}`
  | `${TypographyVariantRoot.BODY}-${TypographySize.MD}`
  | `${TypographyVariantRoot.BODY}-${TypographySize.SM}`
  | `${TypographyVariantRoot.BODY}-${TypographySize.XS}`
  | `${TypographyVariantRoot.BODY}-${TypographySize.TWOXS}`;

export type TypographyColorType =
  | `${TypographyColor.DEFAULT}`
  | `${TypographyColor.ERROR}`
  | `${TypographyColor.PRIMARY}`
  | `${TypographyColor.SECONDARY}`
  | `${TypographyColor.SUCCESS}`;
