import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

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
          <Typography variant="body2">{t('payment.taxExcluded')}</Typography>
        </div>
        <Typography variant="subtitle2">
          {getCurrencyDisplayWithPrice(props.excludingTaxPrice)}
        </Typography>
      </div>
      {props.flat_fee && (
        <div className={classes.row}>
          <div className={classes.taxInfo}>
            <Typography variant="body2">{t('payment.flat_fee')}</Typography>
          </div>
          <Typography variant="subtitle2">
            {getCurrencyDisplayWithPrice(props.flat_fee)}
          </Typography>
        </div>
      )}
      <div className={classes.row}>
        <div className={classes.taxInfo}>
          <Typography variant="body2">{t('payment.tax')}</Typography>
        </div>
        <Typography variant="subtitle2">
          {getCurrencyDisplayWithPrice(props.taxPrice)}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  row: {
    display: 'flex',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taxInfo: { color: theme.palette.grey[600] },
}));

export default React.memo(BasketTaxInfo);
