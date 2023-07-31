import { Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

export const useMuiThemeToCssVars = () => {
  const theme: Theme = useTheme();

  if (!theme)
    return {
      width: '100%',
    };
  const classes = `
    /* typography */
    --fontFamily: ${theme.typography.fontFamily};
    --fontSize: ${theme.typography.fontSize};
    --fontWeightBold: ${theme.typography.fontWeightBold};
    --fontWeightLight: ${theme.typography.fontWeightLight};
    --fontWeightMedium: ${theme.typography.fontWeightMedium};
    --fontWeightRegular: ${theme.typography.fontWeightRegular};
    --body1-fontSize: ${theme.typography.body1.fontSize};
    --body1-fontWeight: ${theme.typography.body1.fontWeight};
    --body1-letterSpacing: ${theme.typography.body1.letterSpacing};
    --body1-lineHeight: ${theme.typography.body1.lineHeight};
    --subtitle1-fontSize: ${theme.typography.subtitle1.fontSize};
    --subtitle1-fontWeight: ${theme.typography.subtitle1.fontWeight};
    --subtitle1-letterSpacing: ${theme.typography.subtitle1.letterSpacing};
    --subtitle1-lineHeight: ${theme.typography.subtitle1.lineHeight};
    --subtitle2-fontSize: ${theme.typography.subtitle2.fontSize};
    --subtitle2-fontWeight: ${theme.typography.subtitle2.fontWeight};
    --subtitle2-letterSpacing: ${theme.typography.subtitle2.letterSpacing};
    --subtitle2-lineHeight: ${theme.typography.subtitle2.lineHeight};
    --body2-fontSize: ${theme.typography.body2.fontSize};
    --body2-fontWeight: ${theme.typography.body2.fontWeight};
    --body2-letterSpacing: ${theme.typography.body2.letterSpacing};
    --body2-lineHeight: ${theme.typography.body2.lineHeight};
    --button-fontSize: ${theme.typography.button.fontSize};
    --button-fontWeight: ${theme.typography.button.fontWeight};
    --button-letterSpacing: ${theme.typography.button.letterSpacing};
    --button-lineHeight: ${theme.typography.button.lineHeight};
    --caption-fontSize: ${theme.typography.caption.fontSize};
    --caption-fontWeight: ${theme.typography.caption.fontWeight};
    --caption-letterSpacing: ${theme.typography.caption.letterSpacing};
    --caption-lineHeight: ${theme.typography.caption.lineHeight};
    --h1-fontSize: ${theme.typography.h1.fontSize};
    --h1-fontWeight: ${theme.typography.h1.fontWeight};
    --h1-letterSpacing: ${theme.typography.h1.letterSpacing};
    --h1-lineHeight: ${theme.typography.h1.lineHeight};
    --h2-fontSize: ${theme.typography.h2.fontSize};
    --h2-fontWeight: ${theme.typography.h2.fontWeight};
    --h2-letterSpacing: ${theme.typography.h2.letterSpacing};
    --h2-lineHeight: ${theme.typography.h2.lineHeight};
    --h3-fontSize: ${theme.typography.h3.fontSize};
    --h3-fontWeight: ${theme.typography.h3.fontWeight};
    --h3-letterSpacing: ${theme.typography.h3.letterSpacing};
    --h3-lineHeight: ${theme.typography.h3.lineHeight};
    --h4-fontSize: ${theme.typography.h4.fontSize};
    --h4-fontWeight: ${theme.typography.h4.fontWeight};
    --h4-letterSpacing: ${theme.typography.h4.letterSpacing};
    --h4-lineHeight: ${theme.typography.h4.lineHeight};
    --h5-fontSize: ${theme.typography.h5.fontSize};
    --h5-fontWeight: 500;
    --h5-letterSpacing: ${theme.typography.h5.letterSpacing};
    --h5-lineHeight: ${theme.typography.h5.lineHeight};
    --h6-fontSize: ${theme.typography.h6.fontSize};
    --h6-fontWeight: ${theme.typography.h6.fontWeight};
    --h6-letterSpacing: ${theme.typography.h6.letterSpacing};
    --h6-lineHeight: ${theme.typography.h6.lineHeight};
    /* palette */
    --color-divider: ${theme.palette.divider};
    --color-activatedOpacity: ${theme.palette.action.activatedOpacity};
    --color-active: ${theme.palette.action.active};
    --color-disabled: ${theme.palette.action.disabled};
    --color-disabledBackground: ${theme.palette.action.disabledBackground};
    --color-disabledOpacity: ${theme.palette.action.disabledOpacity};
    --color-focus: ${theme.palette.action.focus};
    --color-focusOpacity: ${theme.palette.action.focusOpacity};
    --color-hover: ${theme.palette.action.hover};
    --color-hoverOpacity: ${theme.palette.action.hoverOpacity};
    --color-selected: ${theme.palette.action.selected};
    --color-selectedOpacity: ${theme.palette.action.selectedOpacity};
    --color-background-paper: ${theme.palette.background.paper};
    --color-secondary-background-paper: #f6f8fa;
    --color-secondary-background-paper-transparent: #a1b3c71a;
    --color-background: #ffffff00;
    --color-error-contrastText: ${theme.palette.error.contrastText};
    --color-error-dark: ${theme.palette.error.dark};
    --color-error-light: ${theme.palette.error.light};
    /* adding 19 at the end of a color sets the opacity to have a background effect */
    --color-error-background: ${theme.palette.error.main}19;
    --color-error-main: ${theme.palette.error.main};
    --color-info-contrastText: ${theme.palette.info.contrastText};
    --color-info-dark: ${theme.palette.info.dark};
    --color-info-light: ${theme.palette.info.light};
    --color-info-main: ${theme.palette.info.main};
    --color-info-alert: #0D3C61;
    --color-primary-contrastText: ${theme.palette.primary.contrastText};
    --color-primary-dark: ${theme.palette.primary.dark};
    --color-primary-light: ${theme.palette.primary.light};
    --color-primary-main: ${theme.palette.primary.main};
    --color-primary-main-background: ${theme.palette.primary.main}19;
    --color-secondary-contrastText: ${theme.palette.secondary.contrastText};
    --color-secondary-dark: ${theme.palette.secondary.dark};
    --color-secondary-light: ${theme.palette.secondary.light};
    --color-secondary-main: ${theme.palette.secondary.main};
    --color-success-contrastText: ${theme.palette.success.contrastText};
    --color-success-dark: ${theme.palette.success.dark};
    --color-success-light: ${theme.palette.success.light};
    --color-success-background: ${theme.palette.success.main}19;
    --color-success-main: ${theme.palette.success.main};
    --color-warning-light: ${theme.palette.warning.light};
    --color-warning-background: ${theme.palette.warning.main}19;
    --color-warning-main: ${theme.palette.warning.main};
    --color-grey-50: ${theme.palette.grey[50]};
    --color-grey-100: ${theme.palette.grey[100]};
    --color-grey-200: ${theme.palette.grey[200]};
    --color-grey-300: ${theme.palette.grey[300]};
    --color-grey-400: ${theme.palette.grey[400]};
    --color-grey-500: ${theme.palette.grey[500]};
    --color-grey-600: ${theme.palette.grey[600]};
    --color-grey-700: ${theme.palette.grey[700]};
    --color-grey-800: ${theme.palette.grey[800]};
    --color-grey-900: ${theme.palette.grey[900]};
    --color-grey-A100: ${theme.palette.grey.A100};
    --color-grey-A200: ${theme.palette.grey.A200};
    --color-grey-A400: ${theme.palette.grey.A400};
    --color-grey-A700: ${theme.palette.grey.A700};
    --color-grey-dark: #2D3748;
    --color-grey-main: #687586;
    --color-grey-light: #F1F3F4;
    --color-text-disabled: ${theme.palette.text.disabled};
    --color-text-hint: ${theme.palette.text.hint};
    --color-text-primary: ${theme.palette.text.primary};
    --color-text-secondary: ${theme.palette.text.secondary};
    /* breakpoints */
    --breakpoints-xs: ${theme.breakpoints.values.xs};
    --breakpoints-sm: ${theme.breakpoints.values.sm};
    --breakpoints-md: ${theme.breakpoints.values.md};
    --breakpoints-lg: ${theme.breakpoints.values.lg};
    --breakpoints-xl: ${theme.breakpoints.values.xl};

    /* shape */
    --border-radius-1: ${theme.shape.borderRadius}px;
    /* transition */
    --duration-complex: ${theme.transitions.duration.complex};
    --duration-enteringScreen: ${theme.transitions.duration.enteringScreen};
    --duration-leavingScreen: ${theme.transitions.duration.leavingScreen};
    --duration-short: ${theme.transitions.duration.short};
    --duration-shorter: ${theme.transitions.duration.shorter};
    --duration-shortest: ${theme.transitions.duration.shortest};
    --duration-standard: ${theme.transitions.duration.standard};
    --easing-easeIn: ${theme.transitions.easing.easeIn};
    --easing-easeInOut: ${theme.transitions.easing.easeInOut};
    --easing-easeOut: ${theme.transitions.easing.easeOut};
    --easing-sharp: ${theme.transitions.easing.sharp};

    /* z-index */
    --z-index-appBar: ${theme.zIndex.appBar};
    --z-index-drawer: ${theme.zIndex.drawer};
    --z-index-mobileStepper: ${theme.zIndex.mobileStepper};
    --z-index-modal: ${theme.zIndex.modal};
    --z-index-snackbar: ${theme.zIndex.snackbar};
    --z-index-speedDial: ${theme.zIndex.speedDial};
    --z-index-tooltip: ${theme.zIndex.tooltip};

    /* z-shadows */
    --shadow-0: ${theme.shadows[0]};
    --shadow-1: ${theme.shadows[1]};
    --shadow-2: ${theme.shadows[2]};
    --shadow-3: ${theme.shadows[3]};
    --shadow-4: ${theme.shadows[4]};
    --shadow-5: ${theme.shadows[5]};
    --shadow-6: ${theme.shadows[6]};
    --shadow-7: ${theme.shadows[7]};
    --shadow-8: ${theme.shadows[8]};
    --shadow-9: ${theme.shadows[9]};
    --shadow-10: ${theme.shadows[10]};
    --shadow-11: ${theme.shadows[11]};
    --shadow-12: ${theme.shadows[12]};
    --shadow-13: ${theme.shadows[13]};
    --shadow-14: ${theme.shadows[14]};
    --shadow-15: ${theme.shadows[15]};
    --shadow-16: ${theme.shadows[16]};
    --shadow-17: ${theme.shadows[17]};
    --shadow-18: ${theme.shadows[18]};
    --shadow-19: ${theme.shadows[19]};
    --shadow-20: ${theme.shadows[20]};
    --shadow-21: ${theme.shadows[21]};
    --shadow-22: ${theme.shadows[22]};
    --shadow-23: ${theme.shadows[23]};
    --shadow-24: ${theme.shadows[24]};

    /* spacing */
    --spacing-0: 0px;
    --spacing-1: ${theme.spacing(1)}px;
  `;

  const id = `
    --body1-fontFamily: var(--fontFamily);
    --body2-fontFamily: var(--fontFamily);
    --button-fontFamily: var(--fontFamily);
    --caption-fontFamily: var(--fontFamily);
    --h1-fontFamily: var(--fontFamily);
    --h2-fontFamily: var(--fontFamily);
    --h3-fontFamily: var(--fontFamily);
    --h4-fontFamily: var(--fontFamily);
    --h5-fontFamily: var(--fontFamily);
    --h6-fontFamily: var(--fontFamily);
    --border-radius-2: calc(var(--border-radius-1) * 2);
    --border-radius-3: calc(var(--border-radius-1) * 3);
    --border-radius-4: calc(var(--border-radius-1) * 4);
    --border-radius-5: calc(var(--border-radius-1) * 5);
    --border-radius-6: calc(var(--border-radius-1) * 6);
    --border-radius-7: calc(var(--border-radius-1) * 7);
    --border-radius-8: calc(var(--border-radius-1) * 8);
    --border-radius-9: calc(var(--border-radius-1) * 9);
    --border-radius-10: calc(var(--border-radius-1) * 10);
    --spacing-2: calc(var(--spacing-1) * 2);
    --spacing-3: calc(var(--spacing-1) * 3);
    --spacing-4: calc(var(--spacing-1) * 4);
    --spacing-5: calc(var(--spacing-1) * 5);
    --spacing-6: calc(var(--spacing-1) * 6);
    --spacing-7: calc(var(--spacing-1) * 7);
    --spacing-8: calc(var(--spacing-1) * 8);
    --spacing-9: calc(var(--spacing-1) * 9);
    --spacing-10: calc(var(--spacing-1) * 10);
    --spacing-11: calc(var(--spacing-1) * 11);
    --spacing-12: calc(var(--spacing-1) * 12);
    --spacing-13: calc(var(--spacing-1) * 13);
    --spacing-14: calc(var(--spacing-1) * 14);
    --spacing-15: calc(var(--spacing-1) * 15);
    --spacing-16: calc(var(--spacing-1) * 16);


    font-family: var(--fontFamily);
    width: 100%;
    background-color: var(--color-background);
  `;

  return {
    classes,
    id,
  };
};
