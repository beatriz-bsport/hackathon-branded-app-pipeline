import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import CheckoutContext from '../../../pages/checkout/basket/CheckoutContext';

type OwnProps = {
  excludingTaxPrice: string;
  taxPrice: string;
  flat_fee?: string;
};
type Props = OwnProps;
export const BasketTaxInfo: React.FC<Props> = (props) => {
  const { t } = useTranslation('checkout');
  const isCheckoutContext = React.useContext(CheckoutContext);
  const classes = useStyles({ isCheckoutContext });

  return (
    <div className={classes.column}>
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography variant={isCheckoutContext ? 'body2' : 'inherit'}>
            {t('payment.taxExcluded')}
          </Typography>
        </div>
        <Typography variant={isCheckoutContext ? 'subtitle2' : 'inherit'}>
          {getCurrencyDisplayWithPrice(props.excludingTaxPrice)}
        </Typography>
      </div>
      {props.flat_fee && (
        <div className={classes.row}>
          <div className={classes.taxInfo}>
            <Typography variant={isCheckoutContext ? 'body2' : 'inherit'}>
              {t('payment.flat_fee')}
            </Typography>
          </div>
          <Typography variant={isCheckoutContext ? 'subtitle2' : 'inherit'}>
            {getCurrencyDisplayWithPrice(props.flat_fee)}
          </Typography>
        </div>
      )}
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography variant={isCheckoutContext ? 'body2' : 'inherit'}>
            {t('payment.tax')}
          </Typography>
        </div>
        <Typography variant={isCheckoutContext ? 'subtitle2' : 'inherit'}>
          {getCurrencyDisplayWithPrice(props.taxPrice)}
        </Typography>
      </div>
      {!isCheckoutContext && (
        <Typography variant="h6">{t('payment.total')}</Typography>
      )}
    </div>
  );
};

type CheckoutContextThemeProps = {
  isCheckoutContext?: boolean;
};
const useStyles = makeStyles<Theme, CheckoutContextThemeProps>((theme) => ({
  column: ({ isCheckoutContext }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    ...(isCheckoutContext ? { padding: theme.spacing(1) } : {}),
  }),
  row: ({ isCheckoutContext }) => ({
    display: 'flex',
    ...(isCheckoutContext
      ? {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }
      : {}),
  }),
  taxInfo: ({ isCheckoutContext }) =>
    isCheckoutContext ? { color: theme.palette.grey[600] } : { flex: '1' },
}));
export default React.memo(BasketTaxInfo);
