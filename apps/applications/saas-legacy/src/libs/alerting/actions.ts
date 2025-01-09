import { createAction } from 'redux-actions';

import {
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  UNREAD_COMMUNICATION,
  COMPANY_ONBOARDING_ALERT,
  UNPAID_PRIVATE_BOOKING_ALERT,
  NEW_TUTORIAL_SECTION_OR_LESSON,
  REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
} from '@bsport/common/lib/master-data/alerting_kind.js';
import { StatusCode } from '@bsport/common/lib/master-data/planned-invoice-status.js';
import type { RootState } from 'src/reducers';
import type { Dispatch, OptionCallback, ThunkAction } from 'src/state/types';
import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#src/libs/platform-billing/upsell-identifiers';
import { updateTutorialLessonUserCompletionStatusAction } from '#src/libs/platform-tutorial/actions';
import { flagAsReadActions as updateUnreadCommunicationAsReadAction } from '#src/libs/communication-v2/actions';
import type { AlertPayloadSuccess, AlertPayloadLoading } from './types';
import api from './api';

const ALERT_KINDS = [
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  UNREAD_COMMUNICATION,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
  UNPAID_PRIVATE_BOOKING_ALERT,
  NEW_TUTORIAL_SECTION_OR_LESSON,
  REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
].map((ak) => ak.alert_kind);

export const listActions = {
  error: createAction<Error | null>('ALERTING/LIST/ERROR'),
  isLoading: createAction<AlertPayloadLoading>('ALERTING/LIST/IS_LOADING'),
  success: createAction<AlertPayloadSuccess>('ALERTING/LIST/SUCCESS'),
};

export function fetchAll(): ThunkAction {
  return async (dispatch: Dispatch) =>
    ALERT_KINDS.map((al) => dispatch(fetch(al, 1)));
}

export function refreshAlertingByKind(alert_kind: number): ThunkAction {
  return async (dispatch: Dispatch) => dispatch(fetch(alert_kind, 1, true));
}

export function fetchMoreAlertingKind(kind: number) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetch(kind, getState().alerting.items_by_kind[kind].next));
  };
}

export function fetch(
  alert_kind: number,
  page: number,
  invalidateCache: boolean = false,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const state = getState();
    if (
      alert_kind === REPLACEMEMENT_REQUEST_LATE_ALERT_KIND.alert_kind &&
      !state.company.feature.data.upsell.find(
        (u) => u.upsell_identifier === UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
      )
    )
      return;

    dispatch(listActions.isLoading({ isLoading: true, alert_kind }));
    dispatch(listActions.error(null));

    try {
      const response = await api.fetch(alert_kind, page, invalidateCache);

      dispatch(listActions.success({ page, alert_kind, ...response.data }));
    } catch (error) {
      dispatch(listActions.error(error));
    }

    dispatch(listActions.isLoading({ alert_kind, isLoading: false }));
  };
}

const ACTIONS_DICT = {
  [NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind]:
    updateTutorialLessonUserCompletionStatusAction,
  [UNREAD_COMMUNICATION.alert_kind]: updateUnreadCommunicationAsReadAction,
};

export function deleteAlert(
  alert_kind: number,
  id: number,
  options?: OptionCallback<StatusCode>,
): ThunkAction {
  const customActions = ACTIONS_DICT[alert_kind];
  return async (dispatch: Dispatch) => {
    dispatch(customActions.error(null));
    dispatch(customActions.isLoading(true));

    try {
      const response = await api.deleteAlert(alert_kind, id);

      dispatch(customActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(customActions.error(error));
      options?.onError && options.onError(error);
    }

    dispatch(customActions.isLoading(false));
  };
}
