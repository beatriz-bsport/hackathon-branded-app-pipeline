import { createAction } from 'redux-actions';

import {
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
  // @ts-ignore
} from '@bsport/common/lib/master-data/alerting_kind';
import api from './api';

import { Dispatch, ThunkAction } from '../../state/types';
import { RootState } from "../../reducers";

const ALERT_KINDS = [
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
].map((ak) => ak.alert_kind);

export const listActions = {
  error: createAction('ALERTING/LIST/ERROR'),
  isLoading: createAction('ALERTING/LIST/IS_LOADING'),
  success: createAction('ALERTING/LIST/SUCCESS'),
};

export const performActionAction = {
  error: createAction('ALERTING/ACTION/ERROR'),
  isLoading: createAction('ALERTING/ACTION/IS_LOADING'),
  success: createAction('ALERTING/ACTION/SUCCESS'),
};

export const deleteActions = {
  error: createAction('ALERTING/DELETE/ERROR'),
  isLoading: createAction('ALERTING/DELETE/IS_LOADING'),
  success: createAction('ALERTING/DELETE/SUCCESS'),
};

export function delete_(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteActions.isLoading(true));
    dispatch(deleteActions.error(null));

    try {
      await api.delete_(id);

      dispatch(deleteActions.success(id));
    } catch (error) {
      dispatch(deleteActions.error(error));
    }

    dispatch(deleteActions.isLoading(false));
  };
}

export function fetchAll(): ThunkAction {
  return async (dispatch: Dispatch) => {
    ALERT_KINDS.map((al) => dispatch(fetch(al, 1)));
  };
}

export function fetchMoreAlertingKind(kind: number) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetch(kind, getState().alerting.items_by_kind[kind].next));
  };
}

export function fetch(alert_kind: number, page: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(listActions.isLoading({ isLoading: true, alert_kind }));
    dispatch(listActions.error(null));

    try {
      const response = await api.fetch(alert_kind, page);

      dispatch(listActions.success({ page, alert_kind, ...response.data }));
    } catch (error) {
      dispatch(listActions.error(error));
    }

    dispatch(listActions.isLoading({ alert_kind, isLoading: false }));
  };
}

export function performAction(id: number, action_name: string): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(performActionAction.isLoading({ id, isLoading: true }));
    dispatch(performActionAction.error(null));

    try {
      const response = await api.performAction(id, action_name);
      dispatch(performActionAction.success(response.data));
    } catch (error) {
      dispatch(performActionAction.error(error));
    }

    dispatch(performActionAction.error(null));
    dispatch(performActionAction.isLoading({ id, isLoading: false }));
  };
}
