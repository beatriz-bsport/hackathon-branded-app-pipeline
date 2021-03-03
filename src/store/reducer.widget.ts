import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import URI from 'urijs';

import {
  refreshVODRequestAccessFlagAction,
  setDialogAction,
  setSaasAuthenticated,
  setSaasBasketCount,
  setSaasBookingsCount,
} from './actions.widget';

export type WidgetState = {
  dialog: {
    url: string,
    dialogMode: 0 | 1 | 2,
  },
  requestVideoAccessRefreshFlag: number, // TODO remove this when login done for VOD
  isFabContext?: boolean | null,
  saas: {
    authenticated: boolean,
    basketCount: number | null,
    bookingsCount: number | null,
  },
};

export const initialState: Immutable.Immutable<WidgetState> = Immutable<WidgetState>(
  {
    dialog: {
      url: '',
      dialogMode: 0,
    },
    isFabContext: false,
    requestVideoAccessRefreshFlag: 0, // TODO remove this when login done for VOD
    saas: {
      authenticated: false,
      basketCount: null,
      bookingsCount: null,
    },
  }
);

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    [setDialogAction.toString()]: (state, { payload }: any) => {
      const uri = URI(payload.url);
      uri.toString() && uri.addQuery('open_at', Date.now());

      return state
        .setIn(['dialog', 'url'], uri.toString())
        .setIn(['dialog', 'dialogMode'], payload.dialogMode)
        .setIn(['isFabContext'], payload.isFabContext);
    },
    /** SAAS DATA */
    [setSaasAuthenticated.toString()]: (state, { payload }: any) => {
      return state.setIn(['saas', 'authenticated'], payload);
    },
    [setSaasBasketCount.toString()]: (state, { payload }: any) => {
      return state.setIn(['saas', 'basketCount'], payload);
    },
    [setSaasBookingsCount.toString()]: (state, { payload }: any) => {
      return state.setIn(['saas', 'bookingsCount'], payload);
    },
    [refreshVODRequestAccessFlagAction.toString()]: (state) => {
      return state.setIn(
        ['saas', 'requestVideoAccessRefreshFlag'],
        state.requestVideoAccessRefreshFlag + 1
      );
    },
  },
  initialState
);
