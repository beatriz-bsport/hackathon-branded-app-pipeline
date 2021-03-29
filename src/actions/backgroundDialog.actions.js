import { createAction } from 'redux-actions';
import { Dispatch } from '../state/types';

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
) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundDialogDisplay({ uuid, title, message, link }));
  };
}

export function deletebackgroundDialog(backgroundDialogId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundDialogDestroy(backgroundDialogId));
  };
}
export const backgroundDialogSuccess = displayBackgroundDialog('success');

export const backgroundDialog = {
  success: backgroundDialogSuccess,
};
