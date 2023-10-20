export enum TypographyVariantRoot {
  DISPLAY = 'display',
  TITLE = 'title',
  BODY = 'body',
}

export enum TypographySize {
  LG = 'lg',
  MD = 'md',
  SM = 'sm',
  XS = 'xs',
  TWOXS = '2xs',
}

export enum TypographyVariant {
  DISPLAY_LG = `${TypographyVariantRoot.DISPLAY}-${TypographySize.LG}`,
  DISPLAY_MD = `${TypographyVariantRoot.DISPLAY}-${TypographySize.MD}`,
  DISPLAY_SM = `${TypographyVariantRoot.DISPLAY}-${TypographySize.SM}`,
  TITLE_LG = `${TypographyVariantRoot.TITLE}-${TypographySize.LG}`,
  TITLE_MD = `${TypographyVariantRoot.TITLE}-${TypographySize.MD}`,
  TITLE_SM = `${TypographyVariantRoot.TITLE}-${TypographySize.SM}`,
  BODY_LG = `${TypographyVariantRoot.BODY}-${TypographySize.LG}`,
  BODY_MD = `${TypographyVariantRoot.BODY}-${TypographySize.MD}`,
  BODY_SM = `${TypographyVariantRoot.BODY}-${TypographySize.SM}`,
  BODY_XS = `${TypographyVariantRoot.BODY}-${TypographySize.XS}`,
  BODY_2XS = `${TypographyVariantRoot.BODY}-${TypographySize.TWOXS}`,
}

export enum TypographyTextAlign {
  INHERIT = 'inherit',
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFY = 'justify',
}
