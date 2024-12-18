import { createAction } from 'redux-actions';

import {
  checkDeleteEstablishment as checkDeleteEstablishmentAPI,
  checkDeleteEstablishmentGroup as checkDeleteEstablishmentGroupAPI,
} from './api';

import type { ThunkAction } from '#src/state/types';
import type { CheckDeleteEstablishmentData } from '#src/libs/delete-object/types/establishment';
import type { CheckDeleteObjectActions } from './types';
import type { CheckDeleteEstablishmentGroupData } from './types/establishmentGroup';

// ------------- ESTABLISHMENT -------------

export const checkDeleteEstablishmentActions: CheckDeleteObjectActions<CheckDeleteEstablishmentData> =
  {
    loading: createAction('DELETE_OBJECT/ESTABLISHMENT/LOADING'),
    success: createAction('DELETE_OBJECT/ESTABLISHMENT/SUCCESS'),
    error: createAction('DELETE_OBJECT/ESTABLISHMENT/ERROR'),
    clear: createAction('DELETE_OBJECT/ESTABLISHMENT/CLEAR'),
  };

export const checkDeleteEstablishment =
  (id: number): ThunkAction =>
  async (dispatch) => {
    dispatch(checkDeleteEstablishmentActions.clear());
    dispatch(checkDeleteEstablishmentActions.loading(true));
    try {
      const response = await checkDeleteEstablishmentAPI(id);
      dispatch(
        checkDeleteEstablishmentActions.success({ ...response.data, id }),
      );
    } catch (error) {
      dispatch(checkDeleteEstablishmentActions.error(error));
    }
    dispatch(checkDeleteEstablishmentActions.loading(false));
  };

// ------------- ESTABLISHMENT GROUP -------------

export const checkDeleteEstablishmentGroupActions: CheckDeleteObjectActions<CheckDeleteEstablishmentGroupData> =
  {
    loading: createAction('DELETE_OBJECT/ESTABLISHMENT_GROUP/LOADING'),
    success: createAction('DELETE_OBJECT/ESTABLISHMENT_GROUP/SUCCESS'),
    error: createAction('DELETE_OBJECT/ESTABLISHMENT_GROUP/ERROR'),
    clear: createAction('DELETE_OBJECT/ESTABLISHMENT_GROUP/CLEAR'),
  };

export const checkDeleteEstablishmentGroup =
  (id: number): ThunkAction =>
  async (dispatch) => {
    dispatch(checkDeleteEstablishmentGroupActions.clear());
    dispatch(checkDeleteEstablishmentGroupActions.loading(true));
    try {
      const response = await checkDeleteEstablishmentGroupAPI(id);
      dispatch(
        checkDeleteEstablishmentGroupActions.success({ ...response.data, id }),
      );
    } catch (error) {
      dispatch(checkDeleteEstablishmentGroupActions.error(error));
    }
    dispatch(checkDeleteEstablishmentGroupActions.loading(false));
  };
