import { Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import chroma from 'chroma-js';

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
    --color-error-background: ${chroma(theme.palette.error.main).alpha(0.1)};
    --color-error-alert: ${chroma(theme.palette.error.main).darken(2.6)};
    --color-error-main: ${theme.palette.error.main};
    --color-info-contrastText: ${theme.palette.info.contrastText};
    --color-info-dark: ${theme.palette.info.dark};
    --color-info-light: ${theme.palette.info.light};
    --color-info-main: ${theme.palette.info.main};
    --color-info-background: ${chroma(theme.palette.info.main).alpha(0.1)};
    --color-info-alert: ${chroma(theme.palette.info.main).darken(2.6)};
    --color-primary-contrastText: ${theme.palette.primary.contrastText};
    --color-primary-dark: ${theme.palette.primary.dark};
    --color-primary-light: ${theme.palette.primary.light};
    --color-primary-main: ${theme.palette.primary.main};
    --color-primary-main-background: ${chroma(theme.palette.primary.main).alpha(
      0.1,
    )};
    --color-secondary-contrastText: ${theme.palette.secondary.contrastText};
    --color-secondary-dark: ${theme.palette.secondary.dark};
    --color-secondary-light: ${theme.palette.secondary.light};
    --color-secondary-main: ${theme.palette.secondary.main};
    --color-success-contrastText: ${theme.palette.success.contrastText};
    --color-success-dark: ${theme.palette.success.dark};
    --color-success-light: ${theme.palette.success.light};
    --color-success-background: ${chroma(theme.palette.success.main).alpha(
      0.1,
    )};
    --color-success-alert: ${chroma(theme.palette.success.main).darken(2.6)};
    --color-success-main: ${theme.palette.success.main};
    --color-warning-light: ${theme.palette.warning.light};
    --color-warning-background: ${chroma(theme.palette.warning.main).alpha(
      0.1,
    )};
    --color-warning-alert: ${chroma(theme.palette.warning.main).darken(2.6)};
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
    --color-scrollbar-track: #eeeeee;
    --color-scrollbar-thumb: #bdbdbd;
    /* breakpoints */
    --breakpoints-xs: ${theme.breakpoints.values.xs};
    --breakpoints-sm: ${theme.breakpoints.values.sm};
    --breakpoints-md: ${theme.breakpoints.values.md};
    --breakpoints-lg: ${theme.breakpoints.values.lg};
    --breakpoints-xl: ${theme.breakpoints.values.xl};

    /* shape */
    --border-radius-1: ${theme.shape.borderRadius}px;
    --border-color: #F1F3F4;
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
    --button-height: 2.25rem;
    --button-icon-height: 3rem;


    /* FABRIQUE COLOR PALETTE */
    /* FABRIQUE COLOR PALETTE - GREY */
    --bs-grey-50: #FAFAFA;
    --bs-grey-100: #EFEFEF;
    --bs-grey-300: #E0E0E0;
    --bs-grey-400: #BDBDBD;
    --bs-grey-500: #9E9E9E;
    --bs-grey-600: #757575;
    --bs-grey-700: #616161;
    --bs-grey-800: #424242;
    --bs-grey-850: #2B2B2B;
    --bs-grey-900: #212121;
    --bs-grey-0: #FFFFFF;
    --bs-grey-1000: #000000;
    --bs-grey-alpha-100a: #EFEFEF7F;
    --bs-grey-alpha-300a: #E0E0E066;
    --bs-grey-alpha-400a: #BDBDBD99;
    --bs-grey-alpha-500a: #9E9E9EB2;
    --bs-grey-alpha-800a: #424242CC;

    /* FABRIQUE COLOR PALETTE - ORANGE */
    --bs-orange-50: #FFF7EB;
    --bs-orange-100: #FFF2CC;
    --bs-orange-300: #FFCD66;
    --bs-orange-500: #FF9800;
    --bs-orange-600: #DB7900;
    --bs-orange-800: #934500;

    /* FABRIQUE COLOR PALETTE - BLUE */
    --bs-blue-100: #EEF7FE;
    --bs-blue-300: #64B6F7;
    --bs-blue-500: #2196F3;
    --bs-blue-600: #0B79D0;
    --bs-blue-650: #046DC8;
    --bs-blue-800: #0D3C61;

    /* FABRIQUE COLOR PALETTE - GREEN */
    --bs-green-50: #F1F9F1;
    --bs-green-100: #CFE5CF;
    --bs-green-200: #A0D9A0;
    --bs-green-300: #7BC67E;
    --bs-green-500: #4CAF50;
    --bs-green-600: #3B873E;
    --bs-green-800: #1E4620;

    /* FABRIQUE COLOR PALETTE - RED */
    --bs-red-100: #FFF0EF;
    --bs-red-200: #F88078;
    --bs-red-300: #F44336;
    --bs-red-500: #E31B0C;
    --bs-red-600: #A60D02;
    --bs-red-800: #621B16;

    /* FABRIQUE COLOR PALETTE - BRAND */
    --bs-brand-main: ${theme.palette.primary.main};
    --bs-brand-main-strong: ${theme.palette.primary.dark};
    --bs-brand-main-stronger: ${chroma(theme.palette.primary.dark).darken(1)};
    --bs-brand-main-strongest: ${chroma(theme.palette.primary.dark).darken(2)};
    --bs-brand-main-weak: ${theme.palette.primary.light};
    --bs-brand-main-weaker: ${chroma(theme.palette.primary.light).alpha(0.2)};
    --bs-brand-main-weakest: ${chroma(theme.palette.primary.light).alpha(0.1)};

    --bs-brand-secondary: ${theme.palette.secondary.main};
    --bs-brand-secondary-strong: ${theme.palette.secondary.dark};
    --bs-brand-secondary-stronger: ${chroma(theme.palette.primary.dark).darken(
      1,
    )};
    --bs-brand-secondary-strongest ${chroma(theme.palette.primary.dark).darken(
      1,
    )};
    --bs-brand-secondary-weak: ${theme.palette.secondary.light};
    --bs-brand-secondary-weaker: ${chroma(theme.palette.secondary.light).alpha(
      0.2,
    )};
    --bs-brand-secondary-weakest: ${chroma(theme.palette.secondary.light).alpha(
      0.1,
    )};  

    /* FABRIQUE SPACING */
    --bs-space-size-1: 4px;

    /* FABRIQUE BORDER RADIUS */
    --bs-border-radius-button-lg: 10px;
    --bs-border-radius-circle: 999px;
    --bs-border-radius-pill: 99px;
    --bs-border-radius-lg: 12px;
    --bs-border-radius-md: 8px;
    --bs-border-radius-sm: 6px;
    --bs-border-radius-xs: 4px;

    /* FABRIQUE TYPOGRAPHY */
    --bs-font-family : "Hanken Grotesk", sans-serif;
    --bs-font-size-display-lg: 6rem;
    --bs-font-size-display-md: 3.75rem;
    --bs-font-size-display-sm: 3rem;
    --bs-font-size-title-lg: 2rem;
    --bs-font-size-title-md: 1.5rem;
    --bs-font-size-title-sm: 1.25rem;
    --bs-font-size-body-lg: 1.12rem;
    --bs-font-size-body-md: 1rem;
    --bs-font-size-body-sm: 0.88rem;
    --bs-font-size-body-xs: 0.75rem;
    --bs-font-size-body-2xs: 0.62rem;

    /* FABRIQUE SHADOW */
    --bs-shadow-xs:  0px 2px 4px rgba(0, 0, 0, 0.04), 0px 0px 6px rgba(0, 0, 0, 0.02);
    --bs-shadow-s:  0px 2px 6px rgba(0, 0, 0, 0.08), 0px 0px 6px rgba(0, 0, 0, 0.02);
    --bs-shadow-m:  0px 4px 8px rgba(0, 0, 0, 0.06), 0px 0px 4px rgba(0, 0, 0, 0.04);
    --bs-shadow-l:  0px 8px 16px rgba(0, 0, 0, 0.08), 0px 0px 4px rgba(0, 0, 0, 0.04);
    --bs-footer-shadow:  0px 4px 8px rgba(0, 0, 0, 0.06), 0px -4px 4px rgba(0, 0, 0, 0.04);

    /* FABRIQUE TRANSITIONS */
    --bs-transition-duration-quick:50ms;
    --bs-transition-duration-normal:100ms;
    --bs-transition-duration-slow:200ms;
    --bs-transition-duration-slower:300ms;
  `;

  // Inside the 'id' section, we define styles that will be applied to the 'div' element with the id 'bs-setup-derived-variable'.
  // 'position:relative' is utilized to establish a new stacking context, enabling absolute positioning of DOM elements within this context.
  // Additionally, the 'div' has a hidden overflow, preventing its direct content from being scrollable (although its child components can still be configured to be scrollable).
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

    /* FABRIQUE DERIVED VARIABLES - ACTION COLORS */
    /* FABRIQUE DERIVED VARIABLES - ACTION COLORS - DEFAULT */
    --bs-color-action-light: var(--bs-grey-0);
    --bs-color-action-disabled: var(--bs-grey-alpha-100a);
    --bs-color-action-grey-default: var(--bs-grey-800);
    --bs-color-action-grey-hovered: var(--bs-grey-500);
    --bs-color-action-grey-pressed: var(--bs-grey-800);
    --bs-color-action-grey-weak-hovered: var(--bs-grey-100);
    --bs-color-action-grey-weak-pressed: var(--bs-grey-300);
    --bs-color-action-inverse-default: var(--bs-grey-0);
    --bs-color-action-inverse-hovered: var(--bs-grey-alpha-300a);
    --bs-color-action-inverse-pressed: var(--bs-grey-alpha-400a);
    --bs-color-action-info-default: var(--bs-blue-500);
    --bs-color-action-info-hovered: var(--bs-blue-300);
    --bs-color-action-info-pressed: var(--bs-blue-600);
    --bs-color-action-info-weak-hovered: var(--bs-blue-100);
    --bs-color-action-info-weak-pressed: var(--bs-blue-300);
    --bs-color-action-success-default: var(--bs-green-500);
    --bs-color-action-success-hovered: var(--bs-green-300);
    --bs-color-action-success-pressed: var(--bs-green-800);
    --bs-color-action-success-weak-hovered: var(--bs-green-100);
    --bs-color-action-success-weak-pressed: var(--bs-green-300);
    --bs-color-action-warning-default: var(--bs-orange-600);
    --bs-color-action-warning-hovered: var(--bs-orange-500);
    --bs-color-action-warning-pressed: var(--bs-orange-800);
    --bs-color-action-warning-weak-hovered: var(--bs-orange-50);
    --bs-color-action-warning-weak-pressed: var(--bs-orange-100);
    --bs-color-action-error-default: var(--bs-red-500);
    --bs-color-action-error-hovered: var(--bs-red-300);
    --bs-color-action-error-pressed: var(--bs-red-600);
    --bs-color-action-error-weak-hovered: var(--bs-red-100);
    --bs-color-action-error-weak-pressed: var(--bs-red-200);

    /* FABRIQUE DERIVED VARIABLES - ACTION COLORS - BRAND */

    --bs-color-action-brand-main: var(--bs-brand-main);
    --bs-color-action-brand-main-hovered: var(--bs-brand-main-weak);
    --bs-color-action-brand-main-pressed: var(--bs-brand-main-strong);
    --bs-color-action-brand-main-selected: var(--bs-brand-main-strong);

    --bs-color-action-brand-secondary: var(--bs-brand-secondary);
    --bs-color-action-brand-secondary-hovered: var(--bs-brand-secondary-weak);
    --bs-color-action-brand-secondary-pressed: var(--bs-brand-secondary-strong);
    --bs-color-action-brand-secondary-selected: var(--bs-brand-secondary-strong);

    /* FABRIQUE DERIVED VARIABLES - BACKGROUND COLORS */
    /* FABRIQUE DERIVED VARIABLES - BACKGROUND COLORS - BRAND */
    --bs-color-background-brand-main: var(--bs-brand-main);
    --bs-color-background-brand-main-weak: var(--bs-brand-main-weak);
    --bs-color-background-brand-main-weaker: var(--bs-brand-main-weaker);
    --bs-color-background-brand-main-weakest: var(--bs-brand-main-weakest);
    --bs-color-background-brand-main-selected: var(--bs-brand-main-strong);
    --bs-color-background-brand-main-stronger: var(--bs-brand-main-stronger);
    --bs-color-background-brand-main-strongest: var(--bs-brand-main-strongest);
    
    --bs-color-background-brand-secondary: var(--bs-brand-secondary);
    --bs-color-background-brand-secondary-weak: var(--bs-brand-secondary-weak);
    --bs-color-background-brand-secondary-weaker: var(--bs-brand-secondary-weaker);
    --bs-color-background-brand-secondary-weakest: var(--bs-brand-secondary-weakest);
    --bs-color-background-brand-secondary-selected:  var(--bs-brand-secondary-strong);

    --bs-color-background-disabled: var(--bs-grey-alpha-100a);
    --bs-color-background-grey-default: var(--bs-grey-800);
    --bs-color-background-grey-weak: var(--bs-grey-100);
    --bs-color-background-inverse-default: var(--bs-grey-0);
    --bs-color-background-info-default: var(--bs-blue-500);
    --bs-color-background-info-weak: var(--bs-blue-100);
    --bs-color-background-light: var(--bs-grey-0);
    --bs-color-background-success-default: var(--bs-green-600);
    --bs-color-background-success-weak: var(--bs-green-50);
    --bs-color-background-warning-default: var(--bs-orange-600);
    --bs-color-background-warning-weak: var(--bs-orange-50);
    --bs-color-background-error-default: var(--bs-red-500);
    --bs-color-background-error-weak: var(--bs-red-100);

    /* FABRIQUE DERIVED VARIABLES - BORDER COLORS */
    --bs-color-border-brand-main: var(--bs-brand-main);
    --bs-color-border-brand-main-strong: var(--bs-brand-main-strong);
    --bs-color-border-brand-main-weak: var(--bs-brand-main-weak);
    
    --bs-color-border-brand-secondary: var(--bs-brand-secondary);
    --bs-color-border-brand-secondary-strong: var(--bs-brand-secondary-strong);
    --bs-color-border-brand-secondary-weak: var(--bs-brand-secondary-weak);

    --bs-color-border-default: var(--bs-grey-alpha-500a);
    --bs-color-border-weak: var(--bs-grey-alpha-300a);
    --bs-color-border-strong: var(--bs-grey-800);
    --bs-color-border-inverse-default: var(--bs-grey-0);
    --bs-color-border-disabled: var(--bs-grey-alpha-400a);
    --bs-color-border-status-info-strong: var(--bs-blue-800);
    --bs-color-border-status-info-weak: var(--bs-blue-600);
    --bs-color-border-status-success-strong: var(--bs-green-800);
    --bs-color-border-status-success-weak: var(--bs-green-600);
    --bs-color-border-status-warning-strong: var(--bs-orange-800);
    --bs-color-border-status-warning-weak: var(--bs-orange-600);
    --bs-color-border-status-error-strong: var(--bs-red-600);
    --bs-color-border-status-error-weak: var(--bs-red-500);

    /* FABRIQUE DERIVED VARIABLES - TEXT COLORS */
    --bs-color-text-brand-main: var(--bs-brand-main);
    --bs-color-text-brand-main-strong: var(--bs-brand-main-strong);
    --bs-color-text-brand-main-weak: var(--bs-brand-main-weak);
    
    --bs-color-text-brand-secondary: var(--bs-brand-secondary);
    --bs-color-text-brand-secondary-strong: var(--bs-brand-secondary-strong);
    --bs-color-text-brand-secondary-weak: var(--bs-brand-secondary-weak);

    --bs-color-text-default: var(--bs-grey-850);
    --bs-color-text-weak: var(--bs-grey-700);
    --bs-color-text-weaker: var(--bs-grey-600);
    --bs-color-text-weakest: var(--bs-grey-400);
    --bs-color-text-disabled: var(--bs-grey-alpha-400a);
    --bs-color-text-inverse-default: var(--bs-grey-0);
    --bs-color-text-inverse-hover: var(--bs-grey-alpha-400a);
    --bs-color-text-info-strong: var(--bs-blue-800);
    --bs-color-text-selected: var(--bs-brand-main);
    --bs-color-text-info-weak: var(--bs-blue-600);
    --bs-color-text-success-strong: var(--bs-green-800);
    --bs-color-text-success-weak: var(--bs-green-600);
    --bs-color-text-warning-strong: var(--bs-orange-800);
    --bs-color-text-warning-weak: var(--bs-orange-600);
    --bs-color-text-error-strong: var(--bs-red-600);
    --bs-color-text-error-weak: var(--bs-red-500);
    --bs-color-text-on-strong: var(--bs-grey-0);

    /* FABRIQUE DERIVED VARIABLES - LINK COLORS */
    --bs-color-link-link: var(--bs-blue-600);
    --bs-color-link-hover: var(--bs-blue-500);
    --bs-color-icon-default: var(--bs-grey-850);
    --bs-color-link-pressed: var(--bs-blue-800);
    
    /* FABRIQUE DERIVED VARIABLES - ICON COLORS */
    --bs-color-icon-brand-main: var(--bs-brand-main);
    --bs-color-icon-brand-main-strong: var(--bs-brand-main-strong);
    --bs-color-icon-brand-main-weak: var(--bs-brand-main-weak);

    --bs-color-icon-brand-secondary: var(--bs-brand-main);
    --bs-color-icon-brand-secondary-strong: var(--bs-brand-secondary-strong);
    --bs-color-icon-brand-secondary-weak: var(--bs-brand-secondary-weak);

    --bs-color-icon-weak: var(--bs-grey-700);
    --bs-color-icon-weaker: var(--bs-grey-600);
    --bs-color-icon-weakest: var(--bs-grey-400);
    --bs-color-icon-disabled: var(--bs-grey-alpha-300a);
    --bs-color-icon-on-button-disabled: var(--bs-grey-alpha-400a);
    --bs-color-icon-inverse-default: var(--bs-grey-0);
    --bs-color-icon-inverse-hover: var(--bs-grey-alpha-400a);
    --bs-color-icon-brand-main-weak: var(--bs-brand-main-weak);
    --bs-color-icon-selected: var(--bs-brand-main);
    --bs-color-icon-on-strong: var(--bs-grey-0);
    --bs-color-icon-status-info-strong: var(--bs-blue-800);
    --bs-color-icon-onweak: var(--bs-grey-800);
    --bs-color-icon-status-info-weak: var(--bs-blue-600);
    --bs-color-icon-status-success-strong: var(--bs-green-800);
    --bs-color-icon-status-success-weak: var(--bs-green-600);
    --bs-color-icon-status-warning-strong: var(--bs-orange-800);
    --bs-color-icon-status-warning-weak: var(--bs-orange-600);
    --bs-color-icon-status-error-strong: var(--bs-red-600);
    --bs-color-icon-status-error-weak: var(--bs-red-500);

    /* FABRIQUE DERIVED VARIABLES - SPACING */
    --bs-space-size-18: calc(var(--bs-space-size-1) * 18);
    --bs-space-size-8: calc(var(--bs-space-size-1) * 8);
    --bs-space-size-6: calc(var(--bs-space-size-1) * 6);
    --bs-space-size-4: calc(var(--bs-space-size-1) * 4);
    --bs-space-size-3: calc(var(--bs-space-size-1) * 3);
    --bs-space-size-2: calc(var(--bs-space-size-1) * 2);

    font-family: var(--fontFamily);
    width: 100%;
    background-color: var(--color-background);
    position: relative;
    overflow: hidden;
  `;

  return {
    classes,
    id,
  };
};
