import { createAction } from 'redux-actions';
import { Dispatch } from '../../state/types';

import {
  BackgroundDialogActionMode,
  BackgroundDialogDisplayMode,
} from './types';

export const backgroundDialogDisplay = createAction(
  'BACKGROUND_DIALOG/DISPLAY',
);
export const backgroundDialogDestroy = createAction(
  'BACKGROUND_DIALOG/DESTROY',
);

export function displayBackgroundDialog(
  uuid: string,
  message: string,
  title: string,
  link: string,
  actionMode: BackgroundDialogActionMode = BackgroundDialogActionMode.DOWNLOAD,
  displayMode: BackgroundDialogDisplayMode = BackgroundDialogDisplayMode.INFORMATION,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      backgroundDialogDisplay({
        uuid,
        title,
        message,
        link,
        actionMode,
        displayMode,
      }),
    );
  };
}

export function deletebackgroundDialog(backgroundDialogId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundDialogDestroy(backgroundDialogId));
  };
}
