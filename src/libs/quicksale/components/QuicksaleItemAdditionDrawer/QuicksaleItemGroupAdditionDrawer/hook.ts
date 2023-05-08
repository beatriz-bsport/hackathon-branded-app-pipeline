import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  drawer: {
    width: '35%',
    [theme.breakpoints.down('lg')]: {
      width: '55%',
    },
  },
  selectorsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    '& > *': {
      width: '100%',
    },
  },
  noResultAlertContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  noResultAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  selectAndUnselectContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2.5),
  },
  selectAndUnselectButton: {
    fontSize: '12px',
    textTransform: 'none',
    padding: 0,
  },
}));

export default useStyle;
