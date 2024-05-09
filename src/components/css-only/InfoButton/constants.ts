export enum InfoButtonSeverityEnum {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export const TOOLTIP_ICON_CLASSNAME_MAP = {
  [`${InfoButtonSeverityEnum.INFO}`]: 'bs-info-button__tooltip__icon--info',
  [`${InfoButtonSeverityEnum.ERROR}`]: 'bs-info-button__tooltip__icon--error',
  [`${InfoButtonSeverityEnum.WARNING}`]:
    'bs-info-button__tooltip__icon--warning',
};
