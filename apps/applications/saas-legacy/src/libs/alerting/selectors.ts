import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import {
  NEW_TUTORIAL_SECTION_OR_LESSON,
  UNEVEN_INVOICE_ALERT,
  UNREAD_COMMUNICATION,
} from '@bsport/common/master-data/alerting_kind.js';
import type { RootState } from 'src/reducers';
import { PAYMENT_ENGINE_STRIPE } from '@bsport/common/master-data/payment-group.js';
import { getObjectPermissions } from '#src/libs/role/selectors';
import { hasObjectLevelPermission } from '#src/libs/role/permission-utils/utils';
import type { AlertingState } from './types';
import { AlertKind } from './constants';

const getState = (state: RootState) => state.alerting;

const countTutorialAlerting = createSelector(getState, (alertingState) => {
  if (
    Object.prototype.hasOwnProperty.call(
      alertingState.items_by_kind,
      NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind,
    )
  ) {
    return alertingState.items_by_kind[
      NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind
    ].count;
  }
  return 0;
});

const ALERTING_NOT_IN_GENERAL_COUNT = [UNREAD_COMMUNICATION.alert_kind];
const ALERTING_GENERAL_COUNT_PERMISSIONS_REQUIRED = {
  [UNEVEN_INVOICE_ALERT.alert_kind]: 'billing.allowed_actions.readInvoices',
};

const countAlerting = createSelector(
  [getState, getObjectPermissions],
  (alertingState, objectLevelPermissions) => {
    let count = 0;

    Object.entries(alertingState.items_by_kind).forEach(([alertKind, data]) => {
      const requiredPermission =
        ALERTING_GENERAL_COUNT_PERMISSIONS_REQUIRED[parseInt(alertKind)];

      if (
        !ALERTING_NOT_IN_GENERAL_COUNT.includes(parseInt(alertKind)) &&
        (!requiredPermission ||
          hasObjectLevelPermission(objectLevelPermissions, requiredPermission))
      ) {
        count += data.count || 0;
      }
    });

    return count;
  },
);

const countAlertingForKind = createSelector(
  [getState, (_: RootState, kind: number) => kind],
  (alertingState, kind) => {
    let count = 0;
    for (const k in alertingState.items_by_kind) {
      if (
        parseInt(k) === parseInt(kind?.toString()) &&
        Object.prototype.hasOwnProperty.call(alertingState.items_by_kind, k)
      ) {
        count += alertingState.items_by_kind[k].count || 0;
      }
    }
    return count;
  },
);

const getByKind = createSelector(getState, (alertingState: AlertingState) => {
  const byKind = [];
  for (const k in alertingState.items_by_kind) {
    if (Object.prototype.hasOwnProperty.call(alertingState.items_by_kind, k)) {
      byKind.push({ alert_kind: k, ...alertingState.items_by_kind[k] });
    }
  }
  return Immutable(byKind);
});

const getOneKind = createSelector(
  [getState, (_: RootState, kind: number) => kind],
  (alertingState, kind) => {
    const byKind = [];
    for (const k in alertingState.items_by_kind) {
      if (
        parseInt(k) === parseInt(kind?.toString()) &&
        Object.prototype.hasOwnProperty.call(alertingState.items_by_kind, k)
      ) {
        byKind.push({ alert_kind: k, ...alertingState.items_by_kind[k] });
      }
    }
    return Immutable(byKind);
  },
);

const getCompanyOnboardingAlerting = (state: RootState) =>
  getOneKind(state, AlertKind.COMPANY_ONBOARDING);

const getStripeCompanyOnboardingAlerting = createSelector(
  [getCompanyOnboardingAlerting],
  (byKind) => {
    return byKind[0]?.results?.filter(
      (item) =>
        'payment_engine_identifier' in item?.data &&
        item?.data?.payment_engine_identifier === PAYMENT_ENGINE_STRIPE,
    );
  },
);

export default {
  countAlerting,
  countAlertingForKind,
  countTutorialAlerting,
  getByKind,
  getOneKind,
  getStripeCompanyOnboardingAlerting,
};
