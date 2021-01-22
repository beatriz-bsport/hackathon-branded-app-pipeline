// @flow

import React from 'react';

import { BILLING_PLAN_EVENTS } from '@bsport/common/lib/master-data/events';

import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import LoopIcon from '@material-ui/icons/Loop';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import { getCurrencyDisplay } from '../../theme/selectors';

const getPrimaryText = (event, t) =>
  `${t(`events.${event.event_type}`)}${` :  ${
    event.subscription ? event.subscription.name : ' - '
  }`}`;

export const COMPANY_EVENTS = {
  [BILLING_PLAN_EVENTS.create]: {
    icon: <AddIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.create}`,
  },
  [BILLING_PLAN_EVENTS.payment_success]: {
    icon: <CheckIcon color="primary" />,
    titleSuffix: (event) => `${event.data.amount}${getCurrencyDisplay()} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_success}`,
  },
  [BILLING_PLAN_EVENTS.payment_failure]: {
    icon: <CancelIcon color="error" />,
    titleSuffix: (event) => `${event.data.amount}${getCurrencyDisplay()} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_failure}`,
  },
  [BILLING_PLAN_EVENTS.payment_dispute]: {
    icon: <WarningIcon color="error" />,
    titleSuffix: (event) => `${event.data.amount}${getCurrencyDisplay()} - `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.payment_dispute}`,
  },
  [BILLING_PLAN_EVENTS.pause]: {
    icon: <PauseIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.pause}`,
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
    titleSuffix: (event) => `(${event.data.payment_pack}) `,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_payment_pack}`,
  },
  [BILLING_PLAN_EVENTS.update_payment_method]: {
    icon: <EditIcon />,
    getPrimaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.update_payment_method}`,
  },
};
