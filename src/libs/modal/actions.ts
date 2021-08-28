import { Dispatch } from 'redux';

import { createAction } from 'redux-actions';

import { Theme as CompanyTheme } from 'bsport-saas/src/libs/theme/types';

import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';
import { getEnv } from '../../utils/env';
import { buildUrlParams } from '../../utils/http';

const buildWidgetUrl = (path: string, theme: CompanyTheme, params?: any) => {
  const { company, company_name } = theme;
  const { PUBLIC_URL } = getEnv();
  return `${PUBLIC_URL}/widget/${company_name}/${company}/${path}${buildUrlParams(
    { context: 'widget', ...(params || {}) },
  )}`;
};

export const openUserInteractionPortal: (args: {
  url: string,
  dialogMode: 0 | 1 | 2,
  isFabContext?: boolean,
}) => any = createAction('WIDGET_SET_IFRAME_URL');

export const closeUserInteractionPortal = () => (dispatch: Dispatch) => {
  dispatch(openUserInteractionPortal({ url: '', dialogMode: 0 }));
};

export const fabShowLogin = () => (dispatch: Dispatch, getState: any) => {
  const { theme } = getState().theme;
  const { company } = theme;
  const { PUBLIC_URL } = getEnv();

  dispatch(
    openUserInteractionPortal({
      url: `${PUBLIC_URL}/login?membership=${company}&context=widget`,
      dialogMode: DIALOG_MODE_IFRAME,
      isFabContext: true,
    }),
  );
};

export const fabShowBasket = () => (dispatch: Dispatch, getState: any) => {
  const { theme } = getState().theme;
  dispatch(
    openUserInteractionPortal({
      url: buildWidgetUrl('basket', theme),
      dialogMode: DIALOG_MODE_IFRAME,
    }),
  );
};

export const fabShowBookings = () => (dispatch: Dispatch, getState: any) => {
  const { theme } = getState().theme;
  dispatch(
    openUserInteractionPortal({
      url: buildWidgetUrl('bookings', theme),
      dialogMode: DIALOG_MODE_IFRAME,
    }),
  );
};

export const fabShowProfile = () => (dispatch: Dispatch, getState: any) => {
  const { theme } = getState().theme;
  dispatch(
    openUserInteractionPortal({
      url: buildWidgetUrl('profile', theme),
      dialogMode: DIALOG_MODE_IFRAME,
    }),
  );
};
export const fabShowSubscription = () => (
  dispatch: Dispatch,
  getState: any,
) => {
  const { theme } = getState().theme;
  dispatch(
    openUserInteractionPortal({
      url: buildWidgetUrl('subscription', theme),
      dialogMode: DIALOG_MODE_IFRAME,
    }),
  );
};
