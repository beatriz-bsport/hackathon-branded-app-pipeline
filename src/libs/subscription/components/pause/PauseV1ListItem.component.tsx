import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import type { SubscriptionPause } from '../../types';

type Props = {
  pause: SubscriptionPause;
  dense?: boolean;
};

export const SubscriptionPauseListItem = (props: Props) => {
  const { t } = useTranslation('subscription');
  return (
    <ListItem divider dense={props.dense}>
      <ListItemText
        primary={props.pause.name}
        secondary={t('pauseV2.common.listItem.pausedAt', {
          days: props.pause.days,
          date: moment(props.pause.date_created).format('LL'),
        })}
      />
    </ListItem>
  );
};

export default SubscriptionPauseListItem;
