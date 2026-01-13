import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  recurrenceSumup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(3),
  },
  fieldMargin2: {
    marginBottom: theme.spacing(2),
  },
  selectorField: {
    marginBottom: theme.spacing(0),
  },
  intervalIntegerField: {
    height: theme.spacing(-2),
    width: theme.spacing(5),
  },
  alert: {
    alignItems: 'center',
  },
  intervalSelectorField: {
    height: theme.spacing(5),
  },
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  smallTextField: {
    width: theme.spacing(3.75),
  },
  monthBillingDaySelect: {
    height: theme.spacing(5),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
  helperText: { marginBottom: theme.spacing(2) },
  RadioGroupFieldContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  helperTextError: {
    color: theme.palette.error.main,
  },
}));
