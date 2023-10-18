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
    --grey-50: #FAFAFA;
    --grey-100: #EFEFEF;
    --grey-300: #E0E0E0;
    --grey-400: #BDBDBD;
    --grey-500: #9E9E9E;
    --grey-600: #757575;
    --grey-700: #616161;
    --grey-800: #424242;
    --grey-850: #2B2B2B;
    --grey-900: #212121;
    --grey-0: #FFFFFF;
    --grey-1000: #000000;
    --grey-alpha-100a: #EFEFEF7F;
    --grey-alpha-300a: #E0E0E066;
    --grey-alpha-400a: #BDBDBD99;
    --grey-alpha-500a: #9E9E9EB2;
    --grey-alpha-800a: #424242CC;

    /* FABRIQUE COLOR PALETTE - ORANGE */
    --orange-50: #FFF7EB;
    --orange-100: #FFF2CC;
    --orange-300: #FFCD66;
    --orange-500: #FF9800;
    --orange-600: #DB7900;
    --orange-800: #934500;

    /* FABRIQUE COLOR PALETTE - BLUE */
    --blue-100: #EEF7FE;
    --blue-300: #64B6F7;
    --blue-500: #2196F3;
    --blue-600: #0B79D0;
    --blue-650: #046DC8;
    --blue-800: var(--blue-800);

    /* FABRIQUE COLOR PALETTE - GREEN */
    --green-50: #F1F9F1;
    --green-100: #CFE5CF;
    --green-200: #A0D9A0;
    --green-300: #7BC67E;
    --green-500: #4CAF50;
    --green-600: #3B873E;
    --green-800: #1E4620;

    /* FABRIQUE COLOR PALETTE - RED */
    --red-100: #FFF0EF;
    --red-200: #F88078;
    --red-300: #F44336;
    --red-500: #E31B0C;
    --red-600: #A60D02;
    --red-800: #621B16;

    /* FABRIQUE COLOR PALETTE - BRAND */
    --brand-main: ${theme.palette.primary.main};
    --brand-main-strong ${theme.palette.primary.dark};
    --brand-main-weak: ${theme.palette.primary.light};

    --brand-secondary: ${theme.palette.secondary.main};
    --brand-secondary-strong ${theme.palette.secondary.dark};
    --brand-secondary-weak: ${theme.palette.secondary.light};

    /* FABRIQUE SPACING */
    --space-size-1: 4;

    /* FABRIQUE BORDER RADIUS */
    --border-radius-button-lg: 10;
    --border-radius-circle: 999;
    --border-radius-pill: 99;
    --border-radius-lg: 12;
    --border-radius-md: 8;
    --border-radius-sm: 6;
    --border-radius-xs: 4;

    /* FABRIQUE TYPOGRAPHY */
    --font-family : '"Hanken Grotesk", sans-serif';
    --font-size-display-lg: 6rem;
    --font-size-display-md: 3.75rem;
    --font-size-display-sm: 3rem;
    --font-size-title-lg: 2rem;
    --font-size-title-md: 1.5rem;
    --font-size-title-sm: 1.25rem;
    --font-size-body-lg: 1.12rem;
    --font-size-body-md: 1rem;
    --font-size-body-sm: 0.88rem;
    --font-size-body-xs: 0.75rem;
    --font-size-body-2xs: 0.62rem;

    /* FABRIQUE SHADOW */
    --shadow-xs:  0px 2px 4px rgba(0, 0, 0, 0.04), 0px 0px 6px rgba(0, 0, 0, 0.02);
    --shadow-s:  0px 2px 6px rgba(0, 0, 0, 0.08), 0px 0px 6px rgba(0, 0, 0, 0.02);
    --shadow-m:  0px 4px 8px rgba(0, 0, 0, 0.06), 0px 0px 4px rgba(0, 0, 0, 0.04);
    --shadow-l:  0px 8px 16px rgba(0, 0, 0, 0.08), 0px 0px 4px rgba(0, 0, 0, 0.04);
    --footer-shadow:  0px 4px 8px rgba(0, 0, 0, 0.06), 0px -4px 4px rgba(0, 0, 0, 0.04);
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
    --color-action-light: var(--grey-0);
    --color-action-disabled: var(--grey-alpha-100a);
    --color-action-grey-default: var(--grey-800);
    --color-action-grey-hovered: var(--grey-500);
    --color-action-grey-pressed: var(--grey-800);
    --color-action-grey-weak-hovered: var(--grey-100);
    --color-action-grey-weak-pressed: var(--grey-300);
    --color-action-inverse-default: var(--grey-0);
    --color-action-inverse-hovered: var(--grey-alpha-300a);
    --color-action-inverse-pressed: var(--grey-alpha-400a);
    --color-action-info-default: var(--blue-500);
    --color-action-info-hovered: var(--blue-300);
    --color-action-info-pressed: var(--blue-600);
    --color-action-info-weak-hovered: var(--blue-100);
    --color-action-info-weak-pressed: var(--blue-300);
    --color-action-success-default: var(--green-500);
    --color-action-success-hovered: var(--green-300);
    --color-action-success-pressed: var(--green-800);
    --color-action-success-weak-hovered: var(--green-100);
    --color-action-success-weak-pressed: var(--green-300);
    --color-action-warning-default: var(--orange-600);
    --color-action-warning-hovered: var(--orange-500);
    --color-action-warning-pressed: var(--orange-800);
    --color-action-warning-weak-hovered: var(--orange-50);
    --color-action-warning-weak-pressed: var(--orange-100);
    --color-action-error-default: var(--red-500);
    --color-action-error-hovered: var(--red-300);
    --color-action-error-pressed: var(--red-600);
    --color-action-error-weak-hovered: var(--red-100);
    --color-action-error-weak-pressed: var(--red-200);

    /* FABRIQUE DERIVED VARIABLES - ACTION COLORS - BRAND */

    --color-action-brand-main: var(--brand-main);
    --color-action-brand-main-hovered: var(--brand-main-weak);
    --color-action-brand-main-pressed: var(--brand-main-strong);
    --color-action-brand-main-selected: var(--brand-main-strong);

    --color-action-brand-secondary: var(--brand-secondary);
    --color-action-brand-secondary-hovered: var(--brand-secondary-weak); 
    --color-action-brand-secondary-pressed: var(--brand-secondary-strong);
    --color-action-brand-secondary-selected: var(--brand-secondary-strong);

    /* FABRIQUE DERIVED VARIABLES - BACKGROUND COLORS */
    /* FABRIQUE DERIVED VARIABLES - BACKGROUND COLORS - BRAND */
    --color-background-brand-main: var(--brand-main);
    --color-background-brand-main-weak: var(--brand-main-weak);
    --color-background-brand-main-selected: var(--brand-secondary-strong);
    
    --color-background-brand-secondary: var(--brand-main);
    --color-background-brand-secondary-weak: var(--brand-secondary-weak);
    --color-background-brand-secondary-selected:  var(--brand-secondary-strong);

    --color-background-disabled: var(--grey-alpha-100a);
    --color-background-grey-default: var(--grey-800);
    --color-background-grey-weak: var(--grey-100);
    --color-background-inverse-default: var(--grey-0);
    --color-background-info-default: var(--blue-500);
    --color-background-info-weak: var(--blue-100);
    --color-background-light: var(--grey-0);
    --color-background-success-default: var(--green-600);
    --color-background-success-weak: var(--green-50);
    --color-background-warning-default: var(--orange-600);
    --color-background-warning-weak: var(--orange-50);
    --color-background-error-default: var(--red-500);
    --color-background-error-weak: var(--red-100);

    /* FABRIQUE DERIVED VARIABLES - BORDER COLORS */
    --color-border-brand-main: var(--brand-main);
    --color-border-brand-main-strong: var(--brand-main-strong);
    --color-border-brand-main-weak: var(--brand-main-weak);
    
    --color-border-brand-secondary: var(--brand-secondary);
    --color-border-brand-secondary-strong: var(--brand-secondary-strong);
    --color-border-brand-secondary-weak: var(--brand-secondary-weak);

    --color-border-default: var(--grey-alpha-500a);
    --color-border-weak: var(--grey-alpha-300a);
    --color-border-strong: var(--grey-800);
    --color-border-inverse-default: var(--grey-0);
    --color-border-disabled: var(--grey-alpha-400a);
    --color-border-status-info-strong: var(--blue-800);
    --color-border-status-info-weak: var(--blue-600);
    --color-border-status-success-strong: var(--green-800);
    --color-border-status-success-weak: var(--green-600);
    --color-border-status-warning-strong: var(--orange-800);
    --color-border-status-warning-weak: var(--orange-600);
    --color-border-status-error-strong: var(--red-600);
    --color-border-status-error-weak: var(--red-500);

    /* FABRIQUE DERIVED VARIABLES - TEXT COLORS */
    --color-text-brand-main-strong: var(--brand-main-strong);
    --color-text-brand-main-weak: var(--brand-main-weak);
    --color-text-brand-secondary-strong: var(--brand-secondary-strong);
    --color-text-brand-secondary-weak: var(--brand-secondary-weak);
    
    --color-text-default: var(--grey-850);
    --color-text-weak: var(--grey-700);
    --color-text-weaker: var(--grey-600);
    --color-text-weakest: var(--grey-400);
    --color-text-disabled: var(--grey-alpha-400a);
    --color-text-inverse-default: var(--grey-0);
    --color-text-inverse-hover: var(--grey-alpha-400a);
    --color-text-info-strong: var(--blue-800);
    --color-text-selected: var(--brand-main);
    --color-text-info-weak: var(--blue-600);
    --color-text-success-strong: var(--green-800);
    --color-text-success-weak: var(--green-600);
    --color-text-warning-strong: var(--orange-800);
    --color-text-warning-weak: var(--orange-600);
    --color-text-error-strong: var(--red-600);
    --color-text-error-weak: var(--red-500);
    --color-text-onstrong: var(--grey-0);

    /* FABRIQUE DERIVED VARIABLES - LINK COLORS */
    --color-link-link: var(--blue-600);
    --color-link-hover: var(--blue-500);
    --color-icon-default: var(--grey-850);
    --color-link-pressed: var(--blue-800);
    
    /* FABRIQUE DERIVED VARIABLES - ICON COLORS */
    --color-icon-brand-main: var(--brand-main);
    --color-icon-brand-main-strong: var(--brand-main-strong);
    --color-icon-brand-main-weak: var(--brand-main-weak);

    --color-icon-brand-secondary: var(--brand-main);
    --color-icon-brand-secondary-strong: var(--brand-secondary-strong);
    --color-icon-brand-secondary-weak: var(--brand-secondary-weak);

    --color-icon-weak: var(--grey-700);
    --color-icon-weaker: var(--grey-600);
    --color-icon-weakest: var(--grey-400);
    --color-icon-disabled: var(--grey-alpha-300a);
    --color-icon-on-button-disabled: var(--grey-alpha-400a);
    --color-icon-inverse-default: var(--grey-0);
    --color-icon-inverse-hover: var(--grey-alpha-400a);
    --color-icon-brand-main-weak: var(--brand-main-weak);
    --color-icon-selected: var(--brand-main);
    --color-icon-onstrong: var(--grey-0);
    --color-icon-status-info-strong: var(--blue-800);
    --color-icon-onweak: var(--grey-800);
    --color-icon-status-info-weak: var(--blue-600);
    --color-icon-status-success-strong: var(--green-800);
    --color-icon-status-success-weak: var(--green-600);
    --color-icon-status-warning-strong: var(--orange-800);
    --color-icon-status-warning-weak: var(--orange-600);
    --color-icon-status-error-strong: var(--red-600);
    --color-icon-status-error-weak: var(--red-500);

    /* FABRIQUE DERIVED VARIABLES - SPACING */
    --space-size-18: calc(var(--space-size-1) * 18);
    --space-size-8: calc(var(--space-size-1) * 8);
    --space-size-6: calc(var(--space-size-1) * 6);
    --space-size-4: calc(var(--space-size-1) * 4);
    --space-size-3: calc(var(--space-size-1) * 3);
    --space-size-2: calc(var(--space-size-1) * 2);

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
