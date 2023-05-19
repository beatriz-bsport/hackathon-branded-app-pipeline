import { useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import chroma from 'chroma-js';
import { useMemo } from 'react';

const useOfferFormStyles = (
  withoutSectionIconContainerMargin?: boolean,
  isDisabledSectionIcon?: boolean,
) => {
  const theme = useTheme();

  const sectionIconBackground = useMemo(() => {
    const hexPrimary = chroma(theme.palette.primary.main).hex();
    return `${hexPrimary}1a`;
  }, [theme.palette.primary.main]);

  const useStyles = makeStyles(() => ({
    sectionHeader: {
      display: 'flex',
      gap: theme.spacing(1),
    },
    sectionIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.spacing(1),
      background: isDisabledSectionIcon
        ? theme.palette.grey[50]
        : sectionIconBackground,
      width: '44px',
      height: '44px',
      marginRight: withoutSectionIconContainerMargin ? 0 : theme.spacing(1.25),
    },
    sectionIcon: {
      color: isDisabledSectionIcon
        ? theme.palette.grey[400]
        : theme.palette.primary.main,
    },
    formFieldColumns: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing(2),
      alignItems: 'flex-start',
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(3),
      },
    },
    justifyBetween: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    smallWidth: {
      width: '65px',
    },
    mediumWidth: {
      width: '100px',
    },
    bigWidth: {
      width: '250px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    xBigWidth: {
      width: '350px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    fullWidth: {
      width: '100%',
    },
    disabledInput: {
      background: '#F2F2F2',
    },
    tooltip: {
      color: '#616161',
      marginLeft: theme.spacing(1),
      alignSelf: 'center',
    },
    levelSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
      },
    },
    levelSelectorAdd: {
      color: theme.palette.primary.main,
      padding: 0,
      textTransform: 'none',
      fontWeight: 400,
      [theme.breakpoints.down('xs')]: {
        width: 'fit-content',
      },
    },
    errorLabel: {
      color: theme.palette.error.main,
    },
    durationField: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: 4,
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '&:hover': {
        borderColor: 'black',
      },
    },
    durationFieldInputWithIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      color: theme.palette.grey[600],
    },
    settingsFields: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1) / 2,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    stretchSelf: {
      display: 'flex',
      alignSelf: 'stretch',
    },
    settingsMarketplaceContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      gap: theme.spacing(1),
      background: theme.palette.grey[100],
      borderRadius: theme.spacing(1),
    },
    mediumFontWeight: {
      fontWeight: 500,
    },
    tagSelectorIcon: {
      marginRight: theme.spacing(1),
    },
    dateInput: {
      '&.MuiTextField-root .MuiInputBase-input': {
        padding: theme.spacing(1),
        width: '90px',
      },
      '&.MuiTextField-root .MuiIconButton-root': {
        padding: 0,
      },
      '&.MuiTextField-root': {
        width: 'fit-content',
      },
    },
    dateInputAdornedEnd: {
      display: 'inline-flex',
      flexDirection: 'row-reverse',
      padding: 0,
      margin: 0,
    },
    timeInput: {
      '&.MuiTextField-root .MuiInputBase-input': {
        padding: theme.spacing(1),
        width: '75px',
      },
      '&.MuiTextField-root .MuiIconButton-root': {
        padding: 0,
      },
    },
    activeCalendarDay: {
      background: sectionIconBackground,
    },
    selectorError: {
      border: `1px solid ${theme.palette.error.main}`,
      borderRadius: '4px',
    },
    buttonsContainer: {
      padding: theme.spacing(4),
      gap: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
    },
    coachOverrideModeRadioGroup: {
      marginTop: theme.spacing(2),
    },
    groupedOfferAlert: {
      margin: `${theme.spacing(4)}px ${theme.spacing(4)}px ${theme.spacing(
        1,
      )}px`,
    },
    recurrencePreviewAlert: {
      gap: theme.spacing(1.5),
      width: 'fit-content',
      '&.MuiAlert-icon': {
        margin: 0,
      },
      '&.MuiAlert-action': {
        margin: 0,
      },
    },
    fieldWithTooltip: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  }));

  const classes = useStyles();
  return classes;
};

export default useOfferFormStyles;
