// @flow

import React from 'react';

import { BILLING_PLAN_EVENTS } from '@bsport/common/lib/master-data/events';

import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import LoopIcon from '@material-ui/icons/Loop';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

const COMPANY_EVENTS = {
  [BILLING_PLAN_EVENTS.pause]: {
    icon: <PauseIcon />,
  },
  [BILLING_PLAN_EVENTS.create]: {
    icon: <AddIcon />,
  },
  [BILLING_PLAN_EVENTS.stop]: {
    icon: <StopIcon />,
  },
  [BILLING_PLAN_EVENTS.renew]: {
    icon: <LoopIcon />,
  },
  [BILLING_PLAN_EVENTS.payment_dispute]: {
    icon: <WarningIcon color="error" />,
    titleSuffix: (event) => `${event.data.amount}€ - `,
  },
  [BILLING_PLAN_EVENTS.payment_success]: {
    icon: <CheckIcon color="primary" />,
    titleSuffix: (event) => `${event.data.amount}€ - `,
  },
  [BILLING_PLAN_EVENTS.update_payment_pack]: {
    icon: <EditIcon />,
    titleSuffix: (event) => `(${event.data.payment_pack}) `,
  },
  [BILLING_PLAN_EVENTS.payment_failure]: {
    icon: <CancelIcon color="error" />,
    titleSuffix: (event) => `${event.data.amount}€ - `,
  },
  [BILLING_PLAN_EVENTS.update_payment_method]: {
    icon: <EditIcon />,
  },
};

type Props = {
  event: SubscriptionEvent,
  subscription: Subscription,
  onEventClick: ?(id: number) => void,
  withoutSubscriptionName?: boolean,
  t: TFunction,
};

export const SubscriptionEventListItem = (props: Props) => {
  const onClick =
    props.onEventClick && props.event.subscription
      ? () => props.onEventClick(props.event.subscription.id)
      : null;

  const company_event = COMPANY_EVENTS[props.event.event_type];
  return (
    <ListItem dense button={!!onClick} onClick={onClick}>
      <ListItemIcon>{company_event.icon}</ListItemIcon>
      <ListItemText
        primary={`${`${(company_event.titleSuffix || (() => ''))(
          props.event,
        )}`}${props.t(`events.${props.event.event_type}`)}${
          props.withoutSubscriptionName
            ? ''
            : ` :  ${
                props.event.subscription ? props.event.subscription.name : ' - '
              }`
        }`}
        secondary={moment(props.event.date * 1000).format('LLLL')}
      />
    </ListItem>
  );
};

export default withNamespaces(['subscription'])(SubscriptionEventListItem);
