// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  payment: Payment,
};

export const PaymentInfoListItem = (props: Props) => {
  const { t } = useTranslation(['payment']);
  const { payment } = props;
  return (
    <ListItem>
      <ListItemText
        primary={t(`paymentMethod.${payment.payment_method}`)}
        secondary={payment.payment_note}
        secondaryTypographyProps={
          payment.payment_received === false ? { color: 'error' } : {}
        }
        primaryTypographyProps={
          payment.payment_received === false ? { color: 'error' } : {}
        }
      />
      <ListItemSecondaryAction>
        {`${getCurrencyDisplayWithPrice(payment.price)}`}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default PaymentInfoListItem;
