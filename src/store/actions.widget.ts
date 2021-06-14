import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';

import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';
import { getEnv } from '../utils/utils';

/**
 * @params { url: string, dialogMode: 0 | 1 | 2 }
 */
export const setDialogAction: (args: {
  url: string,
  dialogMode: 0 | 1 | 2,
  isFabContext?: boolean,
}) => any = createAction('WIDGET_SET_IFRAME_URL');

export const closeDialogAction = () => (dispatch: Dispatch) => {
  dispatch(setDialogAction({ url: '', dialogMode: 0 }));
};

export const fabShowLogin = () => (dispatch: Dispatch, getState: any) => {
  const { PUBLIC_URL } = getEnv();
  const { company } = getState().theme.theme;

  const url = `${PUBLIC_URL}/login?membership=${company}&context=widget`;
  dispatch(
    setDialogAction({
      url,
      dialogMode: DIALOG_MODE_IFRAME,
      isFabContext: true,
    }),
  );
};

export const fabShowBasket = () => (dispatch: Dispatch, getState: any) => {
  const { company, company_name } = getState().theme.theme;
  const { PUBLIC_URL } = getEnv();
  const url = `${PUBLIC_URL}/widget/${company_name}/${company}/basket?context=widget`;
  dispatch(setDialogAction({ url, dialogMode: DIALOG_MODE_IFRAME }));
};

export const fabShowBookings = () => (dispatch: Dispatch, getState: any) => {
  const { company, company_name } = getState().theme.theme;
  const { PUBLIC_URL } = getEnv();
  const url = `${PUBLIC_URL}/widget/${company_name}/${company}/bookings?context=widget`;
  dispatch(setDialogAction({ url, dialogMode: DIALOG_MODE_IFRAME }));
};

export const fabShowProfile = () => (dispatch: Dispatch, getState: any) => {
  const { company, company_name } = getState().theme.theme;
  const { PUBLIC_URL } = window.runtime.env;
  const url = `${PUBLIC_URL}/widget/${company_name}/${company}/profile?context=widget`;
  dispatch(setDialogAction({ url, dialogMode: DIALOG_MODE_IFRAME }));
};
export const fabShowSubscription = () => (
  dispatch: Dispatch,
  getState: any
) => {
  const { company, company_name } = getState().theme.theme;
  const { PUBLIC_URL } = window.runtime.env;
  const url = `${PUBLIC_URL}/widget/${company_name}/${company}/subscription?context=widget`;
  dispatch(setDialogAction({ url, dialogMode: DIALOG_MODE_IFRAME }));
};
export const setSaasAuthenticated = createAction('SET_SAAS_AUTHENTICATED');
export const setSaasBasketCount = createAction('SET_SAAS_BASKET');
export const setSaasBookingsCount = createAction('SET_SAAS_BOOKINGS');

export const refreshVODRequestAccessFlagAction = createAction(
  'REFRESH_VOD_REQUEST_ACCESS_FLAG',
);
