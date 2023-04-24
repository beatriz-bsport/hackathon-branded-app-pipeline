// @ts-nocheck
import { createAction } from 'redux-actions';
import { Dispatch } from '../../state/types';

import { ACTION_MODE_DOWNLOAD, DISPLAY_INFORMATION } from './types';

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
  actionMode: string = ACTION_MODE_DOWNLOAD,
  displayMode: string = DISPLAY_INFORMATION,
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

export function deletebackgroundDialog(backgroundDialogId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundDialogDestroy(backgroundDialogId));
  };
}
