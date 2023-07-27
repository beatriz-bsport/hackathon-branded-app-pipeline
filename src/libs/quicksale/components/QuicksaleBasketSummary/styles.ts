import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    background: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    maxHeight: 'calc(100vh - 160px)',
  },
  unauthenticatedAlert: {
    alignItems: 'center',
  },
  datePicker: {
    width: 220,
  },
  icon: {
    fill: theme.palette.action.active,
  },
  objectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    overflow: 'auto',
    paddingRight: theme.spacing(1),
    marginRight: -theme.spacing(1),
  },
  checkoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutItemQuantityAndName: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  checkoutItemQuantity: {
    height: 28,
    aspectRatio: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(0.625),
    background: theme.palette.grey[200],
  },
  fontWeight500: {
    fontWeight: 500,
  },
  prices: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceExcludingTax: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  tax: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  additionalLine: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    alignItems: 'center',
  },
  total: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  textGrey600: {
    color: theme.palette.grey[600],
  },
  divider: {
    margin: `0 -${theme.spacing(2)}px`,
  },
  iconButton: {
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
  },
  couponActions: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}));

export default useStyles;
