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

import { DateTime } from 'luxon';
import { TFunction } from 'i18next';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { SubscriptionEvent } from '#libs/event/types';

const getPrimaryText = (event: SubscriptionEvent, t: TFunction) =>
  `${t(`events.${event.event_type}`)}${` :  ${
    event.subscription ? event.subscription.name : ' - '
  }`}`;

const getEventPauseSecondaryText = (
  pauseEvent: SubscriptionEvent,
  t: TFunction,
) => {
  const pauseId = pauseEvent.data.pause;
  const pauseData = pauseEvent.subscription?.pauses?.find(
    (_pause) => _pause.id === pauseId,
  );
  const pauseFromDate =
    DateTime.fromISO(pauseEvent.data.from_date).toISODate() ||
    DateTime.fromISO(pauseData?.from_date).toISODate();
  const pauseUntilDate =
    DateTime.fromISO(pauseEvent.data.until_date).toISODate() ||
    DateTime.fromISO(pauseData?.until_date).toISODate();
  const pauseCreatorStaffName =
    pauseEvent.data.created_by_staff || pauseData?.creator_staff_name;
  const dateCreation =
    DateTime.fromMillis(pauseEvent.date * 1000).toISODate() ||
    DateTime.fromISO(pauseData?.date_created).toISODate();
  const dateRangeText = t('subscription:pauseV2.common.listItem.fromToUntil', {
    fromDate: pauseFromDate,
    untilDate: pauseUntilDate,
  });
  const dateCreationAndStaffText = pauseCreatorStaffName
    ? t('subscription:pauseV2.common.listItem.createdAtBy', {
        dateCreation,
        staffName: pauseCreatorStaffName,
      })
    : t('subscription:pauseV2.common.listItem.createdAt', {
        dateCreation,
      });
  const isAnUpdatedPause = pauseEvent.data.is_update
    ? ` (${t('subscription:pauseV2.common.listItem.isUpdated')})`
    : '';
  return `${dateRangeText} - ${dateCreationAndStaffText}${isAnUpdatedPause}`;
};

const getEventPauseDeletedSecondaryText = (
  pauseDeleteEvent: SubscriptionEvent,
  t: TFunction,
) => {
  const pauseFromDate = DateTime.fromISO(
    pauseDeleteEvent.data.from_date,
  ).toISODate();
  const pauseUntilDate = DateTime.fromISO(
    pauseDeleteEvent.data.until_date,
  ).toISODate();
  const pauseDeletorStaffName = pauseDeleteEvent.data.deleted_by_staff;
  const dateDeletion = DateTime.fromMillis(
    pauseDeleteEvent.date * 1000,
  ).toISODate();
  const dateRangeText = t('subscription:pauseV2.common.listItem.fromToUntil', {
    fromDate: pauseFromDate,
    untilDate: pauseUntilDate,
  });
  const dateDeletionAndStaffText = pauseDeletorStaffName
    ? t('subscription:pauseV2.common.listItem.deletedAtBy', {
        dateDeletion,
        staffName: pauseDeletorStaffName,
      })
    : t('subscription:pauseV2.common.listItem.deletedAt', {
        dateDeletion,
      });
  return `${dateRangeText} - ${dateDeletionAndStaffText}`;
};

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
    getSecondaryText: getEventPauseSecondaryText,
    i18nText: `subscription:events.${BILLING_PLAN_EVENTS.pause}`,
  },
  [BILLING_PLAN_EVENTS.pause_deleted]: {
    icon: <BlockIcon />,
    getSecondaryText: getEventPauseDeletedSecondaryText,
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
