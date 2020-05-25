// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { DeliveryFee } from '../types';

type Props = {
  deliveryFee: DeliveryFee,
  t: TFunction,
};

export const DeliveryFeeListItem = (props: Props) => {
  const { name, free_threshold, fee } = props.deliveryFee;
  if (name && fee) {
    return (
      <ListItem divider>
        <ListItemText
          primary={`${name} - ${fee} €`}
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
