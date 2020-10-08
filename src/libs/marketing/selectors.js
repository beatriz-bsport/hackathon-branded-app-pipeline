// @flow

import { createSelector } from 'reselect';

import type { State } from '../../state/types';

const BIRTHDAY_NOTIFICATION = 0;

export const getAllMarketingNotification = (state: State) =>
  state.marketingNotification.notifications;

export const getCelebrationBirthday = createSelector(
  getAllMarketingNotification,
  (notifications) =>
    notifications.find(
      (notification) => notification.kind === BIRTHDAY_NOTIFICATION,
    ),
);
