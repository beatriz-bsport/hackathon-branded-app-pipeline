import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PaymentPack, MaxoutData } from '../../payment-packs/types';
import { formatAsDate } from '../../../utils/datetime';
import CreditStatus from '../../consumer-payment-pack/components/CreditStatus.component';
import { ConsumerPaymentPack } from '../../consumer-payment-pack/types';
import MaxoutInfoMessage from '#libs/booker-module/components/MaxoutInfoMessage.component';

interface Props {
  consumerPaymentPack: ConsumerPaymentPack<PaymentPack> & Partial<MaxoutData>;
}

const ConsumerPaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const expireDate = `${t('consumer.expiresOn')}${formatAsDate(
    props.consumerPaymentPack.ending_date,
  )}`;

  if (!props.consumerPaymentPack.exceedsBookingMaxout) {
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
  }

  return (
    <div className={classes.rowContainer}>
      <div className={classes.columnContainer}>
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
      <div className={classes.maxoutMessageContainer}>
        <MaxoutInfoMessage maxoutInfo={props.consumerPaymentPack.maxoutInfo} />
      </div>
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
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    opacity: 0.5,
  },
  maxoutMessageContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: 'translateY(50%)',
  },
}));

export default ConsumerPaymentPackItem;
