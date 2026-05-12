import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import URI from 'urijs';

import { openUserInteractionPortal } from './actions';
import type { DialogMode } from './types';

export type ModalState = {
  url: string;
  dialogMode: DialogMode;
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
};

export const initialState: Immutable.Immutable<ModalState> =
  Immutable<ModalState>({
    url: '',
    dialogMode: 0,
    title: undefined,
    subtitle: undefined,
    avatarUrl: undefined,
  });

export default handleActions<Immutable.Immutable<ModalState>>(
  {
    [openUserInteractionPortal.toString()]: (state, { payload }: any) => {
      const uri = URI(payload.url);
      uri.toString() && uri.addQuery('open_at', Date.now());

      window.bsportModalUrlOpen = !!uri.toString();

      return state
        .setIn(['url'], uri.toString())
        .setIn(['dialogMode'], payload.dialogMode)
        .setIn(['title'], payload.title)
        .setIn(['subtitle'], payload.subtitle)
        .setIn(['avatarUrl'], payload.avatarUrl);
    },
  },
  initialState,
);
