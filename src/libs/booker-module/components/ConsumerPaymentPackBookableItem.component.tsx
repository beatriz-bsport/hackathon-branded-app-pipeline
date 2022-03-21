import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PaymentPack } from '../../payment-packs/types';
import { formatAsDate } from '../../../utils/datetime';
import CreditStatus from '../../consumer-payment-pack/components/CreditStatus.component';
import { ConsumerPaymentPack } from '../../consumer-payment-pack/types';

interface Props {
  consumerPaymentPack: ConsumerPaymentPack<PaymentPack>;
}

const ConsumerPaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const expireDate = `${t('consumer.expiresOn')}${formatAsDate(
    props.consumerPaymentPack.ending_date,
  )}`;

  return (
    <div className={classes.itemContainer}>
      <CreditStatus
        paymentPack={props.consumerPaymentPack.payment_pack}
        consumerPack={props.consumerPaymentPack}
        variant="h6"
      />
      <Typography variant="body1" color="textSecondary" align="left">
        {expireDate}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.consumerPaymentPack?.payment_pack?.name || ' - '}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default ConsumerPaymentPackItem;
