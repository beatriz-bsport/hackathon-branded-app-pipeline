import { makeStyles, Theme } from '@material-ui/core/styles';
import type { Basket } from '#src/libs/checkout/types';

const useStyles = makeStyles<
  Theme,
  { isInteractive?: boolean; basket?: Basket }
>((theme) => ({
  container: ({ basket }) => ({
    background: 'white',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[300]}`,
    ...(!basket
      ? { padding: theme.spacing(3.75), justifyContent: 'center' }
      : {}),
  }),
  headerAndBody: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 227px)',
  },
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  basketName: ({ isInteractive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    overflow: 'hidden',
    borderRadius: theme.spacing(1.5),
    width: 'fit-content',
    ...(isInteractive
      ? {
          background: theme.palette.grey[200],
          cursor: 'pointer',
          '&:hover': { background: theme.palette.grey[300] },
          padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
        }
      : { '&:hover': { background: 'inherit' } }),
  }),
  avatar: {
    height: 32,
    width: 32,
  },
  nameIcon: {
    fill: theme.palette.action.active,
  },
  basketNameTypography: {
    fontSize: '1rem',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  fontWeight500: {
    fontWeight: 500,
  },
  closeIconButton: {
    padding: theme.spacing(0),
    '&:hover': {
      background: 'transparent',
    },
  },
  closeIcon: {
    height: 40,
    width: 40,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1),
  },
  footer: {
    padding: theme.spacing(2),
  },
  totalExcludingTax: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  taxes: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    alignItems: 'center',
  },
  total: {
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  color600: {
    color: theme.palette.grey[600],
  },
  payButton: {
    borderRadius: theme.spacing(1.5),
  },
  alert: {
    alignItems: 'center',
    alignSelf: 'center',
    border: 'none',
  },
  overflow: {
    overflow: 'auto',
  },
}));

export default useStyles;
