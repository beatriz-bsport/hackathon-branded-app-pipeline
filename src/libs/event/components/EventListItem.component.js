// @flow

import React from 'react';

import moment from 'moment';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

type Props = {
  event: SubscriptionEvent,
  subscription: Subscription,
  onEventClick: ?(id: number) => void,
  eventSpec: EventSpec,
  t: TFunction,
};

export const SubscriptionEventListItem = (props: Props) => {
  const onClick =
    props.onEventClick && props.event.subscription
      ? () => props.onEventClick(props.event.subscription.id)
      : null;

  const company_event = props.eventSpec[props.event.event_type];
  return (
    <ListItem dense button={!!onClick} onClick={onClick}>
      <ListItemIcon>{company_event.icon}</ListItemIcon>
      <ListItemText
        primary={
          (company_event.titleSuffix || (() => ''))(props.event) +
          company_event.getPrimaryText(props.event, props.t)
        }
        secondary={moment(props.event.date * 1000).format('LLLL')}
      />
    </ListItem>
  );
};

export default withTranslation(['subscription'])(SubscriptionEventListItem);
