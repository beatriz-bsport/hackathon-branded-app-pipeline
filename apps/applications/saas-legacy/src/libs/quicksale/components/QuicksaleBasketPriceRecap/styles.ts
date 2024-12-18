import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  fontWeight500: {
    fontWeight: 500,
  },
  line: {
    flexGrow: 1,
    borderBottom: `1px dashed ${theme.palette.action.active}`,
  },
  recapLine: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  priceFrame: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.grey[50],
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },
  primaryIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  grayIcon: {
    color: theme.palette.action.active,
    cursor: 'pointer',
  },
  iconButton: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  couponButton: {
    alignSelf: 'end',
  },
}));

export default useStyles;
