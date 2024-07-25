import { createTheme } from '@material-ui/core/styles';

const defaultTheme = createTheme();

export const reportSwitcherTheme = createTheme({
  overrides: {
    // @ts-expect-error MuiAlert is not in ComponentNameToClassKey interface
    MuiAlert: {
      root: { alignItems: 'center' },
      message: {
        display: 'flex',
        gap: defaultTheme.spacing(1.5),
        justifyContent: 'space-between',
        flex: 1,
      },
    },
    MuiButtonBase: {
      root: { padding: 0, color: 'inherit' },
    },
    MuiButton: {
      root: { color: 'inherit' },
      label: { textWrap: 'nowrap', color: 'inherit' },
    },
    MuiIconButton: {
      root: {
        padding: 0,
        color: 'inherit',
      },
      label: { padding: defaultTheme.spacing(0.5) },
    },
  },
});

export const reportDetailHeaderTheme = createTheme({
  overrides: {
    MuiIconButton: {
      root: {
        padding: defaultTheme.spacing(0.5),
      },
    },
  },
});

export const reportDetailContentTheme = createTheme({
  overrides: {
    MuiPaper: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: defaultTheme.spacing(3),
      },
    },
  },
});

export const cardHeaderStatsTheme = createTheme({
  overrides: {
    MuiTypography: {
      subtitle2: { textAlign: 'center' },
      h5: { textAlign: 'center' },
    },
    MuiCard: {
      root: { borderLeft: 0, padding: defaultTheme.spacing(1, 0) },
    },
    MuiPaper: {
      root: {
        backgroundColor: '#F8F8F8',
      },
    },
  },
});
