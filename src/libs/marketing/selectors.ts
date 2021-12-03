import { createSelector } from 'reselect';
import get from 'lodash/get';
import setWith from 'lodash/setWith';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { RootState } from '../../reducers';
import { MarketingNotification } from './types';

export const BIRTHDAY_NOTIFICATION = 0;

export const getAllMarketingNotification = (state: RootState) =>
  state.marketingNotification.notifications;

export const getCelebrationBirthday = createSelector(
  getAllMarketingNotification,
  (notifications) =>
    notifications.find(
      (notification) => notification.kind === BIRTHDAY_NOTIFICATION,
    ),
);

const _getNotificationIds = (state: RootState) =>
  state.marketingNotification.allIds;

const _getNotifications = (state: RootState) =>
  state.marketingNotification.byId;

export const getPrivateBookingNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter(
        (notif) => notif.kind === NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
      );
  },
);

export const getBookingNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) => notif.kind === NOTIFICATION_KIND.BOOKING_CREATION);
  },
);

export const getPaymentPackNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
          // @ts-ignore
        ].includes(notif.kind),
      );
  },
);
export const getNotificationForMarketingPage = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
          NOTIFICATION_KIND.BOOKING_CREATION,
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
        ].includes(notif.kind),
      );
  },
);

export const getNotificationGrouped = createSelector(
  [getNotificationForMarketingPage],
  (notifications) => {
    const byPaymentPack: { [key: string]: MarketingNotification[] } = {};
    const byPrivatePass: { [key: string]: MarketingNotification[] } = {};
    const bookings: {
      [key: string]: {
        identifier: 'meta_activity' | 'establishment' | 'private_service';
        bySession: {
          [key: string]: { [key: string]: MarketingNotification[] };
        };
      };
    } = {};
    const privateBookings = { ...bookings };

    notifications.forEach((n) => {
      const {
        payment_pack_id,
        private_pass_id,
        establishment_id,
        meta_activity_id,
        private_service_id,
        notify_booking_nb,
        kind,
      } = n.event_rules;
      if (payment_pack_id !== undefined) {
        if (byPaymentPack[payment_pack_id] === undefined) {
          byPaymentPack[payment_pack_id] = [];
        }
        byPaymentPack[payment_pack_id].push(n);
      }
      if (private_pass_id !== undefined) {
        if (byPrivatePass[private_pass_id] === undefined) {
          byPrivatePass[private_pass_id] = [];
        }
        byPrivatePass[private_pass_id].push(n);
      }
      if (meta_activity_id !== undefined && meta_activity_id !== null) {
        const _path = [
          meta_activity_id.toString(),
          'bySession',
          notify_booking_nb.toString(),
          kind.toString(),
        ];

        !get(bookings, _path) && setWith(bookings, _path, [], Object);
        bookings[meta_activity_id.toString()].identifier = 'meta_activity';
        bookings[meta_activity_id.toString()].bySession[notify_booking_nb][
          kind
        ].push(n);
      }
      if (establishment_id !== undefined && establishment_id !== null) {
        const _path = [
          establishment_id.toString(),
          'bySession',
          notify_booking_nb.toString(),
          kind.toString(),
        ];

        !get(bookings, _path) && setWith(bookings, _path, [], Object);
        bookings[establishment_id.toString()].identifier = 'establishment';
        bookings[establishment_id.toString()].bySession[notify_booking_nb][
          kind
        ].push(n);
      }
      if (private_service_id !== undefined && private_service_id !== null) {
        const _path = [
          private_service_id.toString(),
          'bySession',
          notify_booking_nb.toString(),
          kind.toString(),
        ];

        !get(privateBookings, _path) &&
          setWith(privateBookings, _path, [], Object);
        privateBookings[private_service_id.toString()].identifier =
          'private_service';
        privateBookings[private_service_id.toString()].bySession[
          notify_booking_nb
        ][kind].push(n);
      }
    });

    return { byPaymentPack, byPrivatePass, bookings, privateBookings };
  },
);

export const withPrivateBookingNotification = (selector: any) =>
  createSelector(
    [selector, getPrivateBookingNotifications],
    (serviceList: any, notifList) =>
      serviceList.map((service: any) => {
        if (
          notifList.find(
            (notif: any) => notif.event_rules.private_service_id === service.id,
          ) !== undefined
        ) {
          return { ...service, hasActiveNotification: true };
        }
        return { ...service, hasActiveNotification: false };
      }),
  );

export const withBookingNotification = (selector: any) =>
  createSelector(
    [selector, getBookingNotifications],
    (itemList: any, notifList) =>
      itemList.map((item: any) => {
        if (
          notifList.find(
            (notif: any) =>
              notif.event_rules.establishment_id === item.id ||
              notif.event_rules.meta_activity_id === item.id,
          ) !== undefined
        ) {
          return { ...item, hasActiveNotification: true };
        }
        return { ...item, hasActiveNotification: false };
      }),
  );

export const withPaymentPackNotification = (selector: any) =>
  createSelector(
    [selector, getPaymentPackNotifications],
    (packList: any, notifList) =>
      packList.map((pack: any) => {
        if (
          notifList.find(
            (notif: any) => notif.event_rules.payment_pack_id === pack.id,
          ) !== undefined
        ) {
          return { ...pack, hasActiveNotification: true };
        }
        return { ...pack, hasActiveNotification: false };
      }),
  );
