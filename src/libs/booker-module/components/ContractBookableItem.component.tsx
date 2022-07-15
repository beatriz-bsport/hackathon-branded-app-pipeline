import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { MaxoutData } from '../../payment-packs/types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Contract, ContractWithPaymentPack } from '#libs/subscription/types';
import MaxoutInfoMessage from '#libs/booker-module/components/MaxoutInfoMessage.component';

type Props = {
  isExcludingTax?: boolean;
  contract: (Contract | ContractWithPaymentPack) & Partial<MaxoutData>;
};

const ContractBookableItem = (props: Props) => {
  const { t } = useTranslation(['subscription']);
  const classes = useStyles();
  const { contract } = props;

  return (
    <div className={classes.container}>
      <div
        className={classNames(classes.itemContainer, {
          [classes.opacity]: !!contract.exceedsBookingMaxout,
        })}
      >
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
      {contract.exceedsBookingMaxout && (
        <div className={classes.maxoutMessageContainer}>
          <MaxoutInfoMessage maxoutInfo={contract.maxoutInfo} />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  maxoutMessageContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: 'translateY(50%)',
    maxWidth: '40%',
  },
  opacity: {
    opacity: 0.5,
  },
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
