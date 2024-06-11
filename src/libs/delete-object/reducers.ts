import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { DeleteObjectState, DeleteObjectSection } from './types';
import type { CheckDeleteEstablishmentData } from './types/establishment';

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
  {}, initialState,
);
