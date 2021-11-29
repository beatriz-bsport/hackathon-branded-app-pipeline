// @flow
import React from 'react';
import moment from 'moment-timezone';
import { withTranslation, TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import type { SubscriptionPause } from '../types';

type Props = {
  t: TFunction,
  pause: SubscriptionPause,
  dense?: boolean,
};

export const SubscriptionPauseListItem = (props: Props) => {
  return (
    <ListItem divider dense={props.dense}>
      <ListItemText
        primary={props.pause.name}
        secondary={props.t('pause.pausedAt', {
          days: props.pause.days,
          date: moment(props.pause.date_created).format('LL'),
        })}
      />
    </ListItem>
  );
};

export default withTranslation(['subscription'])(SubscriptionPauseListItem);
