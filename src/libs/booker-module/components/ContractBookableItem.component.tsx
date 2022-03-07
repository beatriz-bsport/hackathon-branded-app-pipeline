import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Contract } from '#libs/subscription/types';

type Props = { isExcludingTax?: boolean; contract: Contract };

const ContractBookableItem = (props: Props) => {
  const { t } = useTranslation(['subscription']);
  const classes = useStyles();
  const { contract } = props;

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(
            contract.recurrent_price,
            props.isExcludingTax,
            contract.tax,
          )}
        </Typography>
        <Typography className={classes.creditText} variant="h6" align="left">
          {t('contract.item.identifier')}
        </Typography>
      </div>
      <Typography variant="body1" color="textSecondary" align="left">
        {t(`contract.item.intervalLabel.${contract.interval}`, {
          count: contract.recurrence_basis,
        })}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {contract.name}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  creditText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export default ContractBookableItem;
