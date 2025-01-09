import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { formatAsDatetime } from '../../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { PaymentCombo, PaymentComboPurchase } from '../types';

type Props = {
  divider?: boolean;
  paymentComboPurchase: PaymentComboPurchase<PaymentCombo>;
  onClick?: (buyable_item_identifier: number, id: number) => void;
};

export const PaymentComboPurchaseListItem: React.FC<Props> = ({
  divider,
  paymentComboPurchase,
  onClick,
}) => {
  const { t } = useTranslation('member');

  const onItemClick = React.useCallback(() => {
    if (onClick) {
      if (paymentComboPurchase?.consumer_payment_packs?.length)
        onClick(
          BUYABLE_ITEM_PASS,
          paymentComboPurchase.consumer_payment_packs[0],
        );
      else if (paymentComboPurchase?.private_consumer_passes?.length)
        onClick(
          BUYABLE_ITEM_PRIVATE_PASS,
          paymentComboPurchase.private_consumer_passes[0],
        );
      else if (paymentComboPurchase?.provision_updates?.length)
        onClick(
          BUYABLE_ITEM_SHOP_ITEM,
          paymentComboPurchase.provision_updates[0],
        );
    }
  }, [
    onClick,
    paymentComboPurchase.consumer_payment_packs,
    paymentComboPurchase.private_consumer_passes,
    paymentComboPurchase.provision_updates,
  ]);

  if (!paymentComboPurchase || !paymentComboPurchase.payment_combo) {
    return (
      <ListItem>
        <CircularProgress />
      </ListItem>
    );
  }
  const { payment_combo } = paymentComboPurchase;

  return (
    <ListItem button={!!onClick as any} divider={divider} onClick={onItemClick}>
      {/* This as any is required because considering the way ListItem is typed, */}
      {/* TS can't understand a boolean that is not explicitely true or false here */}
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
                <Typography color="secondary" variant="caption">
                  {`${'\u00A0'}(${t('member:archived')})`}
                </Typography>
              )}
          </div>
        }
        secondary={`${getCurrencyDisplayWithPrice(
          paymentComboPurchase.price,
        )} - ${formatAsDatetime(paymentComboPurchase.date)}`}
      />
      {onClick ? (
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={onItemClick}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default React.memo(PaymentComboPurchaseListItem);
