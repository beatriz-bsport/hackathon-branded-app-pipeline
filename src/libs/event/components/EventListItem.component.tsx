import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import { SubscriptionEvent, SubscriptionEventSpec } from '../types';

type OwnProps = {
  event: SubscriptionEvent;
  onEventClick?: (id: number) => void;
  eventSpec: SubscriptionEventSpec;
};

type Props = OwnProps;

export const SubscriptionEventListItem = (props: Props) => {
  const { t } = useTranslation(['subscription', 'checkout']);
  const onClick =
    props.onEventClick && props.event.subscription
      ? () => props.onEventClick(props.event.subscription.id)
      : null;

  const company_event = props.eventSpec[props.event.event_type];
  if (!company_event) return null;
  const secondaryContent = moment(props.event.date * 1000).format('LLLL');
  const icon = company_event?.icon || <InfoIcon />;

  return (
    <ListItem dense button={!!onClick} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={
          (company_event?.titlePrefix || (() => ''))(props.event) +
          (company_event?.getPrimaryText || ((e) => e))(props.event, t)
        }
        secondary={
          company_event?.getSecondaryText?.(props.event, t) || secondaryContent
        }
      />
    </ListItem>
  );
};

export default SubscriptionEventListItem;
