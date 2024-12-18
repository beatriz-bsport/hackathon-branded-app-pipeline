import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import chroma from 'chroma-js';

export const useBasketInstalmentPaymentOptionStyle = makeStyles<
  Theme,
  { checked: boolean; isNewCheckoutFlow?: boolean }
>((theme: Theme) => ({
  container: (props: { checked: boolean; isNewCheckoutFlow?: boolean }) => ({
    backgroundColor: props.checked
      ? chroma(theme.palette.primary.main).alpha(0.05).hex()
      : 'unset',
    border: '1px solid #D4D4D4',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(
      1,
    )}px ${props.isNewCheckoutFlow ? 0 : theme.spacing(1)}px`,
  }),
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(6),
  },
  paddingLeftMobile: {
    paddingLeft: theme.spacing(2),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  disabledText: {
    color: theme.palette.grey[500],
  },
}));
