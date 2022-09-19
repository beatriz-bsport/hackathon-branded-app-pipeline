import React from 'react';

import { BILLING_PLAN_EVENTS } from '@bsport/common/lib/master-data/events';

import PauseIcon from '@material-ui/icons/Pause';
import BlockIcon from '@material-ui/icons/Block';
import StopIcon from '@material-ui/icons/Stop';
import LoopIcon from '@material-ui/icons/Loop';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import { TFunction } from 'i18next';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { SubscriptionEvent } from '#libs/event/types';

const getPrimaryText = (event: SubscriptionEvent, t: TFunction) =>
  `${t(`events.${event.event_type}`)}${` :  ${
    event.subscription ? event.subscription.name : ' - '
  }`}`;

export const COMPANY_EVENTS = {
  [BILLING_PLAN_EVENTS.create]: {
    icon: <AddIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.create}`,
  },
  [BILLING_PLAN_EVENTS.update]: {
    icon: <EditIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update}`,
  },
  [BILLING_PLAN_EVENTS.payment_success]: {
    icon: <CheckIcon color="primary" />,
    titlePrefix: (event: SubscriptionEvent) =>
      `${getCurrencyDisplayWithPrice(event.data.amount)} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_success}`,
  },
  [BILLING_PLAN_EVENTS.payment_failure]: {
    icon: <CancelIcon color="error" />,
    titlePrefix: (event: SubscriptionEvent) =>
      `${getCurrencyDisplayWithPrice(event.data.amount)} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_failure}`,
  },
  [BILLING_PLAN_EVENTS.payment_dispute]: {
    icon: <WarningIcon color="error" />,
    titlePrefix: (event: SubscriptionEvent) =>
      `${getCurrencyDisplayWithPrice(event.data.amount)} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_dispute}`,
  },
  [BILLING_PLAN_EVENTS.pause]: {
    icon: <PauseIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.pause}`,
  },
  [BILLING_PLAN_EVENTS.pause_deleted]: {
    icon: <BlockIcon />,
    secondarySuffix: (event: SubscriptionEvent, t: TFunction) =>
      event.data?.pause_name
        ? ` - ${t('pause.eventItems.pauseDeleted', {
            pause_name: event.data.pause_name,
          })}`
        : '',
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.pause_deleted}`,
  },
  [BILLING_PLAN_EVENTS.stop]: {
    icon: <StopIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.stop}`,
  },
  [BILLING_PLAN_EVENTS.renew]: {
    icon: <LoopIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.renew}`,
  },
  [BILLING_PLAN_EVENTS.update_payment_pack]: {
    icon: <EditIcon />,
    titlePrefix: (event: SubscriptionEvent) => `(${event.data.payment_pack}) `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_payment_pack}`,
  },
  [BILLING_PLAN_EVENTS.update_private_pass]: {
    icon: <EditIcon />,
    titlePrefix: (event: SubscriptionEvent) => `(${event.data.private_pass}) `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_private_pass}`,
  },
  [BILLING_PLAN_EVENTS.update_payment_combo]: {
    icon: <EditIcon />,
    titlePrefix: (event: SubscriptionEvent) => `(${event.data.payment_combo}) `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_payment_combo}`,
  },
  [BILLING_PLAN_EVENTS.update_payment_method]: {
    icon: <EditIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_payment_method}`,
  },
};
