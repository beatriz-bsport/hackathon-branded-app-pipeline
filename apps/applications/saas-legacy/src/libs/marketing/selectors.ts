import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import get from 'lodash/get';
import setWith from 'lodash/setWith';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import { Contract } from '#src/libs/subscription/types';
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

const _getNotificationsIdsByEstablishmentGroup = (state: RootState) =>
  state.marketingNotification.byEstablishmentGroupId;

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
export const getmarketingNotificationbyEstablishmentGroup: (
  state: RootState,
) => {
  [key: string]: Array<MarketingNotification>;
} = createSelector(
  [_getNotifications, _getNotificationsIdsByEstablishmentGroup],
  (notificationsById, notificationsIdsByEstablishmentGroup) => {
    return Object.keys(notificationsIdsByEstablishmentGroup)?.reduce(
      (acc, key) => {
        // @ts-expect-error
        acc[key] = notificationsIdsByEstablishmentGroup[key]?.map(
          (id) => notificationsById[id],
        );
        return acc as { [key: string]: Array<MarketingNotification> };
      },
      {},
    );
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
        ].includes(notif.kind),
      )
      .filter((notif) => notif.active);
  },
);

export const getPaymentPackNotificationsByPackId = (
  state: RootState,
  packId: number,
) =>
  getPaymentPackNotifications(state).filter(
    (notif) =>
      notif.event_rules.payment_pack_ids.includes(packId) ||
      notif.event_rules.contains_all_payment_packs,
  );

export const getContractNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
        ].includes(notif.kind),
      );
  },
);

const _getContractNotificationLoading = (state: RootState) =>
  state.marketingNotification.loading;

export const getContractDetailNotifications = createSelector(
  [getContractNotifications, _getContractNotificationLoading],
  (notifications, loading) => ({ items: notifications, loading }),
);

export const getPrivatePassNotifications = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
        ].includes(notif.kind),
      )
      .filter((notif) => notif.active);
  },
);

export const getPrivatePassNotificationsByPassId = (
  state: RootState,
  passId: number,
) =>
  getPrivatePassNotifications(state).filter(
    (notif) =>
      notif.event_rules.private_pass_ids.includes(passId) ||
      notif.event_rules.contains_all_private_passes,
  );

export const getNotificationForMarketingPage = createSelector(
  [_getNotificationIds, _getNotifications],
  (ids, data) => {
    return ids
      .map((id) => data[id])
      .filter((notif) =>
        [
          NOTIFICATION_KIND.BIRTHDAY,
          NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
          NOTIFICATION_KIND.BOOKING_CREATION,
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
          NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME,
          NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT,
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
          NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
        ].includes(notif.kind),
      );
  },
);

export const getNotificationGrouped = createSelector(
  [getNotificationForMarketingPage],
  (notifications) => {
    const paymentPacks: MarketingNotification[] = [];
    const privatePasses: MarketingNotification[] = [];
    const byContract: { [key: string]: MarketingNotification[] } = {};
    const bookings: {
      [key: string]: {
        identifier:
          | 'meta_activity'
          | 'establishment'
          | 'private_service'
          | 'establishment_group';
        bySession: {
          [key: string]: { [key: string]: MarketingNotification[] };
        };
      };
    } = {};
    const privateBookings = { ...bookings };
    const birthday: MarketingNotification[] = [];

    notifications.forEach((n) => {
      const {
        establishment_id,
        establishment_group_id,
        meta_activity_id,
        private_service_id,
        notify_booking_nb,
        contract_id,
        kind,
      } = n.event_rules;
      switch (n.kind) {
        case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT:
        case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME:
          paymentPacks.push(n);
          break;
        case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT:
        case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME:
          privatePasses.push(n);
          break;
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION:
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING:
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END:
          if (contract_id !== undefined) {
            if (byContract[contract_id] === undefined) {
              byContract[contract_id] = [];
            }
            byContract[contract_id].push(n);
          }
          break;
        case NOTIFICATION_KIND.BOOKING_CREATION:
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
          if (
            establishment_group_id !== undefined &&
            establishment_group_id !== null
          ) {
            const _path = [
              establishment_group_id.toString(),
              'bySession',
              notify_booking_nb.toString(),
              kind.toString(),
            ];

            !get(bookings, _path) && setWith(bookings, _path, [], Object);
            bookings[establishment_group_id.toString()].identifier =
              'establishment_group';
            bookings[establishment_group_id.toString()].bySession[
              notify_booking_nb
            ][kind].push(n);
          }
          break;
        case NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION:
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
          break;
        case NOTIFICATION_KIND.BIRTHDAY:
          birthday.push(n);
          break;
        default:
      }
    });

    return {
      paymentPacks,
      privatePasses,
      byContract,
      bookings,
      privateBookings,
      birthday,
    };
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
export const withContractNotification = (
  selector: (state: RootState) => Array<Contract>,
) =>
  createSelector(
    [selector, getContractNotifications],
    (contractList: Array<Contract>, notifList: Array<MarketingNotification>) =>
      contractList?.map((contract: Contract) => {
        if (
          notifList?.find(
            (notif: MarketingNotification) =>
              notif.event_rules.contract_id === contract.id,
          ) !== undefined
        ) {
          return { ...contract, hasActiveNotification: true };
        }
        return { ...contract, hasActiveNotification: false };
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

export const withPaymentPackNotification = memoize((selector: any) =>
  createSelector(
    [selector, getPaymentPackNotifications],
    (packList: any, notifList) => {
      if (!packList) return [];
      return packList.map((pack: any) => {
        if (
          notifList.find(
            (notif: any) => notif.event_rules.payment_pack_id === pack.id,
          ) !== undefined
        ) {
          return { ...pack, hasActiveNotification: true };
        }
        return { ...pack, hasActiveNotification: false };
      });
    },
  ),
);
