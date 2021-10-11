import React from 'react';
import { useTranslation } from 'react-i18next';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';
import ScheduleIcon from '@material-ui/icons/Schedule';

type Props = {
  available_payment_method_identifiers: Array<number>;
};

const getIcon = (identifier: number) => {
  switch (identifier) {
    case CB.id: {
      return <CreditCardIcon />;
    }
    case CREDIT_ACCOUNT.id: {
      return <ScheduleIcon />;
    }
    default:
      return <AccountBalanceIcon />;
  }
};

const AvailablePaymentMethodList = (props: Props) => {
  const { t } = useTranslation(['payment']);
  return (
    <List dense>
      {(props.available_payment_method_identifiers || []).map((identifier) => {
        return (
          <ListItem dense>
            <ListItemIcon>{getIcon(identifier)}</ListItemIcon>
            <ListItemText primary={t(`paymentMethod.${identifier}`)} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default AvailablePaymentMethodList;
