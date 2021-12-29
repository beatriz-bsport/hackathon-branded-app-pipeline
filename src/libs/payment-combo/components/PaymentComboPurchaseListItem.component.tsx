// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { formatAsDatetime } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { PaymentComboPurchase } from '../types';

type Props = {
  divider?: boolean;
  paymentComboPurchase: PaymentComboPurchase;
  onClick: () => void;
};

export const PaymentComboPurchaseListItem = (props: Props) => {
  const { paymentComboPurchase } = props;
  const { t } = useTranslation('member');
  if (!paymentComboPurchase || !paymentComboPurchase.payment_combo) {
    return (
      <ListItem>
        <CircularProgress />
      </ListItem>
    );
  }
  const { payment_combo } = paymentComboPurchase;

  return (
    <ListItem
      divider={props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {`${payment_combo.name} - ${
                paymentComboPurchase.member?.name || '...'
              }`}
            </Typography>
            {paymentComboPurchase.member &&
              paymentComboPurchase.member.archived && (
                <Typography variant="caption" color="secondary">
                  {`${'\u00A0'}(${t('member:archived')})`}
                </Typography>
              )}
          </div>
        }
        secondary={`${getCurrencyDisplayWithPrice(
          paymentComboPurchase.price,
        )} - ${formatAsDatetime(paymentComboPurchase.date)}`}
      />
      {props.onClick ? (
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={props.onClick}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default PaymentComboPurchaseListItem;
