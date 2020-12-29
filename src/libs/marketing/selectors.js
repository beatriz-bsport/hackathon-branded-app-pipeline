// @flow

import { createSelector } from 'reselect';

import type { State } from '../../state/types.ts';

const BIRTHDAY_NOTIFICATION = 0;
const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;
const BOOKING_CREATION_NOTIFICATION = 2;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;

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

export const getBookingNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) => notif.kind === BOOKING_CREATION_NOTIFICATION);
  },
);

export const getPaymentPackNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
          CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
        ].includes(notif.kind),
      );
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

export const withBookingNotification = (selector) =>
  createSelector(
    [selector, getBookingNotifications],
    (itemList, notifList) =>
      itemList.map((item) => {
        if (
          notifList.find(
            (notif) =>
              notif.event_rules.establishment_id === item.id ||
              notif.event_rules.meta_activity_id === item.id,
          ) !== undefined
        ) {
          return { ...item, hasActiveNotification: true };
        }
        return { ...item, hasActiveNotification: false };
      }),
  );

export const withPaymentPackNotification = (selector) =>
  createSelector(
    [selector, getPaymentPackNotifications],
    (packList, notifList) =>
      packList.map((pack) => {
        if (
          notifList.find(
            (notif) => notif.event_rules.payment_pack_id === pack.id,
          ) !== undefined
        ) {
          return { ...pack, hasActiveNotification: true };
        }
        return { ...pack, hasActiveNotification: false };
      }),
  );
