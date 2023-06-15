import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';

type OwnProps = {
  excludingTaxPrice: string;
  taxPrice: string;
  flat_fee?: string;
};
type Props = OwnProps;
export const BasketTaxInfo: React.FC<Props> = (props) => {
  const { t } = useTranslation('checkout');
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles({ isNewCheckoutFlow });

  return (
    <div className={classes.column}>
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography variant={isNewCheckoutFlow ? 'body2' : 'inherit'}>
            {t('payment.taxExcluded')}
          </Typography>
        </div>
        <Typography variant={isNewCheckoutFlow ? 'subtitle2' : 'inherit'}>
          {getCurrencyDisplayWithPrice(props.excludingTaxPrice)}
        </Typography>
      </div>
      {props.flat_fee && (
        <div className={classes.row}>
          <div className={classes.taxInfo}>
            <Typography variant={isNewCheckoutFlow ? 'body2' : 'inherit'}>
              {t('payment.flat_fee')}
            </Typography>
          </div>
          <Typography variant={isNewCheckoutFlow ? 'subtitle2' : 'inherit'}>
            {getCurrencyDisplayWithPrice(props.flat_fee)}
          </Typography>
        </div>
      )}
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography variant={isNewCheckoutFlow ? 'body2' : 'inherit'}>
            {t('payment.tax')}
          </Typography>
        </div>
        <Typography variant={isNewCheckoutFlow ? 'subtitle2' : 'inherit'}>
          {getCurrencyDisplayWithPrice(props.taxPrice)}
        </Typography>
      </div>
      {!isNewCheckoutFlow && (
        <Typography variant="h6">{t('payment.total')}</Typography>
      )}
    </div>
  );
};

type NewCheckoutFlowThemeProps = {
  isNewCheckoutFlow?: boolean;
};
const useStyles = makeStyles<Theme, NewCheckoutFlowThemeProps>((theme) => ({
  column: ({ isNewCheckoutFlow }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    ...(isNewCheckoutFlow ? { padding: theme.spacing(1) } : {}),
  }),
  row: ({ isNewCheckoutFlow }) => ({
    display: 'flex',
    ...(isNewCheckoutFlow
      ? {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }
      : {}),
  }),
  taxInfo: ({ isNewCheckoutFlow }) =>
    isNewCheckoutFlow ? { color: theme.palette.grey[600] } : { flex: '1' },
}));
export default BasketTaxInfo;
