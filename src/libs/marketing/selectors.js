// @flow

import { createSelector } from 'reselect';

import type { State } from '../../state/types.ts';

const BIRTHDAY_NOTIFICATION = 0;
const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;

export const getAllMarketingNotification = (state: State) =>
  state.marketingNotification.notifications;

export const getCelebrationBirthday = createSelector(
  getAllMarketingNotification,
  (notifications) =>
    notifications.find(
      (notification) => notification.kind === BIRTHDAY_NOTIFICATION,
    ),
);

const _getNotificationIds = (state: State) =>
  state.marketingNotification.allIds;

const _getNotifications = (state: State) => state.marketingNotification.byId;

export const getPrivateBookingNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) => notif.kind === PRIVATE_BOOKING_CREATION_NOTIFICATION);
  },
);

export const withPrivateBookingNotification = (selector) =>
  createSelector(
    [selector, getPrivateBookingNotifications],
    (serviceList, notifList) =>
      serviceList.map((service) => {
        if (
          notifList.find(
            (notif) => notif.event_rules.private_service_id === service.id,
          ) !== undefined
        ) {
          return { ...service, hasActiveNotification: true };
        }
        return { ...service, hasActiveNotification: false };
      }),
  );
