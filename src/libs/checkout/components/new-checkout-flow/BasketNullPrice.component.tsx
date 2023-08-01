import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';

type BasketNullPriceProps = {
  areTermsAndConditionsAccepted?: boolean;
};

export const BasketNullPrice: React.FC<BasketNullPriceProps> = ({
  areTermsAndConditionsAccepted,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  return (
    <div className={classes.basketNullPriceContainer}>
      <div className={classes.iconContainer}>
        <ShoppingBasket className={classes.shoppingBasketIcon} />
      </div>
      <Typography className={classes.title} variant="h6">
        {t('myBasket.almostDone')}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {areTermsAndConditionsAccepted
          ? t('myBasket.checkAndFinalize')
          : t('myBasket.acceptTermsAndFinalize')}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  basketNullPriceContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  title: {
    fontWeight: 500,
  },
  subtitle: {
    fontColor: theme.palette.grey[600],
  },
  iconContainer: {
    borderRadius: theme.spacing(1),
    display: 'flex',
    background: `${chroma(theme.palette.primary.main).hex()}1a`,
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
  },
  shoppingBasketIcon: {
    color: theme.palette.primary.main,
    width: '51%',
    height: '44%',
  },
}));

export default React.memo(BasketNullPrice);
