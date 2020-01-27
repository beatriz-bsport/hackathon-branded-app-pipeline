// @flow
import React from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
    <ListItem dense={props.dense}>
      <ListItemText
        primary={props.pause.name}
        secondary={props.t('pause.pausedInterval', {
          days: props.pause.days,
          start: moment(props.pause.date_created).format('LL'),
          end: moment(props.pause.date_created)
            .add(props.pause.days, 'days')
            .format('LL'),
        })}
      />
    </ListItem>
  );
};

export default withNamespaces(['subscription'])(SubscriptionPauseListItem);
