import { Dispatch } from 'redux';

import { createAction } from 'redux-actions';

import { Theme as CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';

import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { getEnv } from '../../utils/env';
import { buildUrlParams } from '../../utils/http';
import { RootState } from '../../reducers';
import { SafeURI } from '../../widgets/utils';
import type { DialogMode } from './types';
import { ConsumerSpaceContextEnum } from '@bsport/saas-legacy/src/libs/consumer-space/constants';

const buildWidgetUrl = (path: string, theme: CompanyTheme, params?: any) => {
  const { company, company_name } = theme;
  const { PUBLIC_URL } = getEnv();
  return `${PUBLIC_URL}/widget/${company_name}/${company}/${path}${buildUrlParams(
    { context: 'widget', ...(params || {}) },
  )}`;
};

export const openUserInteractionPortal: (args: {
  url: string;
  dialogMode: DialogMode;
  isFabContext?: boolean;
  fullScreenPopup?: boolean;
  consumerspacecontext?: ConsumerSpaceContextEnum;
}) => any = createAction('WIDGET_SET_IFRAME_URL');

export const closeUserInteractionPortal = () => (dispatch: Dispatch) => {
  dispatch(openUserInteractionPortal({ url: '', dialogMode: 0 }));
};

export const fabShowLogin =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    const { company } = theme;
    const { PUBLIC_URL } = getEnv();

    dispatch(
      openUserInteractionPortal({
        url: `${PUBLIC_URL}/login${buildUrlParams({
          membership: company,
          context: 'widget',
          next: `/c/${company}/booking/`,
          consumerspacecontext: ConsumerSpaceContextEnum.FAB,
        })}`,
        dialogMode: DIALOG_MODE_IFRAME,
        isFabContext: true,
      }),
    );
  };

export const genericShowLogin =
  ({
    dialogMode,
    fullScreenPopup = true,
    parentElementId,
    widgetType,
  }: {
    dialogMode: DialogMode;
    widgetType: string;
    parentElementId: string;
    fullScreenPopup?: boolean;
  }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const { company } = getState()?.theme?.theme;
    const { PUBLIC_URL } = getEnv();
    const uri = new SafeURI(
      `${PUBLIC_URL}/login?membership=${company}&context=widget`,
    )
      .safeAddQuery('dialogMode', dialogMode)
      .safeAddQuery('widgetType', widgetType)
      .safeAddQuery('parentElementId', parentElementId)
      .valueOf();

    dispatch(
      openUserInteractionPortal({
        url: uri,
        dialogMode,
        fullScreenPopup,
      }),
    );
  };

export const genericShowSignup =
  ({
    dialogMode,
    fullScreenPopup = true,
    parentElementId,
    widgetType,
  }: {
    dialogMode: DialogMode;
    widgetType: string;
    parentElementId: string;
    fullScreenPopup?: boolean;
  }) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const { company } = getState()?.theme?.theme;
    if (!company) {
      return;
    }
    const { PUBLIC_URL } = getEnv();
    const uri = new SafeURI(
      `${PUBLIC_URL}/login/signup?membership=${company}&context=widget`,
    )
      .safeAddQuery('dialogMode', dialogMode)
      .safeAddQuery('widgetType', widgetType)
      .safeAddQuery('parentElementId', parentElementId)
      .valueOf();

    dispatch(
      openUserInteractionPortal({
        url: uri,
        dialogMode,
        fullScreenPopup,
      }),
    );
  };

export const fabShowBasket =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    dispatch(
      openUserInteractionPortal({
        url: buildWidgetUrl('basket', theme),
        dialogMode: DIALOG_MODE_IFRAME,
      }),
    );
  };

export const fabShowBookings =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    dispatch(
      openUserInteractionPortal({
        url: buildWidgetUrl('bookings', theme, {
          consumerspacecontext: ConsumerSpaceContextEnum.FAB,
        }),
        dialogMode: DIALOG_MODE_IFRAME,
      }),
    );
  };

export const fabShowProfile =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    dispatch(
      openUserInteractionPortal({
        url: buildWidgetUrl('profile', theme, {
          consumerspacecontext: ConsumerSpaceContextEnum.FAB,
        }),
        dialogMode: DIALOG_MODE_IFRAME,
      }),
    );
  };

export const fabShowAgentChat =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    dispatch(
      openUserInteractionPortal({
        url: buildWidgetUrl('agent-chat', theme, {
          consumerspacecontext: ConsumerSpaceContextEnum.FAB,
        }),
        dialogMode: DIALOG_MODE_IFRAME,
      }),
    );
  };

export const fabShowSubscription =
  () => (dispatch: Dispatch, getState: () => RootState) => {
    const { theme } = getState().theme;
    dispatch(
      openUserInteractionPortal({
        url: buildWidgetUrl('subscription', theme, {
          consumerspacecontext: ConsumerSpaceContextEnum.FAB,
        }),
        dialogMode: DIALOG_MODE_IFRAME,
      }),
    );
  };
