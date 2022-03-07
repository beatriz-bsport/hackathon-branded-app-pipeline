import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type OwnProps = {
  excludingTaxPrice: string;
  taxPrice: string;
  flat_fee?: string;
};
type Props = OwnProps;
export const BasketTaxInfo: React.FC<Props> = (props) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();
  return (
    <div className={classes.column}>
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography>{t('payment.taxExcluded')}</Typography>
        </div>
        <Typography>
          {getCurrencyDisplayWithPrice(props.excludingTaxPrice)}
        </Typography>
      </div>
      {props.flat_fee && (
        <div className={classes.row}>
          <div className={classes.taxInfo}>
            <Typography>{t('payment.flat_fee')}</Typography>
          </div>
          <Typography>{getCurrencyDisplayWithPrice(props.flat_fee)}</Typography>
        </div>
      )}
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography>{t('payment.tax')}</Typography>
        </div>
        <Typography>{getCurrencyDisplayWithPrice(props.taxPrice)}</Typography>
      </div>
      <Typography variant="h6">{t('payment.total')}</Typography>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
  taxInfo: { flex: '1' },
  row: { display: 'flex' },
}));
export default BasketTaxInfo;
