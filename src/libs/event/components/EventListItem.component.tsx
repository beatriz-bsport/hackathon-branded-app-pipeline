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
  const isPause = props.event.event_type === 'billing_plan-pause';
  let secondaryContent = moment(props.event.date * 1000).format('LLLL');
  const icon = company_event?.icon || <InfoIcon />;
  if (isPause) {
    const pauseId = props.event.data.pause;
    const pauseData = props.event.subscription?.pauses?.find(
      (_pause) => _pause.id === pauseId,
    );
    if (pauseData) {
      secondaryContent = t('subscription:pause.eventItems.pauseCreated', {
        dateStart: moment(pauseData.from_date).format('L'),
        dateEnd: moment(pauseData.from_date)
          .add(pauseData.days - 1, 'days')
          .format('L'),
        dateCreation: moment(pauseData.date_created).format('L'),
        staffName: pauseData.creator_staff_name,
      });
    } else {
      secondaryContent = t(
        'subscription:pause.eventItems.pauseCreatedThenDeleted',
      );
    }
  }
  return (
    <ListItem dense button={!!onClick} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={
          (company_event?.titlePrefix || (() => ''))(props.event) +
          (company_event?.getPrimaryText || ((e) => e))(props.event, t)
        }
        secondary={
          secondaryContent +
          (company_event?.secondarySuffix || (() => ''))(props.event, t)
        }
      />
    </ListItem>
  );
};

export default SubscriptionEventListItem;
