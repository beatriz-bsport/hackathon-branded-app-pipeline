import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTranslation, WithTranslation } from 'react-i18next';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { DeliveryFee } from '#src/libs/order/types';

type Props = {
  deliveryFee: DeliveryFee;
} & WithTranslation;

export const DeliveryFeeListItem: React.FC<Props> = (props) => {
  const { name, free_threshold, fee } = props.deliveryFee;
  if (name && fee) {
    return (
      <ListItem divider>
        <ListItemText
          primary={`${name} - ${getCurrencyDisplayWithPrice(fee)}`}
          secondary={props.t('deliveryFee.offeredAboveAmount', {
            free_threshold,
          })}
        />
      </ListItem>
    );
  }
  return null;
};

export default withTranslation(['order'])(DeliveryFeeListItem);
