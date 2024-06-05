import { createAction } from 'redux-actions';

import { AccessStatus } from '#libs/access-control/constants';

import type { MemberMinimal } from '#libs/member/types';
import type { ThunkAction, Dispatch } from '../../state/types';
import type {
  SnackKind,
  BackgroundSnackKind,
  AccessControlSnack,
} from './types';

export const snackbarDisplay = createAction('SNACKBAR/DISPLAY');
export const snackbarDestroy = createAction('SNACKBAR/DESTROY');

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const id = 0;
export function displaySnackbar(kind: SnackKind) {
  return (message: string) => async (dispatch: Dispatch) => {
    const myId = id + 1;
    dispatch(snackbarDisplay({ id: myId, message, kind }));
    await sleep(5000);
    dispatch(snackbarDestroy(myId));
  };
}

export function deleteSnackbar(snackbarId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(snackbarDestroy(snackbarId));
  };
}

export const snackbarSuccess = displaySnackbar('success');
export const snackbarError = displaySnackbar('error');
export const snackbarInfo = displaySnackbar('info');
export const snackbarWarning = displaySnackbar('warning');

export const snackbar = {
  success: snackbarSuccess,
  error: snackbarError,
  info: snackbarInfo,
  warning: snackbarWarning,
};

export const backgroundSnackbarDestroy = createAction(
  'BACKGROUND_SNACKBAR/DESTROY',
);
export const backgroundSnackbarDisplay = createAction(
  'BACKGROUND_SNACKBAR/DISPLAY',
);

export function pendingBackgroundSnackbar(
  uuid: string,
  backgroundMessage: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      backgroundSnackbarDisplay({
        uuid,
        backgroundMessage,
        kind: 'pending',
      }),
    );
  };
}

export function displayBackgroundSnackbar(kind: BackgroundSnackKind) {
  return (uuid: string, backgroundMessage: string) =>
    async (dispatch: Dispatch) => {
      dispatch(backgroundSnackbarDisplay({ uuid, backgroundMessage, kind }));
      await sleep(5000);
      dispatch(backgroundSnackbarDestroy(uuid));
    };
}

export function deleteBackgroundSnackbar(uuid: string) {
  return async (dispatch: Dispatch) => {
    dispatch(backgroundSnackbarDestroy(uuid));
  };
}

export const backgroundSnackbarSuccess = displayBackgroundSnackbar('success');
export const backgroundSnackbarError = displayBackgroundSnackbar('error');
export const backgroundSnackbarWarning = displayBackgroundSnackbar('warning');

export const bottomSnackbarDisplay = createAction('BOTTOM_SNACKBAR/DISPLAY');
export const bottomSnackbarDestroy = createAction('BOTTOM_SNACKBAR/DESTROY');

const bottomId = 0;
export function displayBottomSnackbar(kind: SnackKind) {
  return (message: string) => async (dispatch: Dispatch) => {
    const myId = bottomId + 1;
    dispatch(bottomSnackbarDisplay({ id: myId, message, kind }));
    await sleep(5000);
    dispatch(bottomSnackbarDestroy(myId));
  };
}

export function deleteBottomSnackbar(snackbarId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(bottomSnackbarDestroy(snackbarId));
  };
}

export const bottomSnackbarSuccess = displayBottomSnackbar('success');
export const bottomSnackbarError = displayBottomSnackbar('error');
export const bottomSnackbarInfo = displayBottomSnackbar('info');
export const bottomSnackbarWarning = displayBottomSnackbar('warning');

export const bottomSnackbar = {
  success: bottomSnackbarSuccess,
  error: bottomSnackbarError,
  info: bottomSnackbarInfo,
  warning: bottomSnackbarWarning,
};

export const accessControlSnackBarDisplay = createAction<AccessControlSnack>(
  'ACCESS_CONTROL_SNACKBAR/DISPLAY',
);
export const accessControlSnackBarDestroy = createAction<number>(
  'ACCESS_CONTROL_SNACKBAR/DESTROY',
);

export function displayAccessControlSnackbar(
  memberVisitId: number,
  member: MemberMinimal,
  access_status: AccessStatus,
): ThunkAction {
  return async (dispatch) => {
    dispatch(
      accessControlSnackBarDisplay({
        id: memberVisitId,
        member,
        accessStatus: access_status,
      }),
    );
    await sleep(5000);
    dispatch(accessControlSnackBarDestroy(memberVisitId));
  };
}

export function deleteAccessControlSnackbar(memberVisitId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(accessControlSnackBarDestroy(memberVisitId));
  };
}
