import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { PaymentPack, MaxoutData } from '../../payment-packs/types';
import { formatAsDate } from '../../../utils/datetime';
import CreditStatus from '../../consumer-payment-pack/components/CreditStatus.component';
import { ConsumerPaymentPack } from '../../consumer-payment-pack/types';

interface Props {
  consumerPaymentPack: ConsumerPaymentPack<PaymentPack> & Partial<MaxoutData>;
}

const ConsumerPaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const expireDate = `${t('consumer.expiresOn')}${formatAsDate(
    props.consumerPaymentPack.ending_date,
  )}`;

  return (
    <div
      className={classNames(classes.itemContainer, {
        [classes.opacity]: props.consumerPaymentPack.exceedsBookingMaxout,
      })}
    >
      <CreditStatus
        consumerPack={props.consumerPaymentPack}
        paymentPack={props.consumerPaymentPack.payment_pack}
        variant="h6"
      />
      <Typography align="left" color="textSecondary" variant="body1">
        {expireDate}
      </Typography>
      <Typography align="left" color="textPrimary" variant="body1">
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
  opacity: { opacity: 0.5 },
}));

export default ConsumerPaymentPackItem;
