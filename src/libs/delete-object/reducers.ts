import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { DeleteObjectState, DeleteObjectSection } from './types';
import type { CheckDeleteEstablishmentData } from './types/establishment';
import { checkDeleteEstablishmentActions } from './actions';

const getDefaultDeleteObjectSection = (): DeleteObjectSection<null> => ({
  canDestroy: false,
  error: null,
  id: null,
  isLoading: false,
  checkData: null,
});

export const initialState: Immutable.Immutable<DeleteObjectState> =
  Immutable<DeleteObjectState>({
    establishment: getDefaultDeleteObjectSection(),
  });

export default handleActions<Immutable.Immutable<DeleteObjectState>, any>(
  {
    [checkDeleteEstablishmentActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['establishment', 'isLoading'], payload);
    },
    [checkDeleteEstablishmentActions.success.toString()]: (
      state,
      { payload }: { payload: CheckDeleteEstablishmentData & { id: number } },
    ) => {
      return state
        .setIn(['establishment', 'id'], payload.id)
        .setIn(['establishment', 'canDestroy'], payload.can_destroy)
        .setIn(['establishment', 'checkData'], payload);
    },
    [checkDeleteEstablishmentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['establishment', 'error'], payload);
    },
    [checkDeleteEstablishmentActions.clear.toString()]: (state) => {
      return state.setIn(['establishment'], getDefaultDeleteObjectSection());
    },
  },
  initialState,
);
