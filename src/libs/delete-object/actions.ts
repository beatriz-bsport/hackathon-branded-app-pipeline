import { createAction } from 'redux-actions';

import { checkDeleteEstablishment as checkDeleteEstablishmentAPI } from './api';

import type { ThunkAction } from '#src/state/types';
import type { CheckDeleteEstablishmentData } from '#src/libs/delete-object/types/establishment';
import type { CheckDeleteObjectActions } from './types';

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
